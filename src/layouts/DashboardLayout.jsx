import { useState } from "react";
import { Outlet } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";

const initialInventory = [
  {
    id: 1,
    product: "Paracetamol 500 mg",
    lot: "LOT-PAR-001",
    stock: 120,
    minimumStock: 30,
    expiration: "2027-08-15",
  },
  {
    id: 2,
    product: "Alcohol 70%",
    lot: "LOT-ALC-002",
    stock: 80,
    minimumStock: 20,
    expiration: "2027-05-20",
  },
  {
    id: 3,
    product: "Ibuprofeno 400 mg",
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
        sale.id === saleId
          ? { ...sale, status }
          : sale
      )
    );
  };

  const handlePurchaseRequestStatusChange = (
    requestId,
    status
  ) => {
    setPurchaseRequests((currentRequests) =>
      currentRequests.map((request) =>
        request.id === requestId
          ? { ...request, status }
          : request
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

      handlePurchaseRequestStatusChange(
        requestId,
        "En compra"
      );

      if (request) {
        handleSaleStatusChange(
          request.saleId,
          "En proceso"
        );
      }
    });
  };

  const handlePurchaseOrderStatusChange = (
    orderId,
    status
  ) => {
    setPurchaseOrders((currentOrders) =>
      currentOrders.map((order) =>
        order.id === orderId
          ? { ...order, status }
          : order
      )
    );
  };

  const handleRegisterPurchaseReceipt = (orderId) => {
    const order = purchaseOrders.find(
      (item) => item.id === orderId
    );

    if (!order || order.receiptRegistered) {
      return;
    }

    setInventory((currentInventory) =>
      currentInventory.map((inventoryItem) => {
        const receivedItem = order.items.find(
          (item) => item.productId === inventoryItem.id
        );

        if (!receivedItem) {
          return inventoryItem;
        }

        return {
          ...inventoryItem,
          stock:
            inventoryItem.stock + receivedItem.quantity,
        };
      })
    );

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

      handlePurchaseRequestStatusChange(
        requestId,
        "Recibido"
      );

      if (request) {
        handleSaleStatusChange(
          request.saleId,
          "Disponible"
        );
      }
    });
  };

  return (
    <div className="relative flex h-screen w-screen overflow-hidden bg-[#fcf6f4] font-lexend">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={closeSidebar}
      />

      <button
        type="button"
        onClick={toggleSidebar}
        className="absolute top-1/2 z-50 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-sky-300 bg-white text-[#17324c] shadow-lg ring-2 ring-sky-400/20 transition-all duration-300 hover:bg-slate-50"
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

      <div className="flex h-full flex-1 flex-col overflow-hidden">
        <Topbar onToggleSidebar={toggleSidebar} />

        <main className="flex-1 overflow-y-auto bg-[#fcf6f4] p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            <Outlet
              context={{
                sales,
                onCreateSale: handleCreateSale,
                onSaleStatusChange: handleSaleStatusChange,

                purchaseRequests,
                onPurchaseRequestStatusChange:
                  handlePurchaseRequestStatusChange,

                purchaseOrders,
                onCreatePurchaseOrder:
                  handleCreatePurchaseOrder,
                onPurchaseOrderStatusChange:
                  handlePurchaseOrderStatusChange,
                onRegisterPurchaseReceipt:
                  handleRegisterPurchaseReceipt,

                inventory,
              }}
            />
          </div>
        </main>
      </div>

      {sidebarOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-xs lg:hidden"
        />
      )}
    </div>
  );
}