import { useEffect, useState } from "react";
import { useLocation, useOutletContext } from "react-router-dom";

import { PurchaseOrderForm } from "../features/ordenesCompra/components/PurchaseOrderForm";
import { PurchaseOrderList } from "../features/ordenesCompra/components/PurchaseOrderList";
import { listarProveedores } from "../features/proveedores/services/proveedorService";
import { listarProductos } from "../features/productos/services/productoService";
import "../styles/ordenesCompra.css";

export function OrdenesCompraPage() {
  const location = useLocation();

  const {
    purchaseOrders = [],
    onCreatePurchaseOrder,
    onPurchaseOrderStatusChange,
    onRegisterPurchaseReceipt,
  } = useOutletContext();

  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(
    Boolean(location.state?.request)
  );

  const [selectedRequest, setSelectedRequest] = useState(
    location.state?.request || null
  );

  useEffect(() => {
    listarProveedores()
      .then(setSuppliers)
      .catch((error) => alert(error.message));
    listarProductos()
      .then(setProducts)
      .catch((error) => alert(error.message));
  }, []);

  const handleCreateOrder = async (order) => {
    try {
      await onCreatePurchaseOrder(order);
      setShowForm(false);
      setSelectedRequest(null);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleNewOrder = () => {
    setSelectedRequest(null);
    setShowForm(true);
  };

  return (
    <div className="ordenes-container">
      <div className="ordenes-header-wrapper">
        <div>
          <h2 className="ordenes-header-title">
            Gestión de Órdenes de Compra
          </h2>

          <p className="ordenes-header-subtitle">
            Registra y controla las compras realizadas a los proveedores.
          </p>
        </div>

        {!showForm && (
          <button
            type="button"
            onClick={handleNewOrder}
            className="ordenes-btn-primary"
            style={{
              backgroundColor: "#17324c",
              borderColor: "#17324c",
              color: "#ffffff",
            }}
          >
            Nueva Orden
          </button>
        )}
      </div>

      {showForm ? (
        <PurchaseOrderForm
          suppliers={suppliers}
          products={products}
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
