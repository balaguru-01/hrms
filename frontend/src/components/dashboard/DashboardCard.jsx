import { MdInfoOutline } from "react-icons/md";

const DashboardCard = ({
  title,
  value,
  icon,
  color = "green",
  subtitle,
  onClick,
}) => {
  const colors = {
    green: {
      card: "bg-green-50/90 border-green-100",
      icon: "bg-green-100 text-green-700",
    },

    blue: {
      card: "bg-blue-50/90 border-blue-100",
      icon: "bg-blue-100 text-blue-700",
    },

    yellow: {
      card: "bg-yellow-50/90 border-yellow-100",
      icon: "bg-yellow-100 text-yellow-700",
    },

    red: {
      card: "bg-red-50/90 border-red-100",
      icon: "bg-red-100 text-red-700",
    },
  };

  const selectedColor =
    colors[color] || colors.green;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        w-full
        rounded-xl
        border-2
        ${selectedColor.card}
        p-4
        text-left
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-md
        focus:outline-none
        focus:ring-2
        focus:ring-green-500
        focus:ring-offset-2
      `}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="relative flex items-center gap-1.5">
            <p className="text-sm font-bold text-gray-900">
              {title}
            </p>

            {subtitle && (
              <div className="group relative flex items-center">
                <span
                  aria-label={`More information about ${title}`}
                  className="
                    flex
                    items-center
                    justify-center
                    text-base
                    text-gray-400
                    transition
                    group-hover:text-gray-600
                  "
                >
                  <MdInfoOutline />
                </span>

                <div
                  className="
                    pointer-events-none
                    absolute
                    left-0
                    top-full
                    z-50
                    mt-2
                    w-56
                    rounded-lg
                    border
                    border-gray-200
                    bg-white
                    px-3
                    py-2
                    text-xs
                    font-normal
                    leading-5
                    text-gray-600
                    opacity-0
                    shadow-lg
                    transition-opacity
                    duration-150
                    group-hover:opacity-100
                  "
                >
                  {subtitle}
                </div>
              </div>
            )}
          </div>

          <h2 className="mt-2 text-3xl font-bold text-gray-900">
            {value}
          </h2>
        </div>

        <div
          className={`
            flex
            h-12
            w-12
            shrink-0
            items-center
            justify-center
            rounded-xl
            text-2xl
            ${selectedColor.icon}
          `}
        >
          {icon}
        </div>
      </div>
    </button>
  );
};

export default DashboardCard;