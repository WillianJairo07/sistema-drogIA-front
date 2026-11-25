import { useEffect, useState } from "react";
import { ClientForm } from "../features/clientes/components/ClientForm";
import { ClientList } from "../features/clientes/components/ClientList";
import {
  actualizarCliente,
  crearCliente,
  eliminarCliente,
  listarClientes,
} from "../features/clientes/services/clienteService";
import "../styles/clientes.css";

export function ClientesPage() {
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState(null);

  useEffect(() => {
    listarClientes()
      .then(setClients)
      .catch((error) => alert(error.message));
  }, []);

  const filteredClients = clients.filter((client) => {
    const value = search.toLowerCase();
    return (
      client.name.toLowerCase().includes(value) ||
      client.document.includes(search)
    );
  });

  const handleSave = async (client) => {
    try {
      const guardado = editingClient
        ? await actualizarCliente(editingClient.id, client)
        : await crearCliente(client);

      setClients((currentClients) => {
        const exists = currentClients.some((item) => item.id === guardado.id);
        if (exists) {
          return currentClients.map((item) =>
            item.id === guardado.id ? guardado : item
          );
        }
        return [...currentClients, guardado];
      });

      setShowForm(false);
      setEditingClient(null);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleEdit = (client) => {
    setEditingClient(client);
    setShowForm(true);
  };

  const handleDelete = async (clientId) => {
    try {
      await eliminarCliente(clientId);
      setClients((currentClients) =>
        currentClients.filter((client) => client.id !== clientId)
      );
    } catch (error) {
      alert(error.message);
    }
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
