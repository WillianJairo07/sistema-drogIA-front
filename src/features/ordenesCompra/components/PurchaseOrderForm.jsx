import { useState } from "react";

export function PurchaseOrderForm({
  suppliers,
  products,
  onSave,
  onCancel,
}) {
  const [supplierId, setSupplierId] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

  const handleAddProduct = () => {
    if (!selectedProductId) {
      setError("Selecciona un producto.");
      return;
    }

    const product = products.find(
      (item) => item.id === Number(selectedProductId)
    );

    const productQuantity = Number(quantity);

    if (!productQuantity || productQuantity <= 0) {
      setError("Ingresa una cantidad válida.");
      return;
    }

    const existingItem = items.find(
      (item) => item.productId === product.id
    );

    if (existingItem) {
      setItems((currentItems) =>
        currentItems.map((item) =>
          item.productId === product.id
            ? {
                ...item,
                quantity: item.quantity + productQuantity,
                subtotal:
                  (item.quantity + productQuantity) * item.price,
              }
            : item
        )
      );
    } else {
      setItems((currentItems) => [
        ...currentItems,
        {
          productId: product.id,
          product: product.name,
          quantity: productQuantity,
          price: product.price,
          subtotal: productQuantity * product.price,
        },
      ]);
    }

    setSelectedProductId("");
    setQuantity("");
    setError("");
  };

  const handleRemoveProduct = (productId) => {
    setItems((currentItems) =>
      currentItems.filter((item) => item.productId !== productId)
    );
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!supplierId) {
      setError("Selecciona un proveedor.");
      return;
    }

    if (items.length === 0) {
      setError("Agrega al menos un producto.");
      return;
    }

    const supplier = suppliers.find(
      (item) => item.id === Number(supplierId)
    );

    const total = items.reduce(
      (sum, item) => sum + item.subtotal,
      0
    );

    onSave({
      id: Date.now(),
      number: `OC-${Date.now().toString().slice(-6)}`,
      supplier,
      date: new Date().toLocaleDateString("es-PE"),
      items,
      total,
      status: "Pendiente",
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div>
        <h3 className="text-lg font-semibold text-[#17324c]">
          Nueva Orden de Compra
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          Registra los productos que se solicitarán al proveedor.
        </p>
      </div>

      <div className="mt-6">
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Proveedor
        </label>

        <select
          value={supplierId}
          onChange={(event) => setSupplierId(event.target.value)}
          className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-[#17324c]"
        >
          <option value="">Seleccionar proveedor...</option>

          {suppliers.map((supplier) => (
            <option key={supplier.id} value={supplier.id}>
              {supplier.name} - RUC {supplier.document}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-[1fr_180px_auto]">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Producto
          </label>

          <select
            value={selectedProductId}
            onChange={(event) =>
              setSelectedProductId(event.target.value)
            }
            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-[#17324c]"
          >
            <option value="">Seleccionar producto...</option>

            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Cantidad
          </label>

          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
            placeholder="Cantidad"
            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-[#17324c]"
          />
        </div>

        <div className="flex items-end">
          <button
            type="button"
            onClick={handleAddProduct}
            className="w-full rounded-lg border border-[#17324c] px-4 py-2.5 text-sm font-medium text-[#17324c] hover:bg-slate-50"
          >
            Agregar
          </button>
        </div>
      </div>

      {items.length > 0 && (
        <div className="mt-6 overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full min-w-[650px] text-sm">
            <thead className="bg-slate-50">
              <tr className="text-left text-slate-600">
                <th className="px-4 py-3 font-medium">
                  Producto
                </th>

                <th className="px-4 py-3 font-medium">
                  Cantidad
                </th>

                <th className="px-4 py-3 font-medium">
                  Precio
                </th>

                <th className="px-4 py-3 font-medium">
                  Subtotal
                </th>

                <th className="px-4 py-3 text-right font-medium">
                  Acción
                </th>
              </tr>
            </thead>

            <tbody>
              {items.map((item) => (
                <tr
                  key={item.productId}
                  className="border-t border-slate-200"
                >
                  <td className="px-4 py-4 font-medium text-slate-700">
                    {item.product}
                  </td>

                  <td className="px-4 py-4 text-slate-600">
                    {item.quantity}
                  </td>

                  <td className="whitespace-nowrap px-4 py-4 text-slate-600">
                    S/ {item.price.toFixed(2)}
                  </td>

                  <td className="whitespace-nowrap px-4 py-4 font-medium text-slate-700">
                    S/ {item.subtotal.toFixed(2)}
                  </td>

                  <td className="px-4 py-4 text-right">
                    <button
                      type="button"
                      onClick={() =>
                        handleRemoveProduct(item.productId)
                      }
                      className="whitespace-nowrap text-sm font-medium text-red-600 hover:underline"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {error && (
        <p className="mt-4 text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Cancelar
        </button>

        <button
          type="submit"
          className="rounded-lg bg-[#17324c] px-4 py-2 text-sm font-medium text-white hover:bg-[#234968]"
        >
          Registrar Orden
        </button>
      </div>
    </form>
  );
}