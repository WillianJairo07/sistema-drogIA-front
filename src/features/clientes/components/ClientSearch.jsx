import { useState } from "react";

const clients = [
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

export function ClientSearch({ onSelect }) {
  const [search, setSearch] = useState("");

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative">
      <input
        type="text"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Buscar cliente..."
        className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-[#17324c]"
      />

      {search && (
        <div className="absolute left-0 right-0 top-full z-20 mt-1 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg">
          {filteredClients.length > 0 ? (
            filteredClients.map((client) => (
              <button
                key={client.id}
                type="button"
                onClick={() => {
                  onSelect(client);
                  setSearch("");
                }}
                className="flex w-full flex-col px-4 py-3 text-left hover:bg-slate-50"
              >
                <span className="text-sm font-medium text-slate-700">
                  {client.name}
                </span>

                <span className="text-xs text-slate-500">
                  RUC: {client.document}
                </span>
              </button>
            ))
          ) : (
            <p className="px-4 py-3 text-sm text-slate-500">
              No se encontraron clientes.
            </p>
          )}
        </div>
      )}
    </div>
  );
}