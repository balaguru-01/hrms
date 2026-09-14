const StatusTabs = ({
  tabs,
  activeTab,
  onChange,
}) => {
  return (
    <div
      className="
        inline-flex
        items-center
        gap-1
        rounded-xl
        border
        border-gray-200
        bg-white
        p-1
        shadow-sm
      "
    >
      {tabs.map((tab) => {
        const isActive =
          activeTab === tab.key;

        return (
          <button
            key={tab.key}
            type="button"
            onClick={() =>
              onChange(tab.key)
            }
            className={`
              rounded-lg
              px-5
              py-2.5
              text-sm
              font-medium
              transition
              ${
                isActive
                  ? "bg-green-600 text-white shadow-lg"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
              }
            `}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

export default StatusTabs;