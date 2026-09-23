import { MdSearch, MdRefresh } from "react-icons/md";

const PendingToolbar = ({
  search,
  onSearch,
  onRefresh,
}) => {
  return (
    <div
      className="
        rounded-3xl
        border
        border-gray-200
        bg-white
        p-6
        shadow-sm
      "
    >
      <div
        className="
          flex
          flex-col
          gap-5
          lg:flex-row
          lg:items-center
          lg:justify-between
        "
      >
        {/* Search */}

        <div className="relative w-full lg:max-w-md">

          <MdSearch
            className="
              absolute
              left-4
              top-1/2
              -translate-y-1/2
              text-xl
              text-gray-400
            "
          />

          <input
            type="text"
            value={search}
            onChange={onSearch}
            placeholder="Search pending requests..."
            className="
              w-full
              rounded-2xl
              border
              border-gray-300
              py-3
              pl-12
              pr-4
              outline-none
              transition

              focus:border-green-600
              focus:ring-4
              focus:ring-green-100
            "
          />

        </div>

        {/* Refresh */}

        <button
          onClick={onRefresh}
          className="
            flex
            items-center
            justify-center
            gap-2

            rounded-2xl

            bg-green-700
            px-6
            py-3

            font-semibold
            text-white

            transition
            hover:bg-green-800
          "
        >
          <MdRefresh className="text-xl" />

          Refresh
        </button>

      </div>
    </div>
  );
};

export default PendingToolbar;