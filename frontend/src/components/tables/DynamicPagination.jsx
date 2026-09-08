const DynamicPagination = ({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  pageSize = 10,
  pageSizeOptions = [10, 20, 30, 50],
  onPageChange,
  onPageSizeChange,
  itemLabel = "items",
}) => {
  const startItem =
    totalItems === 0
      ? 0
      : (currentPage - 1) * pageSize + 1;

  const endItem =
    totalItems === 0
      ? 0
      : Math.min(
          currentPage * pageSize,
          totalItems
        );

  const safeTotalPages = Math.max(
    totalPages,
    1
  );

  const handlePageChange = (page) => {
    if (
      page < 1 ||
      page > totalPages ||
      page === currentPage
    ) {
      return;
    }

    onPageChange?.(page);
  };

  const handlePageSizeChange = (event) => {
    const newPageSize = Number(
      event.target.value
    );

    if (
      !pageSizeOptions.includes(newPageSize) ||
      newPageSize === pageSize
    ) {
      return;
    }

    onPageSizeChange?.(newPageSize);
  };

  if (totalItems === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white px-5 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      {/* Result Count + Rows Per Page */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Rows Per Page */}
        <div className="flex items-center gap-2">
          <label
            htmlFor="dynamic-table-rows-per-page"
            className="text-sm text-gray-500"
          >
            Rows per page:
          </label>

          <select
            id="dynamic-table-rows-per-page"
            value={pageSize}
            onChange={handlePageSizeChange}
            className="
              rounded-lg
              border
              border-gray-300
              bg-white
              px-2.5
              py-1.5
              text-sm
              font-medium
              text-gray-700
              outline-none
              transition
            "
          >
            {pageSizeOptions.map((option) => (
              <option
                key={option}
                value={option}
              >
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* Result Count */}
        <p className="text-sm text-gray-500">
          Showing{" "}
          <span className="font-medium text-gray-700">
            {startItem}
          </span>{" "}
          to{" "}
          <span className="font-medium text-gray-700">
            {endItem}
          </span>{" "}
          of{" "}
          <span className="font-medium text-gray-700">
            {totalItems}
          </span>{" "}
          {itemLabel}
        </p>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-2">
        {/* Previous Page */}
        <span
          role="button"
          tabIndex={
            currentPage === 1 ? -1 : 0
          }
          aria-label="Previous page"
          title="Previous page"
          onClick={() =>
            handlePageChange(
              currentPage - 1
            )
          }
          onKeyDown={(event) => {
            if (
              event.key === "Enter" ||
              event.key === " "
            ) {
              handlePageChange(
                currentPage - 1
              );
            }
          }}
          className={`
            text-base
            leading-none
            ${
              currentPage === 1
                ? "cursor-not-allowed opacity-50"
                : "cursor-pointer hover:text-gray-900"
            }
          `}
        >
          ◀
        </span>

        <span className="px-2 text-sm text-gray-600">
          Page{" "}
          <span className="font-semibold text-gray-900">
            {currentPage}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-gray-900">
            {safeTotalPages}
          </span>
        </span>

        {/* Next Page */}
        <span
          role="button"
          tabIndex={
            currentPage >= totalPages
              ? -1
              : 0
          }
          aria-label="Next page"
          title="Next page"
          onClick={() =>
            handlePageChange(
              currentPage + 1
            )
          }
          onKeyDown={(event) => {
            if (
              event.key === "Enter" ||
              event.key === " "
            ) {
              handlePageChange(
                currentPage + 1
              );
            }
          }}
          className={`
            text-base
            leading-none
            ${
              currentPage >= totalPages
                ? "cursor-not-allowed opacity-50"
                : "cursor-pointer hover:text-gray-900"
            }
          `}
        >
          ▶
        </span>
      </div>
    </div>
  );
};

export default DynamicPagination;