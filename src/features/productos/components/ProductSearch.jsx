
import { useState } from "react";

const products = [
  {
    id: 1,
    name: "Paracetamol 500 mg",
    lot: "LOT-PAR-001",
    healthRegistration: "RSA-12345",
    price: 5.0,
    stock: 120,
    expiration: "2027-08-15",
  },
  {
    id: 2,
    name: "Alcohol 70%",
    lot: "LOT-ALC-002",
    healthRegistration: "RSA-23456",
    price: 8.0,
    stock: 80,
    expiration: "2027-05-20",
  },
  {
    id: 3,
    name: "Ibuprofeno 400 mg",
    lot: "LOT-IBU-003",
    healthRegistration: "RSA-34567",
    price: 7.5,
    stock: 45,
    expiration: "2026-12-10",
  },
];

export function ProductSearch({ onSelect }) {
  const [search, setSearch] = useState("");

  const filteredProducts = products.filter((product) => {
    const value = search.toLowerCase();

    return (
      product.name.toLowerCase().includes(value) ||
      product.lot.toLowerCase().includes(value) ||
      product.healthRegistration.toLowerCase().includes(value)
    );
  });

  return (
    <div className="relative">
      <input
        type="text"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Buscar por nombre, lote o registro sanitario..."
        className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-[#17324c]"
      />

      {search && (
        <div className="absolute left-0 right-0 top-full z-20 mt-1 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <button
                key={product.id}
                type="button"
                onClick={() => {
                  onSelect(product);
                  setSearch("");
                }}
                className="w-full border-b border-slate-100 px-4 py-3 text-left last:border-b-0 hover:bg-slate-50"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-700">
                    {product.name}
                  </span>

                  <span className="font-medium text-[#17324c]">
                    S/ {product.price.toFixed(2)}
                  </span>
                </div>

                <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                  <span>Lote: {product.lot}</span>
                  <span>Registro: {product.healthRegistration}</span>
                  <span>Stock: {product.stock}</span>
                  <span>Vence: {product.expiration}</span>
                </div>
              </button>
            ))
          ) : (
            <p className="px-4 py-3 text-sm text-slate-500">
              No se encontraron productos.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
