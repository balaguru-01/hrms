import {
  MdChevronLeft,
  MdChevronRight,
} from "react-icons/md";

const TenantPagination = ({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  pageSize = 10,
  onPageChange,
}) => {
  const start =
    totalItems === 0
      ? 0
      : (currentPage - 1) * pageSize + 1;

  const end = Math.min(
    currentPage * pageSize,
    totalItems
  );

  const pages = [];

  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="mt-6 flex flex-col items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:flex-row">

      {/* Left */}

      <p className="text-sm text-gray-500">
        Showing{" "}
        <span className="font-semibold text-gray-800">
          {start}
        </span>{" "}
        to{" "}
        <span className="font-semibold text-gray-800">
          {end}
        </span>{" "}
        of{" "}
        <span className="font-semibold text-gray-800">
          {totalItems}
        </span>{" "}
        tenants
      </p>

      {/* Right */}

      <div className="flex items-center gap-2">

        <button
          disabled={currentPage === 1}
          onClick={() =>
            onPageChange(currentPage - 1)
          }
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-300 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <MdChevronLeft size={22} />
        </button>

        {pages.map((page) => (
          <button
            key={page}
            onClick={() =>
              onPageChange(page)
            }
            className={`h-10 min-w-[40px] rounded-xl px-3 font-semibold transition ${
              page === currentPage
                ? "bg-green-700 text-white"
                : "border border-gray-300 text-gray-700 hover:bg-gray-100"
            }`}
          >
            {page}
          </button>
        ))}

        <button
          disabled={currentPage === totalPages}
          onClick={() =>
            onPageChange(currentPage + 1)
          }
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-300 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <MdChevronRight size={22} />
        </button>

      </div>

    </div>
  );
};

export default TenantPagination;