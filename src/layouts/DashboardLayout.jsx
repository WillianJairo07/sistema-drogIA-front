import { useState } from "react";
import { Outlet } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import "../styles/dashboard.css";

const initialInventory = [
  {
    id: 1,
    product: "Paracetamol 500 mg",
    purchaseOrderCode: "OC-000101",
    lot: "LOT-PAR-001",
    stock: 120,
    minimumStock: 30,
    expiration: "2027-08-15",
  },
  {
    id: 2,
    product: "Alcohol 70%",
    purchaseOrderCode: "OC-000102",
    lot: "LOT-ALC-002",
    stock: 80,
    minimumStock: 20,
    expiration: "2027-05-20",
  },
  {
    id: 3,
    product: "Ibuprofeno 400 mg",
    purchaseOrderCode: "OC-000103",
    lot: "LOT-IBU-003",
    stock: 45,
    minimumStock: 15,
    expiration: "2026-12-10",
  },
];

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [sales, setSales] = useState([]);
  const [purchaseRequests, setPurchaseRequests] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [inventory, setInventory] = useState(initialInventory);
  const [dispatches, setDispatches] = useState([]);

  const toggleSidebar = () => {
    setSidebarOpen((current) => !current);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const handleCreateSale = (sale) => {
    setSales((currentSales) => [
      ...currentSales,
      {
        ...sale,
        status: "En proceso",
      },
    ]);

    const requests = sale.items.map((item) => ({
      id: `${sale.id}-${item.product.id}`,
      saleId: sale.id,
      saleNumber: sale.number,
      productId: item.product.id,
      product: item.product.name,
      quantity: item.quantity,
      status: "Pendiente de compra",
    }));

    setPurchaseRequests((currentRequests) => [
      ...currentRequests,
      ...requests,
    ]);
  };

  const handleSaleStatusChange = (saleId, status) => {
    setSales((currentSales) =>
      currentSales.map((sale) =>
        sale.id === saleId ? { ...sale, status } : sale
      )
    );
  };

  const handlePurchaseRequestStatusChange = (requestId, status) => {
    setPurchaseRequests((currentRequests) =>
      currentRequests.map((request) =>
        request.id === requestId ? { ...request, status } : request
      )
    );
  };

  const handleCreatePurchaseOrder = (order) => {
    setPurchaseOrders((currentOrders) => [
      ...currentOrders,
      {
        ...order,
        receiptRegistered: false,
      },
    ]);

    order.requestIds?.forEach((requestId) => {
      const request = purchaseRequests.find(
        (item) => item.id === requestId
      );

      handlePurchaseRequestStatusChange(requestId, "En compra");

      if (request) {
        handleSaleStatusChange(request.saleId, "En proceso");
      }
    });
  };

  const handlePurchaseOrderStatusChange = (orderId, status) => {
    setPurchaseOrders((currentOrders) =>
      currentOrders.map((order) =>
        order.id === orderId ? { ...order, status } : order
      )
    );
  };

  const handleRegisterPurchaseReceipt = (orderId) => {
    const order = purchaseOrders.find((item) => item.id === orderId);

    if (!order || order.receiptRegistered) {
      return;
    }

    setInventory((currentInventory) => {
      const updated = currentInventory.map((inventoryItem) => {
        const receivedItem = order.items.find(
          (item) => item.productId === inventoryItem.id
        );

        if (!receivedItem) {
          return inventoryItem;
        }

        return {
          ...inventoryItem,
          purchaseOrderCode: order.number || inventoryItem.purchaseOrderCode,
          stock: inventoryItem.stock + receivedItem.quantity,
        };
      });

      order.items.forEach((receivedItem) => {
        const exists = updated.some(
          (inv) => inv.product.toLowerCase() === receivedItem.product.toLowerCase()
        );
        if (!exists) {
          updated.push({
            id: Date.now() + receivedItem.productId,
            product: receivedItem.product,
            purchaseOrderCode: order.number,
            lot: `LOT-${String(Date.now()).slice(-4)}`,
            stock: receivedItem.quantity,
            minimumStock: 10,
            expiration: "2027-12-31",
          });
        }
      });

      return updated;
    });

    setPurchaseOrders((currentOrders) =>
      currentOrders.map((item) =>
        item.id === orderId
          ? {
              ...item,
              receiptRegistered: true,
            }
          : item
      )
    );

    order.requestIds?.forEach((requestId) => {
      const request = purchaseRequests.find(
        (item) => item.id === requestId
      );

      handlePurchaseRequestStatusChange(requestId, "Recibido");

      if (request) {
        handleSaleStatusChange(request.saleId, "Disponible");
      }
    });
  };

  const handleAddInventoryItem = (newItem) => {
    setInventory((current) => [
      ...current,
      {
        ...newItem,
        id: newItem.id ?? Date.now(),
      },
    ]);
  };

  const handleUpdateInventoryItem = (updatedItem) => {
    setInventory((current) =>
      current.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );
  };

  const handleCreateDispatch = (dispatchRecord) => {
    setDispatches((current) => [
      ...current,
      {
        ...dispatchRecord,
        id: dispatchRecord.id ?? Date.now(),
      },
    ]);
  };

  return (
    <div className="dashboard-screen">
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

      <button
        type="button"
        onClick={toggleSidebar}
        className="sidebar-toggle-btn"
        style={{
          left: sidebarOpen ? "244px" : "-20px",
        }}
      >
        {sidebarOpen ? (
          <ChevronLeft className="h-5 w-5 stroke-[2.5]" />
        ) : (
          <ChevronRight className="h-5 w-5 stroke-[2.5]" />
        )}
      </button>

      <div className="dashboard-main-container">
        <Topbar onToggleSidebar={toggleSidebar} />

        <main className="dashboard-content-area">
          <div className="dashboard-content-wrapper">
            <Outlet
              context={{
                sales,
                onCreateSale: handleCreateSale,
                onSaleStatusChange: handleSaleStatusChange,

                purchaseRequests,
                onPurchaseRequestStatusChange:
                  handlePurchaseRequestStatusChange,

                purchaseOrders,
                onCreatePurchaseOrder: handleCreatePurchaseOrder,
                onPurchaseOrderStatusChange:
                  handlePurchaseOrderStatusChange,
                onRegisterPurchaseReceipt:
                  handleRegisterPurchaseReceipt,

                inventory,
                onAddInventoryItem: handleAddInventoryItem,
                onUpdateInventoryItem: handleUpdateInventoryItem,

                dispatches,
                onCreateDispatch: handleCreateDispatch,
              }}
            />
          </div>
        </main>
      </div>

      {sidebarOpen && (
        <div onClick={closeSidebar} className="sidebar-backdrop" />
      )}
    </div>
  );
}