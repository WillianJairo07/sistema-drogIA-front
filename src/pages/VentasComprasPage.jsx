import { useOutletContext } from "react-router-dom";
import { PurchaseRequestsPanel } from "../features/ventasCompras/components/PurchaseRequestsPanel";
import "../styles/ventascompras.css";

export function VentasComprasPage() {
  const { purchaseRequests } = useOutletContext();

  return (
    <div className="compras-container">
      <div className="compras-header-wrapper">
        <div>
          <h2 className="compras-header-title">Panel Ventas-Compras</h2>

          <p className="compras-header-subtitle">
            Consulta las solicitudes de compra generadas desde las ventas.
          </p>
        </div>
      </div>

      <PurchaseRequestsPanel items={purchaseRequests} />
    </div>
  );
}