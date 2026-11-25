import { useEffect, useState } from "react";
import { useLocation, useOutletContext } from "react-router-dom";

import { PurchaseOrderForm } from "../features/ordenesCompra/components/PurchaseOrderForm";
import { PurchaseOrderList } from "../features/ordenesCompra/components/PurchaseOrderList";
import { listarProveedores } from "../features/proveedores/services/proveedorService";
import { listarProductos } from "../features/productos/services/productoService";
import { listarCasos, tomarCaso } from "../features/casos/services/casoService";
import { obtenerCotizacion } from "../features/cotizaciones/services/cotizacionService";
import { normalizeRole } from "../features/auth/services/authService";
import { useAuth } from "../context/AuthContext";
import { firstDefined } from "../services/mappers";
import "../styles/ordenesCompra.css";

function normalizarTexto(valor) {
  return String(valor ?? "")
    .trim()
    .toLocaleLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ");
}

function mismoProducto(a, b) {
  const textoA = normalizarTexto(a);
  const textoB = normalizarTexto(b);
  return Boolean(textoA && textoB && (textoA === textoB || textoA.includes(textoB) || textoB.includes(textoA)));
}

function esPendienteDeCompra(estado) {
  return /pendiente.*compra/i.test(String(estado ?? ""));
}

export function OrdenesCompraPage() {
  const location = useLocation();
  const { user } = useAuth();
  const puedeTomarCaso = normalizeRole(user?.role) === "Comprador";

  const {
    sales = [],
    purchaseRequests = [],
    purchaseOrders = [],
    onCreatePurchaseOrder,
    onPurchaseOrderStatusChange,
    onRegisterPurchaseReceipt,
  } = useOutletContext();

  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [casosCompras, setCasosCompras] = useState([]);
  const [errorCasos, setErrorCasos] = useState("");
  const [errorVentas, setErrorVentas] = useState("");
  const [showForm, setShowForm] = useState(
    Boolean(location.state?.request)
  );

  const [selectedRequest, setSelectedRequest] = useState(
    location.state?.request || null
  );

  const cargarCasos = async () => {
    try {
      const casos = await listarCasos();
      setCasosCompras(casos.filter((caso) => caso.area === "Compras"));
      setErrorCasos("");
    } catch (error) {
      setErrorCasos(error.message);
    }
  };

  useEffect(() => {
    listarProveedores()
      .then(setSuppliers)
      .catch((error) => alert(error.message));
    listarProductos()
      .then(setProducts)
      .catch((error) => alert(error.message));
    cargarCasos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreateOrder = async (order) => {
    try {
      await onCreatePurchaseOrder(order);
      setShowForm(false);
      setSelectedRequest(null);
    } catch (error) {
      alert(error.message);
    }
  };

  const solicitudesDeVenta = (sale) =>
    purchaseRequests
      .filter(
        (solicitud) =>
          (sale?.id != null && String(solicitud.saleId) === String(sale.id)) ||
          (sale?.number &&
            String(solicitud.saleNumber) === String(sale.number))
      )
      .map((solicitud) => solicitud.id)
      .filter((id) => id != null);

  const handlePrepararOrdenDesdeVenta = async (sale) => {
    const requestIds = solicitudesDeVenta(sale);
    if (requestIds.length === 0) {
      setErrorVentas(
        "La venta no tiene solicitudes de compra ligadas. No se puede generar el pedido de almacén."
      );
      return;
    }

    setErrorVentas("");

    let proveedores = [];
    if (sale.cotizacionId) {
      try {
        const cotizacion = await obtenerCotizacion(sale.cotizacionId);
        proveedores = Array.isArray(cotizacion?.proveedores)
          ? cotizacion.proveedores
          : [];
      } catch {
        proveedores = [];
      }
    }

    const proveedorCotizado =
      proveedores.find((item) => item?.seleccionado) || proveedores[0] || null;
    const proveedorReal = suppliers.find(
      (supplier) =>
        (proveedorCotizado?.document &&
          String(supplier.document) === String(proveedorCotizado.document)) ||
        mismoProducto(supplier.name, proveedorCotizado?.name)
    );

    const items = (sale.items || []).map((item) => {
      const guardado =
        proveedores.find(
          (registro) =>
            (registro?.productoId != null &&
              String(registro.productoId) === String(item.productId)) ||
            mismoProducto(registro?.producto, item.name)
        ) || null;

      return {
        productId: item.productId ?? item.id ?? null,
        product: item.name || item.product || "",
        unit: item.unit || "UNIDAD",
        quantity: Number(item.quantity) || 0,
        price: Number(guardado?.precioCompra) || Number(item.price) || 0,
        subtotal:
          (Number(item.quantity) || 0) *
          (Number(guardado?.precioCompra) || Number(item.price) || 0),
      };
    });

    setSelectedRequest({
      esVenta: true,
      id: sale.id,
      casoId: sale.casoId ?? null,
      saleNumber: sale.number || "",
      cotizacionId: sale.cotizacionId ?? null,
      supplierId: proveedorReal?.id ?? "",
      requestIds,
      items,
    });
    setShowForm(true);
  };

  const handleNewOrder = () => {
    setSelectedRequest(null);
    setShowForm(true);
  };

  const handleTomarCaso = async (caso) => {
    try {
      await tomarCaso(caso.id);
      await cargarCasos();
    } catch (error) {
      alert(error.message);
    }
  };

  const handlePrepararOrden = (caso) => {
    const producto = (caso.productos || [])[0] || {};
    const idProducto = firstDefined(producto.id, producto.productId, null);
    const idProductoNumerico = /^\d+$/.test(String(idProducto ?? ""))
      ? Number(idProducto)
      : null;
    const encontrado = products.find(
      (item) =>
        (idProductoNumerico !== null && item.id === idProductoNumerico) ||
        item.name === firstDefined(producto.name, producto.nombre, "")
    );

    setSelectedRequest({
      esCaso: true,
      id: caso.id,
      casoId: caso.id,
      saleNumber: caso.codigoSolicitud || "-",
      productId: encontrado?.id ?? idProductoNumerico,
      product: encontrado?.name || firstDefined(producto.name, producto.nombre, "-"),
      quantity: Number(firstDefined(producto.quantity, producto.cantidad, 1)) || 1,
    });
    setShowForm(true);
  };

  const casosVisibles = casosCompras.filter(
    (caso) => caso.estado !== "CERRADO" && caso.estado !== "Cerrado"
  );

  const ventasPorAbastecer = sales.filter((sale) =>
    esPendienteDeCompra(sale.status)
  );

  return (
    <div className="ordenes-container">
      <div className="ordenes-header-wrapper">
        <div>
          <h2 className="ordenes-header-title">
            Gestión de Órdenes de Compra
          </h2>

          <p className="ordenes-header-subtitle">
            Registra y controla las compras realizadas a los proveedores.
          </p>
        </div>

        {!showForm && (
          <button
            type="button"
            onClick={handleNewOrder}
            className="ordenes-btn-primary"
            style={{
              backgroundColor: "#17324c",
              borderColor: "#17324c",
              color: "#ffffff",
            }}
          >
            Nueva Orden
          </button>
        )}
      </div>

      <div className="ordenes-card" style={{ marginBottom: "16px" }}>
        <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#17324c", margin: 0 }}>
          Ventas por abastecer
        </h3>

        <p className="ordenes-header-subtitle">
          Ventas confirmadas por el cliente. La orden se crea con las solicitudes
          de compra de la venta para que, al registrar la recepción, se genere el
          pedido de Almacén.
        </p>

        {errorVentas && (
          <p style={{ color: "#b91c1c", fontSize: "13px" }}>{errorVentas}</p>
        )}

        {ventasPorAbastecer.length === 0 ? (
          <p style={{ fontSize: "14px", color: "#64748b", margin: "8px 0 0" }}>
            No hay ventas pendientes de abastecimiento.
          </p>
        ) : (
          <div style={{ overflowX: "auto", marginTop: "12px" }}>
            <table className="ordenes-table" style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th>Venta</th>
                  <th>Cliente</th>
                  <th>Productos</th>
                  <th>Total</th>
                  <th style={{ textAlign: "right" }}>Acción</th>
                </tr>
              </thead>
              <tbody>
                {ventasPorAbastecer.map((sale) => {
                  const ids = solicitudesDeVenta(sale);
                  return (
                    <tr key={sale.id}>
                      <td style={{ fontWeight: 500 }}>
                        {sale.number || `#${sale.id}`}
                      </td>
                      <td>{firstDefined(sale.client?.name, sale.client?.nombre, "-")}</td>
                      <td>
                        {(sale.items || [])
                          .map(
                            (item) =>
                              `${item.name || item.product || "-"} × ${
                                item.quantity || 0
                              }`
                          )
                          .join("; ") || "-"}
                      </td>
                      <td>S/ {Number(sale.total || 0).toFixed(2)}</td>
                      <td style={{ textAlign: "right" }}>
                        {puedeTomarCaso ? (
                          <button
                            type="button"
                            onClick={() => handlePrepararOrdenDesdeVenta(sale)}
                            className="ordenes-btn-outline"
                            style={{ padding: "6px 12px", fontSize: "12px" }}
                            disabled={ids.length === 0}
                            title={
                              ids.length === 0
                                ? "La venta no tiene solicitudes de compra ligadas"
                                : "Preparar orden para el proveedor"
                            }
                          >
                            Preparar orden
                          </button>
                        ) : (
                          <span style={{ fontSize: "12px", color: "#64748b" }}>
                            Solo lectura
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="ordenes-card" style={{ marginBottom: "16px" }}>
        <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#17324c", margin: 0 }}>
          Casos derivados a Compras
        </h3>

        <p className="ordenes-header-subtitle">
          Casos sin venta asociada. No generan pedido de almacén; para entregar
          al cliente use “Ventas por abastecer”.
        </p>

        {errorCasos && (
          <p style={{ color: "#b91c1c", fontSize: "13px" }}>{errorCasos}</p>
        )}

        {casosVisibles.length === 0 ? (
          <p style={{ fontSize: "14px", color: "#64748b", margin: "8px 0 0" }}>
            No hay casos pendientes de Compras.
          </p>
        ) : (
          <div style={{ overflowX: "auto", marginTop: "12px" }}>
            <table className="ordenes-table" style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th>Código de solicitud</th>
                  <th>Cliente</th>
                  <th>Productos</th>
                  <th>Estado</th>
                  <th style={{ textAlign: "right" }}>Acción</th>
                </tr>
              </thead>
              <tbody>
                {casosVisibles.map((caso) => (
                  <tr key={caso.id}>
                    <td style={{ fontWeight: 500 }}>
                      {caso.codigoSolicitud || `#${caso.id}`}
                    </td>
                    <td>{firstDefined(caso.cliente?.name, caso.cliente?.nombre, "-")}</td>
                    <td>
                      {(caso.productos || [])
                        .map((producto) =>
                          firstDefined(producto.name, producto.nombre, "")
                        )
                        .filter(Boolean)
                        .join(", ") || "-"}
                    </td>
                    <td>{caso.status || caso.estado || "-"}</td>
                    <td style={{ textAlign: "right" }}>
                      {puedeTomarCaso && !caso.asignadoAId ? (
                        <button
                          type="button"
                          onClick={() => handleTomarCaso(caso)}
                          className="ordenes-btn-primary"
                          style={{ padding: "6px 12px", fontSize: "12px" }}
                        >
                          Tomar caso
                        </button>
                      ) : puedeTomarCaso && caso.asignadoAId ? (
                        <button
                          type="button"
                          onClick={() => handlePrepararOrden(caso)}
                          className="ordenes-btn-outline"
                          style={{ padding: "6px 12px", fontSize: "12px" }}
                        >
                          Preparar orden
                        </button>
                      ) : (
                        <span style={{ fontSize: "12px", color: "#64748b" }}>
                          Solo lectura
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showForm ? (
        <PurchaseOrderForm
          suppliers={suppliers}
          products={products}
          request={selectedRequest}
          onSave={handleCreateOrder}
          onCancel={() => {
            setShowForm(false);
            setSelectedRequest(null);
          }}
        />
      ) : (
        <PurchaseOrderList
          orders={purchaseOrders}
          onStatusChange={onPurchaseOrderStatusChange}
          onRegisterReceipt={onRegisterPurchaseReceipt}
        />
      )}
    </div>
  );
}
