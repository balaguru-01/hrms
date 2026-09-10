import {
  useState,
} from "react";

import { MdClose } from "react-icons/md";

import DynamicForm from "../form/DynamicForm";

import {
  inviteUserFields,
  inviteUserDefaultValues,
} from "../../config/EnterpriseAdmin/EpAdminInviteUserConfig";

import {
  inviteUserSchema,
} from "../../schemas/enterprise-user/inviteUser.schema";

import {
  useToast,
} from "../../context/ToastContext";

const InviteUserForm = ({
  onCancel,
  onSubmit,
}) => {
  const { showToast } =
    useToast();

  const [
    loading,
    setLoading,
  ] = useState(false);

  const handleFormSubmit =
    async (formData) => {
      try {
        setLoading(true);

        await onSubmit?.(formData);
      } catch (error) {
        const backendMessage =
          error?.response?.data?.message ||
          error?.response?.data?.error;

        showToast({
          message:
            backendMessage ||
            "Unable to send invitation. Please try again.",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    };

  const handleValidationError =
    (validationErrors) => {
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
          !loading
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
            disabled={loading}
            aria-label="Close invitation form"
            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <MdClose className="text-2xl" />
          </button>
        </div>

        <div className="px-5 py-5 sm:px-6 sm:py-6">
          <DynamicForm
            fields={inviteUserFields}
            schema={inviteUserSchema}
            defaultValues={
              inviteUserDefaultValues
            }
            onSubmit={
              handleFormSubmit
            }
            onValidationError={
              handleValidationError
            }
            submitText="Send Invite"
            loadingText="Sending..."
            loading={loading}
            mode="onSubmit"
            disableSubmitUntilFilled={
              false
            }
            twoColumnLayout={false}
            submitButtonFullWidth={false}
            className="invite-user-form"
          />
        </div>
      </div>
    </div>
  );
};

export default InviteUserForm;