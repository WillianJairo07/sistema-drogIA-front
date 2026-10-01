import React, { useState } from 'react';
import { Tabla } from './Tabla';
import { Search, Plus, Eye } from 'lucide-react';

export const CrudTemplate = ({ 
  title, 
  description, 
  columns, 
  data, 
  actions, 
  onAdd, 
  searchPlaceholder = "Buscar..." 
}) => {
  const [busqueda, setBusqueda] = useState('');
  const [mostrarInactivos, setMostrarInactivos] = useState(false);

  const filteredData = data.filter((item) => {
    const matchesSearch = Object.values(item).some(val => 
      String(val).toLowerCase().includes(busqueda.toLowerCase())
    );
    const matchesState = mostrarInactivos ? item.estado === 'inactivo' : item.estado === 'activo';
    return matchesSearch && matchesState;
  });

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6">
      {/* Cabecera optimizada */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
        <div className="max-w-xl">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 tracking-tight">{title}</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">{description}</p>
        </div>

        {/* Controles: Se apilan de forma ordenada en móvil/tablet y fluyen en escritorio */}
        <div className="flex flex-col sm:flex-row items-stretch xl:items-center gap-3 w-full xl:w-auto">
          {/* Buscador */}
          <div className="relative w-full sm:w-64">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
              <Search size={18} />
            </span>
            <input 
              type="text" 
              placeholder={searchPlaceholder} 
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
            />
          </div>

          {/* Botones organizados */}
          <div className="flex flex-row sm:flex-row items-center gap-3 w-full sm:w-auto">
            <button 
              onClick={() => setMostrarInactivos(!mostrarInactivos)}
              className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-sm font-medium transition flex items-center justify-center gap-2 border whitespace-nowrap ${
                mostrarInactivos 
                  ? 'bg-gray-800 text-white border-gray-800 shadow-sm' 
                  : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
              }`}
            >
              <Eye size={16} />
              <span>{mostrarInactivos ? 'Ver Activos' : 'Inactivos'}</span>
            </button>

            {onAdd && (
              <button 
                onClick={onAdd}
                className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition shadow-sm shadow-blue-200 flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <Plus size={18} /> 
                <span>Agregar</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabla */}
      <Tabla columns={columns} data={filteredData} actions={actions} />
    </div>
  );
};