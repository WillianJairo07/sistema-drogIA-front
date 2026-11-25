import { useState } from "react";


const clients = [
  { id: 1, name: "Rodríguez S.A.C.", document: "20123456789" },
  { id: 2, name: "Distribuidora Salud Perú", document: "20456789123" },
  { id: 3, name: "Farmacias del Sur", document: "20678912345" },
];

export function ClientSearch({ onSelect }) {
  const [search, setSearch] = useState("");

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <input
        type="text"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Buscar cliente..."
        className="cotizaciones-input"
      />

      {search && (
        <div className="client-dropdown-menu">
          {filteredClients.length > 0 ? (
            filteredClients.map((client) => (
              <button
                key={client.id}
                type="button"
                onClick={() => {
                  onSelect(client);
                  setSearch("");
                }}
                className="client-dropdown-item"
              >
                <span style={{ fontSize: "14px", fontWeight: 500, color: "#334155" }}>
                  {client.name}
                </span>
                <span style={{ fontSize: "12px", color: "#64748b" }}>
                  RUC: {client.document}
                </span>
              </button>
            ))
          ) : (
            <p style={{ padding: "12px 16px", fontSize: "14px", color: "#64748b", margin: 0 }}>
              No se encontraron clientes.
            </p>
          )}
        </div>
      )}
    </div>
  );
}