import {
  MdPendingActions,
  MdCheckCircle,
  MdCancel,
  MdBusiness,
} from "react-icons/md";

const StatCard = ({
  title,
  value,
  icon,
  iconBg,
  iconColor,
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
      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm font-medium text-gray-500">
            {title}
          </p>

          <h3 className="mt-3 text-3xl font-bold text-gray-900">
            {value}
          </h3>

        </div>

        <div
          className={`
            flex
            h-16
            w-16
            items-center
            justify-center
            rounded-2xl
            ${iconBg}
          `}
        >
          <div className={iconColor}>
            {icon}
          </div>
        </div>

      </div>
    </div>
  );
};

const PendingStats = ({
  total = 0,
  approved = 0,
  rejected = 0,
  pending = 0,
}) => {
  return (
    <div
      className="
        grid
        gap-6
        md:grid-cols-2
        xl:grid-cols-4
      "
    >
      <StatCard
        title="Total Requests"
        value={total}
        icon={<MdBusiness size={34} />}
        iconBg="bg-blue-100"
        iconColor="text-blue-700"
      />

      <StatCard
        title="Pending"
        value={pending}
        icon={<MdPendingActions size={34} />}
        iconBg="bg-yellow-100"
        iconColor="text-yellow-700"
      />

      <StatCard
        title="Approved"
        value={approved}
        icon={<MdCheckCircle size={34} />}
        iconBg="bg-green-100"
        iconColor="text-green-700"
      />

      <StatCard
        title="Rejected"
        value={rejected}
        icon={<MdCancel size={34} />}
        iconBg="bg-red-100"
        iconColor="text-red-700"
      />

    </div>
  );
};

export default PendingStats;