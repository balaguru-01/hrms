import { MdBusiness, MdAdd } from "react-icons/md";

const TenantEmptyState = ({
  title = "No tenants found",
  description = "Create your first tenant or invite an organization to get started.",
  buttonText = "Create Tenant",
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-300 bg-white px-10 py-20 text-center shadow-sm">

      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
        <MdBusiness className="text-5xl text-green-700" />
      </div>

      <h2 className="mt-6 text-2xl font-bold text-gray-900">
        {title}
      </h2>

      <p className="mt-3 max-w-md text-gray-500">
        {description}
      </p>

      <button
        onClick={onAction}
        className="mt-8 flex items-center gap-2 rounded-2xl bg-green-700 px-6 py-3 font-semibold text-white transition hover:bg-green-800"
      >
        <MdAdd className="text-xl" />
        {buttonText}
      </button>

    </div>
  );
};

export default TenantEmptyState;