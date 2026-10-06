import { useState } from "react";

import { ClientForm } from "../features/clientes/components/ClientForm";
import { ClientList } from "../features/clientes/components/ClientList";

const initialClients = [
  {
    id: 1,
    name: "Rodríguez S.A.C.",
    document: "20123456789",
  },
  {
    id: 2,
    name: "Distribuidora Salud Perú",
    document: "20456789123",
  },
  {
    id: 3,
    name: "Farmacias del Sur",
    document: "20678912345",
  },
];

export function ClientesPage() {
  const [clients, setClients] = useState(initialClients);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState(null);

  const filteredClients = clients.filter((client) => {
    const value = search.toLowerCase();

    return (
      client.name.toLowerCase().includes(value) ||
      client.document.includes(search)
    );
  });

  const handleSave = (client) => {
    setClients((currentClients) => {
      const exists = currentClients.some(
        (item) => item.id === client.id
      );

      if (exists) {
        return currentClients.map((item) =>
          item.id === client.id ? client : item
        );
      }

      return [...currentClients, client];
    });

    setShowForm(false);
    setEditingClient(null);
  };

  const handleEdit = (client) => {
    setEditingClient(client);
    setShowForm(true);
  };

  const handleDelete = (clientId) => {
    setClients((currentClients) =>
      currentClients.filter((client) => client.id !== clientId)
    );
  };

  const handleNewClient = () => {
    setEditingClient(null);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingClient(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-[#17324c]">
            Gestión de Clientes
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Registra y administra los clientes de la empresa.
          </p>
        </div>

        {!showForm && (
          <button
            type="button"
            onClick={handleNewClient}
            className="rounded-lg bg-[#17324c] px-4 py-2 text-sm font-medium text-white hover:bg-[#234968]"
          >
            Nuevo Cliente
          </button>
        )}
      </div>

      {showForm ? (
        <ClientForm
          client={editingClient}
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

          <ClientList
            clients={filteredClients}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </>
      )}
    </div>
  );
}