import { useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";

const StatusTabs = ({
  tabs,
  activeTab,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const activeTabData = tabs.find(
    (tab) => tab.key === activeTab
  );

  const handleSelect = (tabKey) => {
    onChange(tabKey);
    setIsOpen(false);
  };

  return (
    <>
      <div className="hidden items-center gap-1 p-1 sm:inline-flex">
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

      <div className="relative w-full sm:hidden">
        <button
          type="button"
          onClick={() =>
            setIsOpen((previous) => !previous)
          }
          className="
            flex
            w-full
            items-center
            justify-between
            rounded-lg
            border
            border-gray-200
            bg-white
            px-4
            py-3
            text-sm
            font-medium
            text-gray-700
            shadow-sm
          "
        >
          <span>
            {activeTabData?.label}
          </span>

          <MdKeyboardArrowDown
  className={`text-xl transition-transform ${
    isOpen ? "rotate-180" : ""
  }`}
/>
        </button>

        {isOpen && (
          <div
            className="
              absolute
              left-0
              right-0
              top-full
              z-50
              mt-1
              overflow-hidden
              rounded-lg
              border
              border-gray-200
              bg-white
              shadow-lg
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
                    handleSelect(tab.key)
                  }
                  className={`
                    flex
                    w-full
                    items-center
                    px-4
                    py-3
                    text-left
                    text-sm
                    font-medium
                    transition
                    ${
                      isActive
                        ? "bg-green-600 text-white"
                        : "text-gray-600 hover:bg-gray-50"
                    }
                  `}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default StatusTabs;