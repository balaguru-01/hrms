const filters = [
  "All",
  "Pending",
  "Approved",
  "Rejected",
];

const PendingFilter = ({
  selectedFilter,
  onFilterChange,
}) => {
  return (
    <div
      className="
        flex
        flex-wrap
        gap-3
      "
    >
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => onFilterChange(filter)}
          className={`
            rounded-2xl
            px-5
            py-2.5
            text-sm
            font-semibold
            transition-all

            ${
              selectedFilter === filter
                ? "bg-green-700 text-white shadow-md"
                : "border border-gray-300 bg-white text-gray-600 hover:border-green-500 hover:text-green-700"
            }
          `}
        >
          {filter}
        </button>
      ))}
    </div>
  );
};

export default PendingFilter;