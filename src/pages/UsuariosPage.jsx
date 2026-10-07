import { useState } from "react";

import { UserForm } from "../features/usuarios/components/UserForm";
import { UserList } from "../features/usuarios/components/UserList";

const initialUsers = [
  {
    id: 1,
    name: "Carlos Mendoza",
    email: "carlos@drogia.com",
    role: "Vendedor",
    active: true,
  },
  {
    id: 2,
    name: "Ana Torres",
    email: "ana@drogia.com",
    role: "Comprador",
    active: true,
  },
  {
    id: 3,
    name: "Luis Ramos",
    email: "luis@drogia.com",
    role: "Almacenero",
    active: false,
  },
  {
    id: 4,
    name: "Administrador",
    email: "admin@drogia.com",
    role: "Administrador",
    active: true,
  },
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
        user.id === userId
          ? { ...user, active: !user.active }
          : user
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
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-[#17324c]">
            Gestión de Usuarios
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Administra las cuentas, roles y estado de los usuarios.
          </p>
        </div>

        {!showForm && (
          <button
            type="button"
            onClick={handleNewUser}
            className="rounded-lg bg-[#17324c] px-4 py-2 text-sm font-medium text-white hover:bg-[#234968]"
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
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por nombre, correo o rol..."
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-[#17324c]"
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