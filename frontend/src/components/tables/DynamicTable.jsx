const DynamicTable = ({
  columns = [],
  data = [],
  rowKey = "id",
  onRowClick,
  emptyTitle = "No Data Found",
  emptyDescription = "There are no records to display.",
  emptyIcon: EmptyIcon,
  minWidth = "900px",
  className = "",
}) => {
  const getRowKey = (row, index) => {
    if (typeof rowKey === "function") {
      return rowKey(row, index);
    }

    return row?.[rowKey] ?? index;
  };

  const renderCell = (
    column,
    row,
    rowIndex
  ) => {
    if (
      typeof column.render === "function"
    ) {
      return column.render(
        row,
        rowIndex
      );
    }

    if (
      typeof column.accessor === "function"
    ) {
      return column.accessor(
        row,
        rowIndex
      );
    }

    const value =
      row?.[column.accessor];

    return (
      value ??
      column.emptyValue ??
      "—"
    );
  };

  return (
    <div
      className={`
        rounded-xl
        border
        border-gray-200
        bg-white
        shadow-sm
        ${className}
      `}
    >
      <div className="overflow-x-auto rounded-xl">
        <table
          className="w-full"
          style={{
            minWidth,
          }}
        >
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              {columns.map((column, columnIndex) => (
                <th
                  key={column.key}
                  className={`
                    px-5
                    py-4
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wide
                    text-gray-500
                    whitespace-nowrap
                    ${
                      column.headerClassName ||
                      "text-left"
                    }
                    ${
                      columnIndex <
                      columns.length - 1
                        ? "border-r border-gray-200"
                        : ""
                    }
                  `}
                  style={{
                    width: column.width,
                    minWidth:
                      column.minWidth,
                  }}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {data.length > 0 ? (
              data.map(
                (row, rowIndex) => (
                  <tr
                    key={getRowKey(
                      row,
                      rowIndex
                    )}
                    onClick={() =>
                      onRowClick?.(
                        row,
                        rowIndex
                      )
                    }
                    className={`
                      transition-colors
                      ${
                        onRowClick
                          ? "cursor-pointer hover:bg-gray-50"
                          : ""
                      }
                    `}
                  >
                    {columns.map(
                      (column, columnIndex) => (
                        <td
                          key={column.key}
                          className={`
                            px-5
                            py-4
                            text-sm
                            text-gray-600
                            ${
                              column.cellClassName ||
                              ""
                            }
                            ${
                              columnIndex <
                              columns.length - 1
                                ? "border-r border-gray-200"
                                : ""
                            }
                          `}
                          onClick={
                            column.stopRowClick
                              ? (
                                  event
                                ) =>
                                  event.stopPropagation()
                              : undefined
                          }
                        >
                          {renderCell(
                            column,
                            row,
                            rowIndex
                          )}
                        </td>
                      )
                    )}
                  </tr>
                )
              )
            ) : (
              <tr>
                <td
                  colSpan={
                    columns.length ||
                    1
                  }
                  className="px-5 py-12 text-center"
                >
                  <div className="flex flex-col items-center justify-center">
                    {EmptyIcon && (
                      <EmptyIcon
                        size={42}
                        className="mb-3 text-gray-300"
                      />
                    )}

                    <p className="text-sm font-medium text-gray-600">
                      {emptyTitle}
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      {emptyDescription}
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DynamicTable;