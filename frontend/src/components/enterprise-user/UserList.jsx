import {
  useEffect,
  useRef,
  useState,
} from "react";
import {
  MdCheck,
  MdDelete,
  MdBlock,
  MdMoreVert,
  MdVisibility,
  MdChevronLeft,
  MdChevronRight,
} from "react-icons/md";

const UserList = ({
  users = [],
  onUserClick,
  actions = [],
  loggedInUserId = null,

  // Pagination
  pagination = {
    currentPage: 1,
    pageSize: 10,
    totalUsers: 0,
    totalPages: 0,
  },
  onPageChange,
  onPageSizeChange,

  emptyTitle = "No users found",
  emptyDescription = "There are no users to display.",
}) => {
  const [openMenuId, setOpenMenuId] =
    useState(null);

  const [menuDirection, setMenuDirection] =
    useState("down");

  const [menuPosition, setMenuPosition] =
    useState({
      top: 0,
      left: 0,
    });

  const menuRef = useRef(null);
  const menuButtonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const clickedInsideMenu =
        menuRef.current?.contains(
          event.target
        );

      const clickedMenuButton =
        menuButtonRef.current?.contains(
          event.target
        );

      if (
        !clickedInsideMenu &&
        !clickedMenuButton
      ) {
        setOpenMenuId(null);
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

  const getStatusStyles = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-50 text-yellow-700";

      case "active":
        return "bg-green-50 text-green-700";

      case "rejected":
        return "bg-red-50 text-red-700";

      case "inactive":
        return "bg-gray-100 text-gray-600";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const formatStatus = (status) => {
    if (!status) {
      return "—";
    }

    return (
      status.charAt(0).toUpperCase() +
      status.slice(1)
    );
  };

  const getActionIcon = (action) => {
    if (action.icon) {
      return action.icon;
    }

    switch (action.type) {
      case "approve":
        return <MdCheck />;

      case "delete":
      case "reject":
      case "remove":
        return <MdDelete />;

      case "inactive":
        return <MdBlock />;

      default:
        return null;
    }
  };

  const getActionStyles = (action) => {
    switch (action.type) {
      case "approve":
        return "text-green-600 hover:bg-green-50 hover:text-green-700";

      case "delete":
      case "reject":
      case "remove":
        return "text-red-600 hover:bg-red-50 hover:text-red-700";

      case "inactive":
        return "text-yellow-600 hover:bg-yellow-50 hover:text-yellow-700";

      default:
        return "text-gray-600 hover:bg-gray-100 hover:text-gray-800";
    }
  };

  const handleActionClick = (
    action,
    user
  ) => {
    setOpenMenuId(null);
    action.onClick?.(user);
  };

  const filterQuickActions = (
    actionList = []
  ) => {
    return actionList.filter(
      (action) =>
        action?.type !== "view" &&
        action?.type !== "viewUser" &&
        action?.label?.toLowerCase() !==
          "view" &&
        action?.label?.toLowerCase() !==
          "view user"
    );
  };

  const handleMenuToggle = (
    event,
    userId
  ) => {
    event.stopPropagation();

    if (openMenuId === userId) {
      setOpenMenuId(null);
      return;
    }

    const buttonRect =
      event.currentTarget.getBoundingClientRect();

    const menuHeight = 120;
    const menuWidth = 176;
    const menuGap = 8;

    const spaceBelow =
      window.innerHeight -
      buttonRect.bottom;

    const spaceAbove =
      buttonRect.top;

    const shouldOpenUp =
      spaceBelow < menuHeight &&
      spaceAbove > spaceBelow;

    const calculatedTop = shouldOpenUp
      ? buttonRect.top -
        menuHeight -
        menuGap
      : buttonRect.bottom +
        menuGap;

    const calculatedLeft = Math.min(
      Math.max(
        buttonRect.right -
          menuWidth,
        8
      ),
      window.innerWidth -
        menuWidth -
        8
    );

    setMenuDirection(
      shouldOpenUp ? "up" : "down"
    );

    setMenuPosition({
      top: calculatedTop,
      left: calculatedLeft,
    });

    menuButtonRef.current =
      event.currentTarget;

    setOpenMenuId(userId);
  };

  const totalUsers =
    pagination?.totalUsers || 0;

  const currentPage =
    pagination?.currentPage || 1;

  const pageSize =
    pagination?.pageSize || 10;

  const totalPages =
    pagination?.totalPages || 0;

  const startItem =
    totalUsers === 0
      ? 0
      : (currentPage - 1) *
          pageSize +
        1;

  const endItem =
    totalUsers === 0
      ? 0
      : Math.min(
          currentPage * pageSize,
          totalUsers
        );

  if (users.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white px-6 py-12 text-center shadow-sm">
        <h3 className="text-base font-semibold text-gray-900">
          {emptyTitle}
        </h3>

        <p className="mt-1 text-sm text-gray-500">
          {emptyDescription}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-visible rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* Desktop Header */}
      <div
        className="
          hidden
          grid-cols-[1.4fr_1.3fr_1fr_0.8fr_150px]
          gap-0
          rounded-t-xl
          border-b
          border-gray-200
          bg-gray-50
          px-5
          py-3
          text-xs
          font-semibold
          uppercase
          tracking-wide
          text-gray-500
          md:grid
        "
      >
        {/* User - Left */}
        <span className="flex items-center justify-start">
          User
        </span>

        {/* Email - Left */}
        <span className="flex items-center justify-start border-l border-gray-200 pl-5">
          Email
        </span>

        {/* Role - Left */}
        <span className="flex items-center justify-start border-l border-gray-200 pl-5">
          Role
        </span>

        {/* Status - Center */}
        <span className="flex items-center justify-center border-l border-gray-200 text-center">
          Status
        </span>

        {/* Quick Actions - Left */}
        <span className="flex items-center justify-start border-l border-gray-200 pl-5">
          Quick Actions
        </span>
      </div>

      {/* Scrollable User Rows */}
      <div className="max-h-[420px] overflow-y-auto divide-y divide-gray-100">
        {users.map((user) => {
          const fullName =
            `${user.firstName || ""} ${
              user.lastName || ""
            }`.trim();

          const isCurrentUser =
            Boolean(loggedInUserId) &&
            String(user.id) ===
              String(loggedInUserId);

          const isMenuOpen =
            openMenuId === user.id;

          const resolvedActions =
            typeof actions === "function"
              ? actions(user)
              : actions;

          const quickActions =
            filterQuickActions(
              resolvedActions
            );

          return (
            <div
              key={user.id}
              className="
                relative
                grid
                grid-cols-1
                gap-3
                px-5
                py-4
                transition
                hover:bg-gray-50
                md:grid-cols-[1.4fr_1.3fr_1fr_0.8fr_150px]
                md:items-center
                md:gap-0
              "
            >
              {/* User - Left */}
              <div
                className="
                  flex
                  min-w-0
                  items-center
                  justify-between
                  gap-3
                  text-left
                "
              >
                <button
                  type="button"
                  onClick={() =>
                    onUserClick?.(user)
                  }
                  className="
                    flex
                    min-w-0
                    items-center
                    justify-start
                    gap-3
                    text-left
                  "
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100 font-semibold text-green-700">
                    {user.firstName
                      ?.charAt(0)
                      .toUpperCase() || "U"}
                  </div>

                  <div className="min-w-0 text-left">
                    <p className="truncate text-sm font-semibold text-gray-900">
                      {fullName ||
                        "Unknown User"}
                    </p>

                    <p className="truncate text-xs text-gray-500">
                      {user.designation ||
                        "—"}
                    </p>
                  </div>
                </button>

                {/* View Details */}
                <button
                  type="button"
                  onClick={() =>
                    onUserClick?.(user)
                  }
                  title={`View details of ${
                    fullName || "user"
                  }`}
                  aria-label={`View details of ${
                    fullName || "user"
                  }`}
                  className="
                    shrink-0
                    rounded-lg
                    p-2
                    text-lg
                    text-gray-400
                    transition
                    hover:bg-gray-100
                    hover:text-gray-700
                  "
                >
                  <MdVisibility />
                </button>
              </div>

              {/* Email - Left */}
              <button
                type="button"
                onClick={() =>
                  onUserClick?.(user)
                }
                className="
                  min-w-0
                  border-l
                  border-gray-200
                  text-left
                  md:pl-5
                "
              >
                <span className="text-xs text-gray-400 md:hidden">
                  Email
                </span>

                <p className="truncate text-sm text-gray-600">
                  {user.email || "—"}
                </p>
              </button>

              {/* Role - Left */}
              <button
                type="button"
                onClick={() =>
                  onUserClick?.(user)
                }
                className="
                  border-l
                  border-gray-200
                  text-left
                  md:pl-5
                "
              >
                <span className="text-xs text-gray-400 md:hidden">
                  Role
                </span>

                <p className="text-sm text-gray-700">
                  {user.role || "—"}
                </p>
              </button>

              {/* Status - Center */}
              <button
                type="button"
                onClick={() =>
                  onUserClick?.(user)
                }
                className="
                  flex
                  items-center
                  justify-center
                  border-l
                  border-gray-200
                  text-center
                "
              >
                <span className="text-xs text-gray-400 md:hidden">
                  Status
                </span>

                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getStatusStyles(
                    user.status
                  )}`}
                >
                  {formatStatus(
                    user.status
                  )}
                </span>
              </button>

              {/* Quick Actions */}
              <div
                className="
                  relative
                  flex
                  items-center
                  justify-center
                  border-l
                  border-gray-200
                  text-left
                  md:pl-5
                "
              >
                <span className="mr-2 text-xs text-gray-400 md:hidden">
                  Quick Actions
                </span>

                {isCurrentUser ? (
                  null
                ) : (
                  <>
                    {/* Three Dots */}
                    <button
                      type="button"
                      ref={
                        isMenuOpen
                          ? menuButtonRef
                          : null
                      }
                      onClick={(event) =>
                        handleMenuToggle(
                          event,
                          user.id
                        )
                      }
                      aria-label={`Quick actions for ${
                        fullName || "user"
                      }`}
                      aria-expanded={
                        isMenuOpen
                      }
                      className="
                        rounded-lg
                        p-2
                        text-xl
                        text-gray-500
                        transition
                        hover:bg-gray-100
                        hover:text-gray-700
                      "
                    >
                      <MdMoreVert />
                    </button>

                    {/* Quick Actions Menu */}
                    {isMenuOpen && (
                      <div
                        ref={menuRef}
                        className={`
                          fixed
                          z-[100]
                          w-44
                          rounded-xl
                          border
                          border-gray-200
                          bg-white
                          py-1
                          text-left
                          shadow-lg
                          ${
                            menuDirection ===
                            "up"
                              ? ""
                              : ""
                          }
                        `}
                        style={{
                          top: `${menuPosition.top}px`,
                          left: `${menuPosition.left}px`,
                        }}
                      >
                        {quickActions.map(
                          (action) => (
                            <button
                              key={
                                action.type
                              }
                              type="button"
                              onClick={() =>
                                handleActionClick(
                                  action,
                                  user
                                )
                              }
                              className="
                                flex
                                w-full
                                items-center
                                gap-3
                                px-4
                                py-2.5
                                text-left
                                text-sm
                                transition
                                hover:bg-gray-50
                              "
                            >
                              <span
                                className={`text-lg ${getActionStyles(
                                  action
                                )}`}
                              >
                                {getActionIcon(
                                  action
                                )}
                              </span>

                              <span
                                className={getActionStyles(
                                  action
                                )}
                              >
                                {action.label}
                              </span>
                            </button>
                          )
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {totalUsers > 0 && (
        <div className="flex flex-col gap-3 rounded-b-xl border-t border-gray-200 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            {/* Rows Per Page */}
            <div className="flex items-center gap-2">
              <label
                htmlFor="rows-per-page"
                className="text-sm text-gray-500"
              >
                Rows per page:
              </label>

              <select
                id="rows-per-page"
                value={pageSize}
                onChange={(event) =>
                  onPageSizeChange?.(
                    Number(event.target.value)
                  )
                }
                className="
                  rounded-lg
                  border
                  border-gray-300
                  bg-white
                  px-2.5
                  py-1.5
                  text-sm
                  font-medium
                  text-gray-700
                  outline-none
                  transition
                  focus:border-green-500
                  focus:ring-1
                  focus:ring-green-500
                "
              >
                <option value={10}>
                  10
                </option>

                <option value={20}>
                  20
                </option>

                <option value={30}>
                  30
                </option>

                <option value={50}>
                  50
                </option>
              </select>
            </div>

            {/* Result Count */}
            <p className="text-sm text-gray-500">
              Showing{" "}
              <span className="font-medium text-gray-700">
                {startItem}
              </span>{" "}
              to{" "}
              <span className="font-medium text-gray-700">
                {endItem}
              </span>{" "}
              of{" "}
              <span className="font-medium text-gray-700">
                {totalUsers}
              </span>{" "}
              users
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() =>
                onPageChange?.(
                  currentPage - 1
                )
              }
              aria-label="Previous page"
              title="Previous page"
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-lg
                border
                border-gray-300
                text-xl
                text-gray-700
                transition
                hover:bg-gray-50
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              <MdChevronLeft />
            </button>

            <span className="px-2 text-sm text-gray-600">
              Page{" "}
              <span className="font-semibold text-gray-900">
                {currentPage}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-900">
                {Math.max(
                  totalPages,
                  1
                )}
              </span>
            </span>

            <button
              type="button"
              disabled={
                currentPage >= totalPages
              }
              onClick={() =>
                onPageChange?.(
                  currentPage + 1
                )
              }
              aria-label="Next page"
              title="Next page"
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-lg
                border
                border-gray-300
                text-xl
                text-gray-700
                transition
                hover:bg-gray-50
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              <MdChevronRight />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;