import React from "react";

function TableLayout({
  tables = [],              
  selectedTableIds = [],    
  unavailableTableIds = [], 
  onToggleTable,           
}) {
  return (
    <div>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {tables.map((table) => {
          const id = table.table_id;
          const isSelected = selectedTableIds.includes(id);
          const isUnavailable = unavailableTableIds.includes(id);

          // базовые стили
          const baseClasses =
            "h-12 rounded-md border flex flex-col items-center justify-center text-xs transition";

          let stateClasses = "";

          if (isUnavailable) {
            // занятый стол
            stateClasses =
              "border-red-400 bg-red-50 text-red-500 cursor-not-allowed opacity-60";
          } else if (isSelected) {
            // выбранный стол
            stateClasses =
              "border-restaurant-gold bg-restaurant-cream";
          } else {
            // свободный
            stateClasses =
              "border-dashed border-gray-300 bg-restaurant-cream/80 hover:bg-restaurant-cream";
          }

          return (
            <button
              type="button"
              key={id}
              disabled={isUnavailable}
              onClick={() => {
                if (!isUnavailable) {
                  onToggleTable?.(id);
                }
              }}
              className={[baseClasses, stateClasses].join(" ")}
            >
              <span className="font-semibold">
                T{table.table_number}
              </span>
              <span className="text-[10px] text-gray-500">
                up to {table.number_of_guests} guests
              </span>
            </button>
          );
        })}
      </div>

      <p className="text-xs text-gray-500 mt-3">
        Select one or more tables for your booking.
      </p>

      <p className="text-[11px] text-gray-500 mt-1">
        <span className="inline-block w-3 h-3 rounded-sm bg-red-50 border border-red-400 align-middle mr-1" />
        Red tables are already booked and cannot be selected.
      </p>
    </div>
  );
}

export default TableLayout;
