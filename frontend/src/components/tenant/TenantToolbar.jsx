import { MdMail, MdSearch } from "react-icons/md";

const TenantToolbar = ({
  search,
  onSearch,
  onInvite,
}) => {
  return (
    <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6">

      <div className="flex flex-col lg:flex-row items-center justify-between gap-5">

        {/* Search */}

        <div className="relative w-full lg:max-w-md">

          <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-gray-400" />

          <input
            type="text"
            value={search}
            onChange={onSearch}
            placeholder="Search tenant..."
            className="w-full rounded-2xl border border-gray-300 py-3 pl-12 pr-4 outline-none transition focus:border-green-600 focus:ring-4 focus:ring-green-100"
          />

        </div>

        {/* Invite Button */}

        <div className="flex w-full lg:w-auto">

          <button
            onClick={onInvite}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-green-600 px-6 py-3 font-semibold text-green-700 transition hover:bg-green-50 lg:w-auto"
          >
            <MdMail className="text-xl" />
            Invite Tenant
          </button>

        </div>

      </div>

    </div>
  );
};

export default TenantToolbar;