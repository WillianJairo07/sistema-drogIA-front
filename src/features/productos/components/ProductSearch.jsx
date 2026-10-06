import { useState } from "react";

const products = [
  {
    id: 1,
    name: "Paracetamol 500 mg",
    price: 5.00,
  },
  {
    id: 2,
    name: "Alcohol 70%",
    price: 8.00,
  },
  {
    id: 3,
    name: "Ibuprofeno 400 mg",
    price: 7.50,
  },
];

export function ProductSearch({ onSelect }) {
  const [search, setSearch] = useState("");

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative">
      <input
        type="text"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Buscar producto..."
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
                className="flex w-full items-center justify-between px-4 py-3 text-left text-sm hover:bg-slate-50"
              >
                <span className="text-slate-700">
                  {product.name}
                </span>

                <span className="font-medium text-[#17324c]">
                  S/ {product.price.toFixed(2)}
                </span>
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