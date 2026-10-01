import React from 'react';

export const Tabla = ({ columns, data, actions }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/75 border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider font-semibold">
              {columns.map((col, index) => (
                <th key={index} className="py-4 px-6 whitespace-nowrap">
                  {col.header}
                </th>
              ))}
              {actions && <th className="py-4 px-6 text-center whitespace-nowrap">Acciones</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
            {data && data.length > 0 ? (
              data.map((row, rowIndex) => (
                <tr key={row.id || rowIndex} className="hover:bg-gray-50/50 transition-colors">
                  {columns.map((col, colIndex) => (
                    <td 
                      key={colIndex} 
                      className={`py-4 px-6 ${
                       
                        col.accessor === 'precio' || col.accessor === 'codigo' || col.accessor === 'stock'
                          ? 'whitespace-nowrap font-medium text-gray-900' 
                          : 'whitespace-nowrap sm:whitespace-normal'
                      } ${col.className || ''}`}
                    >
                      {row[col.accessor]}
                    </td>
                  ))}
                  {actions && (
                    <td className="py-4 px-6 text-center whitespace-nowrap">
                      {actions(row)}
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td 
                  colSpan={columns.length + (actions ? 1 : 0)} 
                  className="py-8 text-center text-gray-400 font-medium"
                >
                  No se encontraron registros.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};