const users = [
  {
    username: "admin",
    password: "123456",
    name: "Administrador",
    role: "Administrador",
  },
  {
    username: "vendedor",
    password: "123456",
    name: "Carlos Mendoza",
    role: "Vendedor",
  },
  {
    username: "comprador",
    password: "123456",
    name: "Ana Torres",
    role: "Comprador",
  },
  {
    username: "almacenero",
    password: "123456",
    name: "Luis Ramos",
    role: "Almacenero",
  },
];

export function login(username, password) {
  const user = users.find(
    (item) =>
      item.username === username && item.password === password
  );

  if (!user) {
    return null;
  }

  return {
    name: user.name,
    username: user.username,
    role: user.role,
  };
}