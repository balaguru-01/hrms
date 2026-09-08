import {
  MdArrowDropDown,
  MdArrowDropUp,
} from "react-icons/md";

const PendingTableHeader = ({
  title,
  field,
  sortable = false,
  sortField,
  sortDirection,
  onSort,
}) => {
  const active = sortField === field;

  return (
    <th
      className={`
        px-6
        py-4
        text-center
        text-sm
        font-semibold
        text-gray-600
        ${
          field !== "organization"
            ? "border-l border-gray-200"
            : ""
        }
        ${
          sortable
            ? "cursor-pointer select-none hover:text-green-700"
            : ""
        }
      `}
      onClick={() =>
        sortable && onSort(field)
      }
    >
      <div className="flex items-center justify-center gap-1">
        {title}

        {sortable && active && (
          sortDirection === "asc" ? (
            <MdArrowDropUp className="text-xl" />
          ) : (
            <MdArrowDropDown className="text-xl" />
          )
        )}
      </div>
    </th>
  );
};

export default PendingTableHeader;