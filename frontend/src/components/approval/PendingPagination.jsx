const PendingPagination = ({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
}) => {
  return (
    <div className="mt-6 flex items-center justify-between rounded-2xl bg-white p-5 shadow-sm border border-gray-200">

      <p className="text-sm text-gray-500">
        Showing{" "}
        <span className="font-semibold text-gray-700">
          {Math.min((currentPage - 1) * pageSize + 1, totalItems)}
        </span>{" "}
        -
        <span className="font-semibold text-gray-700">
          {" "}
          {Math.min(currentPage * pageSize, totalItems)}
        </span>{" "}
        of{" "}
        <span className="font-semibold text-gray-700">
          {totalItems}
        </span>{" "}
        requests
      </p>

      <div className="flex items-center gap-3">

        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="
            rounded-xl
            border
            border-gray-300
            px-4
            py-2
            text-sm
            disabled:opacity-40
            hover:bg-gray-50
          "
        >
          Previous
        </button>

        <div className="rounded-xl bg-green-700 px-4 py-2 text-sm font-semibold text-white">
          {currentPage}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="
            rounded-xl
            border
            border-gray-300
            px-4
            py-2
            text-sm
            disabled:opacity-40
            hover:bg-gray-50
          "
        >
          Next
        </button>

      </div>

    </div>
  );
};

export default PendingPagination;