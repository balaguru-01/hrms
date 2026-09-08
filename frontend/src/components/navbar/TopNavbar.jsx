import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  MdSearch,
  MdNotificationsNone,
  MdKeyboardArrowDown,
  MdLogout,
  MdPerson,
} from "react-icons/md";

import { useNavigate } from "react-router-dom";

import {
  getStoredUser,
  logout,
  stopTokenExpirationTimer,
} from "../../utils/auth";

const TopNavbar = () => {
  const navigate = useNavigate();

  const [profileOpen, setProfileOpen] =
    useState(false);

  const profileRef = useRef(null);

  const user = getStoredUser();

  const firstName =
    user?.firstName || "Admin";

  const lastName =
    user?.lastName || "";

  const fullName =
    `${firstName} ${lastName}`.trim();

  const designation =
    user?.designation || "";

  const avatarLetter =
    firstName
      .charAt(0)
      .toUpperCase() || "A";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(
          event.target
        )
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  const handleLogout = () => {
    stopTokenExpirationTimer();
    logout();

    setProfileOpen(false);

    navigate("/", {
      replace: true,
    });
  };

  return (
    <header
      className="
        flex
        h-20
        w-full
        shrink-0
        items-center
        justify-between
        border-b
        border-gray-200
        bg-white
        px-3
        shadow-sm
        sm:px-5
        lg:px-8
      "
    >
      {/* Search */}
      <div
        className="
          relative
          min-w-0
          flex-1
          max-w-md
          mr-3
          sm:mr-5
          lg:mr-8
        "
      >
        <MdSearch
          className="
            absolute
            left-3
            top-1/2
            -translate-y-1/2
            text-xl
            text-gray-400
            sm:left-4
          "
        />

        <input
          type="text"
          placeholder="Search here..."
          className="
            w-full
            rounded-xl
            border
            border-gray-300
            bg-gray-50
            py-2.5
            pl-10
            pr-3
            text-sm
            outline-none
            transition
            focus:border-green-600
            focus:bg-white
            focus:ring-2
            focus:ring-green-100
            sm:py-3
            sm:pl-12
            sm:pr-4
          "
        />
      </div>

      {/* Right Controls */}
      <div
        className="
          flex
          shrink-0
          items-center
          gap-2
          sm:gap-4
          lg:gap-6
        "
      >
        {/* Notifications */}
        <button
          type="button"
          className="
            relative
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-xl
            border
            border-gray-200
            transition
            hover:bg-gray-50
            sm:h-11
            sm:w-11
          "
        >
          <MdNotificationsNone
            className="
              text-xl
              text-gray-700
              sm:text-2xl
            "
          />

          <span
            className="
              absolute
              right-1.5
              top-1.5
              h-2.5
              w-2.5
              rounded-full
              bg-red-500
              sm:right-2
              sm:top-2
            "
          />
        </button>

        {/* Profile */}
        <div
          ref={profileRef}
          className="relative shrink-0"
        >
          <button
            type="button"
            onClick={() =>
              setProfileOpen(
                (previous) => !previous
              )
            }
            className="
              flex
              items-center
              gap-2
              rounded-xl
              border
              border-gray-200
              px-2
              py-1.5
              transition
              hover:bg-gray-50
              sm:gap-3
              sm:px-3
              sm:py-2
            "
          >
            {/* Avatar */}
            <div
              className="
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-green-600
                text-base
                font-bold
                text-white
                sm:h-11
                sm:w-11
                sm:text-lg
              "
            >
              {avatarLetter}
            </div>

            {/* User Details */}
            <div
              className="
                hidden
                min-w-0
                text-left
                sm:block
              "
            >
              <h4 className="truncate text-sm font-semibold text-gray-900">
                {fullName}
              </h4>

              <p className="truncate text-xs text-gray-500">
                {designation}
              </p>
            </div>

            <MdKeyboardArrowDown
              className={`
                shrink-0
                text-lg
                text-gray-500
                transition-transform
                duration-200
                sm:text-xl
                ${
                  profileOpen
                    ? "rotate-180"
                    : ""
                }
              `}
            />
          </button>

          {/* Profile Dropdown */}
          {profileOpen && (
            <div
              className="
                absolute
                right-0
                top-full
                z-50
                mt-2
                w-56
                overflow-hidden
                rounded-xl
                border
                border-gray-200
                bg-white
                shadow-xl
              "
            >
              <div className="border-b border-gray-100 px-4 py-3">
                <p className="text-sm font-semibold text-gray-900">
                  {fullName}
                </p>

                <p className="mt-1 truncate text-xs text-gray-500">
                  {user?.email || ""}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setProfileOpen(false);
                  navigate(
                    "/enterprise/profile"
                  );
                }}
                className="
                  flex
                  w-full
                  items-center
                  gap-3
                  px-4
                  py-3
                  text-sm
                  text-gray-700
                  hover:bg-gray-50
                "
              >
                <MdPerson className="text-lg" />
                Profile
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="
                  flex
                  w-full
                  items-center
                  gap-3
                  border-t
                  border-gray-100
                  px-4
                  py-3
                  text-sm
                  font-medium
                  text-red-600
                  hover:bg-red-50
                "
              >
                <MdLogout className="text-lg" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;