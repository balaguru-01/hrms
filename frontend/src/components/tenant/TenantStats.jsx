import {
  MdBusiness,
  MdCheckCircle,
  MdPendingActions,
  MdMailOutline,
} from "react-icons/md";

const stats = [
  {
    id: 1,
    title: "Total Tenants",
    value: 28,
    icon: <MdBusiness />,
    bg: "bg-blue-100",
    color: "text-blue-600",
  },
  {
    id: 2,
    title: "Active Tenants",
    value: 22,
    icon: <MdCheckCircle />,
    bg: "bg-green-100",
    color: "text-green-600",
  },
  {
    id: 3,
    title: "Pending Approval",
    value: 4,
    icon: <MdPendingActions />,
    bg: "bg-yellow-100",
    color: "text-yellow-600",
  },
  {
    id: 4,
    title: "Invitations Sent",
    value: 9,
    icon: <MdMailOutline />,
    bg: "bg-purple-100",
    color: "text-purple-600",
  },
];

const TenantStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {stats.map((item) => (
        <div
          key={item.id}
          className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 transition hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">{item.title}</p>

              <h2 className="text-3xl font-bold text-gray-900 mt-2">
                {item.value}
              </h2>
            </div>

            <div
              className={`h-14 w-14 rounded-2xl flex items-center justify-center text-3xl ${item.bg} ${item.color}`}
            >
              {item.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TenantStats;