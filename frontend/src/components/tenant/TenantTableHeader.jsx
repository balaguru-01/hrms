import {
  MdArrowDropUp,
  MdArrowDropDown,
} from "react-icons/md";

const TenantTableHeader = ({
  title,
  field,
  sortable = false,
  sortField,
  sortDirection,
  onSort,
}) => {
  const active = sortField === field;

  return (
    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">

      {sortable ? (
        <button
          onClick={() => onSort(field)}
          className="flex items-center gap-1 transition hover:text-green-700"
        >
          <span>{title}</span>

          <span className="flex flex-col -space-y-3">

            <MdArrowDropUp
              className={`text-lg ${
                active && sortDirection === "asc"
                  ? "text-green-700"
                  : "text-gray-400"
              }`}
            />

            <MdArrowDropDown
              className={`text-lg ${
                active && sortDirection === "desc"
                  ? "text-green-700"
                  : "text-gray-400"
              }`}
            />

          </span>

        </button>
      ) : (
        title
      )}

    </th>
  );
};

export default TenantTableHeader;