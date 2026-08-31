import {
  useEffect,
  useRef,
  useState,
} from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MdClose } from "react-icons/md";

import FormField from "../form/FormField";
import FormButton from "../form/FormButton";
import RoleSelectionDropdown from "./RoleSelectionDropdown";

import {
  inviteUserFields,
  inviteUserDefaultValues,
} from "../../config/forms/inviteUser.config";

import {
  inviteUserSchema,
} from "../../schemas/enterprise-user/inviteUser.schema";

import {
  getAllowedRoles,
} from "../../api/enterpriseUserApi";

import { ROLE_SCOPE } from "../../utils/constants/roles";

import { useToast } from "../../context/ToastContext";

const formatRoleName = (
  roleName = ""
) => {
  return roleName
    .replace(
      /([a-z])([A-Z])/g,
      "$1 $2"
    )
    .replace(/^./, (character) =>
      character.toUpperCase()
    );
};

const InviteUserForm = ({
  onCancel,
  onSubmit,
}) => {
  const { showToast } = useToast();

  const [roles, setRoles] = useState([]);

  const [
    loadingRoles,
    setLoadingRoles,
  ] = useState(false);

  const [
    isRoleDropdownOpen,
    setIsRoleDropdownOpen,
  ] = useState(false);

  const roleSelectorRef =
    useRef(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: {
      isSubmitting,
    },
  } = useForm({
    resolver:
      zodResolver(inviteUserSchema),
    defaultValues:
      inviteUserDefaultValues,
    mode: "onSubmit",
    reValidateMode: "onChange",
    shouldFocusError: false,
  });

  const selectedRoleId =
    watch("roleId");

  const selectedRole =
    roles.find(
      (role) =>
        role._id === selectedRoleId
    );

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
        setIsRoleDropdownOpen(false);
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

  const handleRoleButtonClick = async () => {
    if (
      loadingRoles ||
      isSubmitting
    ) {
      return;
    }

    if (isRoleDropdownOpen) {
      setIsRoleDropdownOpen(false);
      return;
    }

    if (roles.length > 0) {
      setIsRoleDropdownOpen(true);
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
        Array.isArray(response.data)
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

      setRoles(availableRoles);
      setIsRoleDropdownOpen(true);
    } catch (error) {
      const backendMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error;

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

  const handleRoleSelect = (role) => {
    setValue(
      "roleId",
      role._id,
      {
        shouldValidate: false,
        shouldDirty: true,
      }
    );

    setIsRoleDropdownOpen(false);
  };

  const handleFormSubmit = async (
    formData
  ) => {
    await onSubmit?.({
      ...formData,
      role: selectedRole || null,
    });
  };

  const handleValidationError = (
    validationErrors
  ) => {
    const firstError =
      Object.values(
        validationErrors || {}
      )[0];

    showToast({
      message:
        firstError?.message ||
        "Please complete the required invitation details.",
      type: "error",
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 px-4 py-6 backdrop-blur-[1px]"
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget &&
          !isSubmitting
        ) {
          onCancel?.();
        }
      }}
    >
      <div
        className="relative w-full max-w-xl rounded-2xl bg-white shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="invite-user-title"
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 sm:px-6">
          <div>
            <h2
              id="invite-user-title"
              className="text-xl font-semibold text-gray-900 sm:text-2xl"
            >
              Invite Admin / User
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Enter the details below and select
              the role for the invitation.
            </p>
          </div>

          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            aria-label="Close invitation form"
            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <MdClose className="text-2xl" />
          </button>
        </div>

        <form
          noValidate
          onSubmit={handleSubmit(
            handleFormSubmit,
            handleValidationError
          )}
          className="space-y-5 px-5 py-5 sm:px-6 sm:py-6"
        >
          {inviteUserFields.map(
            (field) => (
              <FormField
                key={field.name}
                field={field}
                registration={register(
                  field.name
                )}
              />
            )
          )}

          <div className="space-y-2">
            <label
              htmlFor="role-selection"
              className="block text-sm font-medium text-gray-700"
            >
              Select Role

              <span className="ml-1 text-red-500">
                *
              </span>
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
                  isSubmitting
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
                    isRoleDropdownOpen
                      ? "rotate-180"
                      : ""
                  }`}
                >
                  ▼
                </span>
              </button>

              <RoleSelectionDropdown
                isOpen={
                  isRoleDropdownOpen
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

          <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="min-w-[100px] rounded-xl border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <FormButton
              type="submit"
              loading={isSubmitting}
              disabled={isSubmitting}
              fullWidth={false}
              className="min-w-[130px] whitespace-nowrap px-6"
            >
              Send Invite
            </FormButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InviteUserForm;