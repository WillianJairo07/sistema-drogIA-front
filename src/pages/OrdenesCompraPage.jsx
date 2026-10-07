import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useOutletContext } from "react-router-dom";

import { PurchaseOrderForm } from "../features/ordenesCompra/components/PurchaseOrderForm";
import { PurchaseOrderList } from "../features/ordenesCompra/components/PurchaseOrderList";

const initialSuppliers = [
  {
    id: 1,
    name: "Laboratorios del Sur S.A.C.",
    document: "20123456789",
  },
  {
    id: 2,
    name: "Distribuidora Médica Perú S.A.C.",
    document: "20456789123",
  },
  {
    id: 3,
    name: "Productos Farmacéuticos Andinos",
    document: "20678912345",
  },
];

const initialProducts = [
  {
    id: 1,
    name: "Paracetamol 500 mg",
    price: 5,
  },
  {
    id: 2,
    name: "Alcohol 70%",
    price: 8,
  },
  {
    id: 3,
    name: "Ibuprofeno 400 mg",
    price: 7.5,
  },
];

export function OrdenesCompraPage() {
  const location = useLocation();

  const {
    purchaseOrders,
    onCreatePurchaseOrder,
    onPurchaseOrderStatusChange,
    onRegisterPurchaseReceipt,
  } = useOutletContext();

  const [showForm, setShowForm] = useState(
    Boolean(location.state?.request)
  );

  const [selectedRequest, setSelectedRequest] = useState(
    location.state?.request || null
  );

  const handleCreateOrder = (order) => {
    onCreatePurchaseOrder(order);
    setShowForm(false);
    setSelectedRequest(null);
  };

  const handleNewOrder = () => {
    setSelectedRequest(null);
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-[#17324c]">
            Gestión de Órdenes de Compra
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Registra y controla las compras realizadas a los proveedores.
          </p>
        </div>

        {!showForm && (
          <button
            type="button"
            onClick={handleNewOrder}
            className="rounded-lg bg-[#17324c] px-4 py-2 text-sm font-medium text-white hover:bg-[#234968]"
          >
            Nueva Orden
          </button>
        )}
      </div>

      {showForm ? (
        <PurchaseOrderForm
          suppliers={initialSuppliers}
          products={initialProducts}
          request={selectedRequest}
          onSave={handleCreateOrder}
          onCancel={() => {
            setShowForm(false);
            setSelectedRequest(null);
          }}
        />
      ) : (
        <PurchaseOrderList
          orders={purchaseOrders}
          onStatusChange={onPurchaseOrderStatusChange}
          onRegisterReceipt={onRegisterPurchaseReceipt}
        />
      )}
    </div>
  );
}