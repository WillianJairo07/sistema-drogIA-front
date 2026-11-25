import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { InventoryForm } from "../features/inventario/components/InventoryForm";
import { InventoryList } from "../features/inventario/components/InventoryList";
import "../styles/inventario.css";

export function InventarioPage() {
  const {
    inventory,
    purchaseOrders = [],
    onAddInventoryItem,
    onUpdateInventoryItem,
  } = useOutletContext();

  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const handleSave = (itemData) => {
    if (editingItem && onUpdateInventoryItem) {
      onUpdateInventoryItem(itemData);
    } else if (onAddInventoryItem) {
      onAddInventoryItem(itemData);
    }
    setShowForm(false);
    setEditingItem(null);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowForm(true);
  };

  return (
    <div className="inventario-container">
      <div className="inventario-header-wrapper">
        <div>
          <h1 className="inventario-header-title">Gestión de Inventario</h1>

          <p className="inventario-header-subtitle">
            Controla las existencias, lotes, vencimientos y su código de orden de compra.
          </p>
        </div>

        {!showForm && (
          <button
            type="button"
            onClick={() => {
              setEditingItem(null);
              setShowForm(true);
            }}
            className="inventario-btn-primary"
          >
            Agregar a Inventario
          </button>
        )}
      </div>

      {showForm && (
        <InventoryForm
          initialItem={editingItem}
          purchaseOrders={purchaseOrders}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditingItem(null);
          }}
        />
      )}

      <InventoryList inventory={inventory} onEdit={handleEdit} />
    </div>
  );
}