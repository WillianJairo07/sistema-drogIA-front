import { useState } from "react";
import { UserForm } from "../features/usuarios/components/UserForm";
import { UserList } from "../features/usuarios/components/UserList";
import "../styles/usuarios.css"; 

const initialUsers = [
  { id: 1, name: "Carlos Mendoza", email: "carlos@drogia.com", role: "Vendedor", active: true },
  { id: 2, name: "Ana Torres", email: "ana@drogia.com", role: "Comprador", active: true },
  { id: 3, name: "Luis Ramos", email: "luis@drogia.com", role: "Almacenero", active: false },
  { id: 4, name: "Administrador", email: "admin@drogia.com", role: "Administrador", active: true },
];

export default function UsuariosPage() {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const filteredUsers = users.filter((user) => {
    const value = search.toLowerCase();
    return (
      user.name.toLowerCase().includes(value) ||
      user.email.toLowerCase().includes(value) ||
      user.role.toLowerCase().includes(value)
    );
  });

  const handleSave = (user) => {
    setUsers((currentUsers) => {
      const exists = currentUsers.some((item) => item.id === user.id);
      if (exists) {
        return currentUsers.map((item) =>
          item.id === user.id ? user : item
        );
      }
      return [...currentUsers, user];
    });

    setShowForm(false);
    setEditingUser(null);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setShowForm(true);
  };

  const handleToggleStatus = (userId) => {
    setUsers((currentUsers) =>
      currentUsers.map((user) =>
        user.id === userId ? { ...user, active: !user.active } : user
      )
    );
  };

  const handleNewUser = () => {
    setEditingUser(null);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingUser(null);
  };

  return (
    <div className="usuarios-container">
      <div className="usuarios-header-wrapper">
        <div>
          <h2 className="usuarios-header-title">Gestión de Usuarios</h2>
          <p className="usuarios-header-subtitle">
            Administra las cuentas, roles y estado de los usuarios.
          </p>
        </div>

        {!showForm && (
          <button
            type="button"
            onClick={handleNewUser}
            className="usuarios-btn-primary"
          >
            Nuevo Usuario
          </button>
        )}
      </div>

      {showForm ? (
        <UserForm
          user={editingUser}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      ) : (
        <>
          <div className="usuarios-card" style={{ padding: "16px" }}>
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por nombre, correo o rol..."
              className="usuarios-input"
            />
          </div>

          <UserList
            users={filteredUsers}
            onEdit={handleEdit}
            onToggleStatus={handleToggleStatus}
          />
        </>
      )}
    </div>
  );
}