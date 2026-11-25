import { useEffect, useState } from "react";
import { CotizacionItems } from "./CotizacionItems";
import { ClientSearch } from "../../clientes/components/ClientSearch";
import { firstDefined, normalizeList } from "../../../services/mappers";
import {
  claveProducto,
  cotizacionesParaProducto,
} from "../data/proveedoresMock";

const IGV_RATE = 0.18;

function calcularMargen(precioVenta, precioCompra) {
  const venta = Number(precioVenta) || 0;
  if (!venta) return 0;
  const compra = Number(precioCompra) || 0;
  return Math.round(((venta - compra) / venta) * 10000) / 100;
}

function productosInicialesDelFormulario(initialQuote) {
  const guardados = normalizeList(initialQuote?.proveedores);

  return normalizeList(initialQuote?.products).map((producto, index) => {
    const nombre = firstDefined(
      producto.name,
      producto.nombre,
      producto.producto,
      ""
    );
    const guardado = guardados.find((proveedor) => {
      const mismoId =
        proveedor.productoId != null &&
        producto.id != null &&
        String(proveedor.productoId) === String(producto.id);
      const mismoNombre =
        proveedor.producto &&
        claveProducto(proveedor.producto) === claveProducto(nombre);
      return mismoId || mismoNombre;
    });

    const referencia = Number(producto.price) > 0 ? Number(producto.price) : null;
    const resultado = cotizacionesParaProducto(nombre, referencia);
    const opciones = resultado.opciones;
    const precioCompra = Number(
      firstDefined(guardado?.precioCompra, 0)
    );
    const seleccion =
      opciones.find(
        (opcion) =>
          opcion.id === guardado?.id || opcion.name === guardado?.name
      ) || guardado || null;

    if (seleccion && !opciones.some((opcion) => opcion.id === seleccion.id)) {
      opciones.push({ ...seleccion, precioCompra });
    }

    const precioVenta = resultado.precioVenta || Number(producto.price) || 0;

    return {
      ...producto,
      id: producto.id ?? `TMP-${index + 1}`,
      name: nombre,
      price: precioVenta,
      precioCompra,
      margen: calcularMargen(precioVenta, precioCompra),
      proveedor: seleccion,
      opcionesProveedores: opciones,
    };
  });
}

export function CotizacionForm({ initialQuote = null, onCancel, onGenerate }) {
  const [client, setClient] = useState(initialQuote?.client || null);
  const [date, setDate] = useState(initialQuote?.date || "");
  const [products, setProducts] = useState(() =>
    productosInicialesDelFormulario(initialQuote)
  );
  const [error, setError] = useState("");

  useEffect(() => {
    setClient(initialQuote?.client || null);
    setDate(initialQuote?.date || "");
    setProducts(productosInicialesDelFormulario(initialQuote));
    setError("");
  }, [initialQuote]);

  const seleccionarProveedor = (productId, opcion) => {
    setProducts((actuales) =>
      actuales.map((producto) =>
        producto.id === productId
          ? {
              ...producto,
              proveedor: opcion,
              precioCompra: Number(opcion?.precioCompra) || 0,
              margen: calcularMargen(producto.price, opcion?.precioCompra),
            }
          : producto
      )
    );
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
    const precio = Number(price) || 0;
    setProducts((currentProducts) =>
      currentProducts.map((product) => {
        if (product.id !== productId) return product;

        const opciones = cotizacionesParaProducto(product.name, precio).opciones;
        const seleccion = opciones.find(
          (opcion) => opcion.id === product.proveedor?.id
        );
        const precioCompra = seleccion
          ? Number(seleccion.precioCompra) || 0
          : product.precioCompra;

        return {
          ...product,
          price: precio,
          opcionesProveedores: opciones.length
            ? opciones
            : product.opcionesProveedores,
          proveedor: seleccion || product.proveedor,
          precioCompra,
          margen: calcularMargen(precio, precioCompra),
        };
      })
    );
  };

  const changePrecioCompra = (productId, precioCompra) => {
    const compra = Number(precioCompra) || 0;
    setProducts((currentProducts) =>
      currentProducts.map((product) =>
        product.id === productId
          ? {
              ...product,
              precioCompra: compra,
              margen: calcularMargen(product.price, compra),
            }
          : product
      )
    );
  };

  const subtotal = products.reduce(
    (sum, product) =>
      sum + (Number(product.quantity) || 0) * (Number(product.price) || 0),
    0
  );
  const igv = subtotal * IGV_RATE;
  const total = subtotal + igv;
  const totalCompra = products.reduce(
    (sum, product) =>
      sum + (Number(product.quantity) || 0) * (Number(product.precioCompra) || 0),
    0
  );
  const margenGlobal = subtotal
    ? Math.round(((subtotal - totalCompra) / subtotal) * 10000) / 100
    : 0;

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
      setError("No hay productos solicitados para continuar.");
      return;
    }

    const proveedores = products
      .filter((product) => product.proveedor)
      .map((product) => ({
        id: product.proveedor.id,
        name: product.proveedor.name,
        document: product.proveedor.document,
        tipo: product.proveedor.tipo,
        plazoDias: product.proveedor.plazoDias,
        productoId: product.productId ?? product.id ?? null,
        producto: product.name,
        precioCompra: Number(product.precioCompra) || 0,
        precioVenta: Number(product.price) || 0,
        margen: Number(product.margen) || 0,
        seleccionado: true,
      }));

    const quote = {
      id: initialQuote?.id ?? Date.now(),
      number: initialQuote?.number ?? `COT-${String(Date.now()).slice(-4)}`,
      status: initialQuote?.status ?? "Pendiente",
      casoId: initialQuote?.casoId ?? null,
      destino: initialQuote?.destino ?? null,
      proveedores,
      client,
      date,
      products: products.map(
        (
          {
            proveedores: _proveedores,
            proveedor: _proveedor,
            opcionesProveedores: _opciones,
            precioCompra: _precioCompra,
            margen: _margen,
            ...product
          },
          index
        ) => ({
          ...product,
          item: index + 1,
          unit: product.unit || product.unidadMedida || "UNIDAD",
        })
      ),
      subtotal,
      igv,
      total,
    };

    onGenerate(quote);
  };

  return (
    <div className="cotizaciones-card">
      <div>
        <h3 className="cotizaciones-card-title">
          {initialQuote?.number
            ? `Editar Cotización ${initialQuote.number}`
            : "Nueva Cotización"}
        </h3>
        <p className="cotizaciones-header-subtitle">
          {initialQuote?.number
            ? "Ajusta los datos, cantidades o precios antes de guardar o enviar."
            : "Registra los datos del cliente y los productos solicitados."}
        </p>
      </div>

      <div className="cotizaciones-form-grid">
        <div>
          <label className="cotizaciones-label">Cliente</label>
          <ClientSearch
            onSelect={setClient}
            initialValue={client?.name || ""}
          />
          {client && (
            <p style={{ marginTop: "8px", fontSize: "14px", color: "#475569" }}>
              Cliente seleccionado: {client.name}
              {client.email ? ` (${client.email})` : ""}
            </p>
          )}
        </div>

        <div>
          <label className="cotizaciones-label">Fecha de la solicitud</label>
          <input
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            className="cotizaciones-input"
          />
        </div>
      </div>

      <div style={{ marginTop: "32px" }}>
        <div style={{ marginBottom: "16px" }}>
          <h4 style={{ fontSize: "16px", fontWeight: 600, color: "#17324c", margin: 0 }}>
            Productos
          </h4>
          <p className="cotizaciones-header-subtitle">
            Productos solicitados por el cliente. Para cada uno se muestran solo las tres
            cotizaciones de proveedor disponibles, con existencia ilimitada.
          </p>
        </div>

        <CotizacionItems
          products={products}
          onIncrease={increaseQuantity}
          onDecrease={decreaseQuantity}
          onRemove={removeProduct}
          onPriceChange={changePrice}
          onPrecioCompraChange={changePrecioCompra}
          onProveedorChange={seleccionarProveedor}
        />
      </div>

      <div className="cotizaciones-total-box">
        <div className="cotizaciones-total-card" style={{ display: "grid", gap: "8px", minWidth: "240px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "14px", color: "#475569" }}>Subtotal</span>
            <span style={{ fontSize: "15px", fontWeight: 600, color: "#17324c" }}>
              S/ {subtotal.toFixed(2)}
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "14px", color: "#475569" }}>IGV (18%)</span>
            <span style={{ fontSize: "15px", fontWeight: 600, color: "#17324c" }}>
              S/ {igv.toFixed(2)}
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #e2e8f0", paddingTop: "8px" }}>
            <span style={{ fontSize: "14px", fontWeight: 600, color: "#17324c" }}>Total</span>
            <span style={{ fontSize: "18px", fontWeight: 700, color: "#17324c" }}>
              S/ {total.toFixed(2)}
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #e2e8f0", paddingTop: "8px" }}>
            <span style={{ fontSize: "13px", color: "#475569" }}>Margen estimado</span>
            <span
              className={margenGlobal >= 0 ? "cotizaciones-margen-positivo" : "cotizaciones-margen-negativo"}
            >
              {margenGlobal.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>

      {error && <p className="cotizaciones-error-text">{error}</p>}

      <div style={{ marginTop: "32px", display: "flex", justifyContent: "flex-end", gap: "12px" }}>
        <button
          type="button"
          onClick={onCancel}
          className="cotizaciones-btn-secondary"
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={handleGenerate}
          className="cotizaciones-btn-primary"
        >
          {initialQuote?.number ? "Guardar Cambios" : "Generar Cotización"}
        </button>
      </div>
    </div>
  );
}
