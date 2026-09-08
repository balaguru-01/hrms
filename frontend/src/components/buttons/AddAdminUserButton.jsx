import { MdPersonAdd } from "react-icons/md";

const AddAdminUserButton = ({
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        flex
        w-full
        items-center
        justify-center
        gap-2
        rounded-lg
        bg-green-700
        px-3
        py-2
        text-sm
        font-semibold
        text-white
        shadow-sm
        transition-all
        duration-300
        hover:bg-green-800
        hover:shadow-md
        focus:outline-none
        focus:ring-2
        focus:ring-green-600
        focus:ring-offset-2
        sm:w-48
      "
    >
      <MdPersonAdd
        className="text-lg"
        aria-hidden="true"
      />

      <span>
        Invite User
      </span>
    </button>
  );
};

export default AddAdminUserButton;