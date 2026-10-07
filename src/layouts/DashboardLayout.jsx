import { useState } from "react";
import { Outlet } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sales, setSales] = useState([]);
  const [missingItems, setMissingItems] = useState([]);

  const toggleSidebar = () => {
    setSidebarOpen((current) => !current);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const handleCreateSale = (sale) => {
    setSales((currentSales) => [
      ...currentSales,
      sale,
    ]);

    const newMissingItems = sale.items
      .filter((item) => item.quantity > item.product.stock)
      .map((item) => ({
        id: `${sale.id}-${item.product.id}`,
        product: item.product.name,
        requested: item.quantity,
        stock: item.product.stock,
        status: "Pendiente",
      }));

    setMissingItems((currentItems) => [
      ...currentItems,
      ...newMissingItems,
    ]);
  };

  const handleStatusChange = (saleId, status) => {
    setSales((currentSales) =>
      currentSales.map((sale) =>
        sale.id === saleId
          ? { ...sale, status }
          : sale
      )
    );
  };

  const handleMissingItemStatusChange = (itemId, status) => {
    setMissingItems((currentItems) =>
      currentItems.map((item) =>
        item.id === itemId
          ? { ...item, status }
          : item
      )
    );
  };

  return (
    <div className="relative flex h-screen w-screen overflow-hidden bg-[#fcf6f4] font-lexend">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={closeSidebar}
      />

      <button
        type="button"
        onClick={toggleSidebar}
        className="absolute top-1/2 z-50 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-sky-300 bg-white text-[#17324c] shadow-lg ring-2 ring-sky-400/20 transition-all duration-300 hover:bg-slate-50"
        style={{
          left: sidebarOpen ? "244px" : "-20px",
        }}
      >
        {sidebarOpen ? (
          <ChevronLeft className="h-5 w-5 stroke-[2.5]" />
        ) : (
          <ChevronRight className="h-5 w-5 stroke-[2.5]" />
        )}
      </button>

      <div className="flex h-full flex-1 flex-col overflow-hidden">
        <Topbar onToggleSidebar={toggleSidebar} />

        <main className="flex-1 overflow-y-auto bg-[#fcf6f4] p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            <Outlet
              context={{
                sales,
                onCreateSale: handleCreateSale,
                onStatusChange: handleStatusChange,
                missingItems,
                onMissingItemStatusChange: handleMissingItemStatusChange,
              }}
            />
          </div>
        </main>
      </div>

      {sidebarOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-xs lg:hidden"
        />
      )}
    </div>
  );
}