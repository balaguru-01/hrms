import { MdKeyboardArrowRight } from "react-icons/md";

const LoginOptionCard = ({
  icon,
  title,
  description,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="
      w-full
      p-5
      rounded-2xl
      border
      border-gray-200
      bg-white
      cursor-pointer
      transition-all
      duration-300
      hover:border-green-600
      hover:shadow-xl
      hover:-translate-y-1
      flex
      items-center
      justify-between
      "
    >
      <div className="flex items-center gap-5">

        <div className="text-green-700 text-5xl">
          {icon}
        </div>

        <div>

          <h2 className="font-semibold text-xl">
            {title}
          </h2>

          <p className="text-gray-500 text-sm">
            {description}
          </p>

        </div>

      </div>

      <MdKeyboardArrowRight
        className="text-3xl text-gray-400"
      />
    </div>
  );
};

export default LoginOptionCard;