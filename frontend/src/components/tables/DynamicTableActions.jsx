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
} from "react-icons/md";

const DynamicTableActions = ({
  row,
  actions = [],
  disabled = false,
  disabledReason,

  buttonLabel = "Quick actions",

  menuWidth = 176,
  menuHeight = 120,
}) => {
  const [isOpen, setIsOpen] =
    useState(false);

  const [menuDirection, setMenuDirection] =
    useState("down");

  const [menuPosition, setMenuPosition] =
    useState({
      top: 0,
      left: 0,
    });

  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const clickedInsideMenu =
        menuRef.current?.contains(
          event.target
        );

      const clickedMenuButton =
        buttonRef.current?.contains(
          event.target
        );

      if (
        !clickedInsideMenu &&
        !clickedMenuButton
      ) {
        setIsOpen(false);
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

  const getActionIcon = (action) => {
    if (action?.icon) {
      return action.icon;
    }

    switch (action?.type) {
      case "approve":
        return MdCheck;

      case "delete":
      case "reject":
      case "remove":
        return MdDelete;

      case "inactive":
        return MdBlock;

      default:
        return null;
    }
  };

  const getActionStyles = (action) => {
    if (action?.className) {
      return action.className;
    }

    switch (action?.type) {
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

  const filterActions = (
    actionList = []
  ) => {
    return actionList.filter((action) => {
      if (!action) {
        return false;
      }

      const actionType =
        action.type?.toLowerCase();

      const actionLabel =
        action.label?.toLowerCase();

      return (
        actionType !== "view" &&
        actionType !== "viewuser" &&
        actionLabel !== "view" &&
        actionLabel !== "view user"
      );
    });
  };

  const resolvedActions =
    typeof actions === "function"
      ? actions(row)
      : actions;

  const quickActions =
    filterActions(resolvedActions);

  const handleMenuToggle = (event) => {
    event.stopPropagation();

    if (disabled) {
      return;
    }

    if (isOpen) {
      setIsOpen(false);
      return;
    }

    const buttonRect =
      event.currentTarget.getBoundingClientRect();

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

    setIsOpen(true);
  };

  const handleActionClick = (
    action
  ) => {
    setIsOpen(false);

    action?.onClick?.(row);
  };

  /*
   * No actions available.
   *
   * We still render the three-dot button so
   * the table layout remains unchanged.
   */
  if (quickActions.length === 0) {
    return null;
  }

  return (
    <>
      {/* Three Dots */}

      <div className="flex w-full items-center justify-center">
        <button
          ref={buttonRef}
          type="button"
          onClick={handleMenuToggle}
          disabled={disabled}
          title={
            disabledReason ||
            buttonLabel
          }
          aria-label={buttonLabel}
          aria-expanded={isOpen}
          className="
            rounded-lg
            p-2
            text-xl
            text-gray-500
            transition
            hover:bg-gray-100
            hover:text-gray-700
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          <MdMoreVert />
        </button>
      </div>

      {/* Quick Actions Menu */}

      {isOpen && (
        <div
          ref={menuRef}
          className="
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
          "
          style={{
            top: `${menuPosition.top}px`,
            left: `${menuPosition.left}px`,
          }}
          data-direction={menuDirection}
          onMouseDown={(event) => {
            event.stopPropagation();
          }}
        >
          {quickActions.map(
            (action, index) => {
              const Icon =
                getActionIcon(action);

              const actionStyles =
                getActionStyles(action);

              return (
                <button
                  key={
                    action.key ||
                    action.type ||
                    `${action.label}-${index}`
                  }
                  type="button"
                  disabled={action.disabled}
                  onClick={() =>
                    handleActionClick(
                      action
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
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  {Icon && (
                    <span
                      className={`
                        flex
                        shrink-0
                        items-center
                        text-lg
                        ${actionStyles}
                      `}
                    >
                      <Icon />
                    </span>
                  )}

                  <span
                    className={
                      actionStyles
                    }
                  >
                    {action.label}
                  </span>
                </button>
              );
            }
          )}
        </div>
      )}
    </>
  );
};

export default DynamicTableActions;