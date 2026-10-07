import { useState } from "react";

import { SupplierForm } from "../features/proveedores/components/SupplierForm";
import { SupplierList } from "../features/proveedores/components/SupplierList";

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
      const exists = currentSuppliers.some(
        (item) => item.id === supplier.id
      );

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
      currentSuppliers.filter(
        (supplier) => supplier.id !== supplierId
      )
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
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-[#17324c]">
            Gestión de Proveedores
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Registra y administra los proveedores de la empresa.
          </p>
        </div>

        {!showForm && (
          <button
            type="button"
            onClick={handleNewSupplier}
            className="rounded-lg bg-[#17324c] px-4 py-2 text-sm font-medium text-white hover:bg-[#234968]"
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
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por nombre o RUC..."
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-[#17324c]"
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