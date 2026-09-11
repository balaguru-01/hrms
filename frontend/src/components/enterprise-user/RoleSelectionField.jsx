import {
  useEffect,
  useRef,
  useState,
} from "react";

import RoleSelectionDropdown from "./RoleSelectionDropdown";

import {
  getAllowedRoles,
} from "../../api/enterpriseUserApi";

import {
  ROLE_SCOPE,
} from "../../utils/constants/roles";

import {
  useToast,
} from "../../context/ToastContext";

const formatRoleName = (
  roleName = ""
) => {
  return roleName
    .replace(
      /([a-z])([A-Z])/g,
      "$1 $2"
    )
    .replace(
      /^./,
      (character) =>
        character.toUpperCase()
    );
};

const RoleSelectionField = ({
  field,
  registration,
  formLoading = false,
}) => {
  const { showToast } =
    useToast();

  const [roles, setRoles] =
    useState([]);

  const [
    selectedRole,
    setSelectedRole,
  ] = useState(null);

  const [
    loadingRoles,
    setLoadingRoles,
  ] = useState(false);

  const [
    isDropdownOpen,
    setIsDropdownOpen,
  ] = useState(false);

  const roleSelectorRef =
    useRef(null);

  useEffect(() => {
    const handleClickOutside = (
      event
    ) => {
      if (
        roleSelectorRef.current &&
        !roleSelectorRef.current.contains(
          event.target
        )
      ) {
        setIsDropdownOpen(false);
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

  const handleRoleButtonClick =
    async () => {
      if (
        loadingRoles ||
        formLoading
      ) {
        return;
      }

      if (isDropdownOpen) {
        setIsDropdownOpen(false);
        return;
      }

      if (roles.length > 0) {
        setIsDropdownOpen(true);
        return;
      }

      try {
        setLoadingRoles(true);

        const response =
          await getAllowedRoles(
            ROLE_SCOPE.ENTERPRISE
          );

        if (!response?.success) {
          showToast({
            message:
              response?.message ||
              "Unable to fetch available roles.",
            type: "error",
          });

          return;
        }

        const availableRoles =
          Array.isArray(
            response.data
          )
            ? response.data
            : [];

        if (
          availableRoles.length === 0
        ) {
          showToast({
            message:
              "No roles are currently available for your account.",
            type: "warning",
          });

          return;
        }

        setRoles(
          availableRoles
        );

        setIsDropdownOpen(true);
      } catch (error) {
        const backendMessage =
          error?.response?.data
            ?.message ||
          error?.response?.data
            ?.error;

        showToast({
          message:
            backendMessage ||
            "Unable to fetch available roles. Please try again.",
          type: "error",
        });
      } finally {
        setLoadingRoles(false);
      }
    };

  const handleRoleSelect = (
    role
  ) => {
    setSelectedRole(role);

    registration?.onChange?.({
      target: {
        name: field.name,
        value: role._id,
      },
    });

    setIsDropdownOpen(false);
  };

  return (
    <div className="space-y-2">
      <label
        htmlFor="role-selection"
        className="block text-sm font-medium text-gray-700"
      >
        {field.label}

        {field.required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}
      </label>

      <div
        ref={roleSelectorRef}
        className="relative"
      >
        <button
          id="role-selection"
          type="button"
          onClick={
            handleRoleButtonClick
          }
          disabled={
            loadingRoles ||
            formLoading
          }
          className="flex w-full items-center justify-between gap-3 rounded-xl border border-gray-300 bg-white px-4 py-3 text-left text-sm text-gray-700 outline-none transition-all duration-200 hover:border-green-600 focus:border-green-600 focus:ring-2 focus:ring-green-100 disabled:cursor-not-allowed disabled:bg-gray-100"
        >
          <span
            className={
              selectedRole
                ? "font-medium text-gray-900"
                : "text-gray-400"
            }
          >
            {loadingRoles
              ? "Loading roles..."
              : selectedRole
              ? formatRoleName(
                  selectedRole.name
                )
              : "Select a role"}
          </span>

          <span
            className={`shrink-0 text-gray-500 transition-transform duration-200 ${
              isDropdownOpen
                ? "rotate-180"
                : ""
            }`}
          >
            ▼
          </span>
        </button>

        <RoleSelectionDropdown
          isOpen={
            isDropdownOpen
          }
          roles={roles}
          loading={
            loadingRoles
          }
          onRoleSelect={
            handleRoleSelect
          }
        />
      </div>
    </div>
  );
};

export default RoleSelectionField;