import { useState } from "react";
import { ClientForm } from "../features/clientes/components/ClientForm";
import { ClientList } from "../features/clientes/components/ClientList";
import "../styles/clientes.css";

const initialClients = [
  { id: 1, name: "Rodríguez S.A.C.", document: "20123456789" },
  { id: 2, name: "Distribuidora Salud Perú", document: "20456789123" },
  { id: 3, name: "Farmacias del Sur", document: "20678912345" },
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
      const exists = currentClients.some((item) => item.id === client.id);
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
    <div className="clientes-container">
      <div className="clientes-header-wrapper">
        <div>
          <h2 className="clientes-header-title">Gestión de Clientes</h2>
          <p className="clientes-header-subtitle">
            Registra y administra los clientes de la empresa.
          </p>
        </div>

        {!showForm && (
          <button
            type="button"
            onClick={handleNewClient}
            className="clientes-btn-primary"
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
          <div className="clientes-card" style={{ padding: "16px" }}>
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por nombre o RUC..."
              className="clientes-input"
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