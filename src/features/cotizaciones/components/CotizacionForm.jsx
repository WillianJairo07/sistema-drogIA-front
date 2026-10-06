
import { useState } from "react";

import { CotizacionItems } from "./CotizacionItems";
import { ProductSearch } from "../../productos/components/ProductSearch";
import { ClientSearch } from "../../clientes/components/ClientSearch";

export function CotizacionForm({ onCancel, onGenerate }) {
  const [client, setClient] = useState(null);
  const [date, setDate] = useState("");
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");

  const addProduct = (product) => {
    setError("");

    setProducts((currentProducts) => {
      const existingProduct = currentProducts.find(
        (item) => item.id === product.id
      );

      if (existingProduct) {
        return currentProducts.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...currentProducts, { ...product, quantity: 1 }];
    });
  };

  const increaseQuantity = (productId) => {
    setProducts((currentProducts) =>
      currentProducts.map((product) =>
        product.id === productId
          ? { ...product, quantity: product.quantity + 1 }
          : product
      )
    );
  };

  const decreaseQuantity = (productId) => {
    setProducts((currentProducts) =>
      currentProducts.map((product) =>
        product.id === productId && product.quantity > 1
          ? { ...product, quantity: product.quantity - 1 }
          : product
      )
    );
  };

  const removeProduct = (productId) => {
    setProducts((currentProducts) =>
      currentProducts.filter((product) => product.id !== productId)
    );
  };

  const changePrice = (productId, price) => {
    setProducts((currentProducts) =>
      currentProducts.map((product) =>
        product.id === productId
          ? { ...product, price: Number(price) }
          : product
      )
    );
  };

  const total = products.reduce(
    (sum, product) => sum + product.quantity * product.price,
    0
  );

  const handleGenerate = () => {
    if (!client) {
      setError("Selecciona un cliente para continuar.");
      return;
    }

    if (!date) {
      setError("Selecciona una fecha para continuar.");
      return;
    }

    if (products.length === 0) {
      setError("Agrega al menos un producto para continuar.");
      return;
    }

    const quote = {
      id: Date.now(),
      number: `COT-${String(Date.now()).slice(-4)}`,
      client,
      date,
      products,
      total,
    };

    onGenerate(quote);
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <h3 className="text-lg font-semibold text-[#17324c]">
          Nueva Cotización
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          Registra los datos del cliente y los productos solicitados.
        </p>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Cliente
          </label>

          <ClientSearch onSelect={setClient} />

          {client && (
            <p className="mt-2 text-sm text-slate-600">
              Cliente seleccionado: {client.name}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Fecha
          </label>

          <input
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-[#17324c]"
          />
        </div>
      </div>

      <div className="mt-8">
        <div className="mb-4">
          <h4 className="text-base font-semibold text-[#17324c]">
            Productos
          </h4>

          <p className="mt-1 text-sm text-slate-500">
            Busca y agrega los productos solicitados por el cliente.
          </p>
        </div>

        <ProductSearch onSelect={addProduct} />

        <CotizacionItems
          products={products}
          onIncrease={increaseQuantity}
          onDecrease={decreaseQuantity}
          onRemove={removeProduct}
          onPriceChange={changePrice}
        />
      </div>

      <div className="mt-6 flex justify-end">
        <div className="w-full max-w-xs rounded-lg bg-slate-50 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-600">
              Total
            </span>

            <span className="text-lg font-semibold text-[#17324c]">
              S/ {total.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {error && (
        <p className="mt-4 text-right text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="mt-8 flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Cancelar
        </button>

        <button
          type="button"
          onClick={handleGenerate}
          className="rounded-lg bg-[#17324c] px-4 py-2 text-sm font-medium text-white hover:bg-[#234968]"
        >
          Generar Cotización
        </button>
      </div>
    </div>
  );
}
