import { useEffect, useState } from "react";
import { UserForm } from "../features/usuarios/components/UserForm";
import { UserList } from "../features/usuarios/components/UserList";
import {
  actualizarUsuario,
  cambiarEstadoUsuario,
  crearUsuario,
  listarUsuarios,
} from "../features/usuarios/services/usuarioService";
import "../styles/usuarios.css";

export default function UsuariosPage() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    listarUsuarios()
      .then(setUsers)
      .catch((error) => alert(error.message));
  }, []);

  const filteredUsers = users.filter((user) => {
    const value = search.toLowerCase();
    return (
      user.name.toLowerCase().includes(value) ||
      user.email.toLowerCase().includes(value) ||
      user.role.toLowerCase().includes(value)
    );
  });

  const handleSave = async (user) => {
    try {
      const guardado = editingUser
        ? await actualizarUsuario(editingUser.id, user)
        : await crearUsuario(user);

      setUsers((currentUsers) => {
        const exists = currentUsers.some((item) => item.id === guardado.id);
        if (exists) {
          return currentUsers.map((item) =>
            item.id === guardado.id ? guardado : item
          );
        }
        return [...currentUsers, guardado];
      });

      setShowForm(false);
      setEditingUser(null);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setShowForm(true);
  };

  const handleToggleStatus = async (userId) => {
    try {
      const usuario = users.find((item) => item.id === userId);
      const actualizado = await cambiarEstadoUsuario(userId, !usuario.active);
      setUsers((currentUsers) =>
        currentUsers.map((user) =>
          user.id === userId ? actualizado : user
        )
      );
    } catch (error) {
      alert(error.message);
    }
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
