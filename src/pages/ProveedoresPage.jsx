import { useState } from "react";
import { SupplierForm } from "../features/proveedores/components/SupplierForm";
import { SupplierList } from "../features/proveedores/components/SupplierList";
import "../styles/proveedores.css";

const initialSuppliers = [
  {
    id: 1,
    name: "Laboratorios del Sur S.A.C.",
    document: "20123456789",
    phone: "987654321",
    email: "contacto@labsur.com",
  },
  {
    id: 2,
    name: "Distribuidora Médica Perú S.A.C.",
    document: "20456789123",
    phone: "956123456",
    email: "ventas@distribuidoramedica.com",
  },
  {
    id: 3,
    name: "Productos Farmacéuticos Andinos",
    document: "20678912345",
    phone: "945789123",
    email: "contacto@farmaandinos.com",
  },
];

export function ProveedoresPage() {
  const [suppliers, setSuppliers] = useState(initialSuppliers);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);

  const filteredSuppliers = suppliers.filter((supplier) => {
    const value = search.toLowerCase();
    return (
      supplier.name.toLowerCase().includes(value) ||
      supplier.document.includes(search)
    );
  });

  const handleSave = (supplier) => {
    setSuppliers((currentSuppliers) => {
      const exists = currentSuppliers.some((item) => item.id === supplier.id);

      if (exists) {
        return currentSuppliers.map((item) =>
          item.id === supplier.id ? supplier : item
        );
      }

      return [...currentSuppliers, supplier];
    });

    setShowForm(false);
    setEditingSupplier(null);
  };

  const handleEdit = (supplier) => {
    setEditingSupplier(supplier);
    setShowForm(true);
  };

  const handleDelete = (supplierId) => {
    setSuppliers((currentSuppliers) =>
      currentSuppliers.filter((supplier) => supplier.id !== supplierId)
    );
  };

  const handleNewSupplier = () => {
    setEditingSupplier(null);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingSupplier(null);
  };

  return (
    <div className="proveedores-container">
      <div className="proveedores-header-wrapper">
        <div>
          <h2 className="proveedores-header-title">Gestión de Proveedores</h2>
          <p className="proveedores-header-subtitle">
            Registra y administra los proveedores de la empresa.
          </p>
        </div>

        {!showForm && (
          <button
            type="button"
            onClick={handleNewSupplier}
            className="proveedores-btn-primary"
          >
            Nuevo Proveedor
          </button>
        )}
      </div>

      {showForm ? (
        <SupplierForm
          supplier={editingSupplier}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      ) : (
        <>
          <div className="proveedores-card" style={{ padding: "16px" }}>
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por nombre o RUC..."
              className="proveedores-input"
            />
          </div>

          <SupplierList
            suppliers={filteredSuppliers}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </>
      )}
    </div>
  );
}