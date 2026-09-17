import {
  MdClose,
  MdMailOutline,
} from "react-icons/md";

import InputField from "../forms/InputField";

import PrimaryButton from "../buttons/PrimaryButton";

const InviteTenantModal = ({
  open,
  onClose,
  formData,
  onChange,
  onSubmit,
  loading,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-xl rounded-3xl bg-white shadow-2xl overflow-hidden">

        {/* Header */}

        <div className="flex items-center justify-between border-b border-gray-200 px-8 py-6">
          <div className="flex items-center gap-4">

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100">
              <MdMailOutline className="text-3xl text-green-700" />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Invite Tenant
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Send an invitation email to an organization.
              </p>
            </div>

          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-xl p-2 text-gray-500 transition hover:bg-gray-100 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <MdClose size={24} />
          </button>
        </div>

        {/* Body */}

        <div className="space-y-5 px-8 py-8">

          <InputField
            label="Organization Name"
            name="organizationName"
            value={
              formData?.organizationName || ""
            }
            onChange={onChange}
            placeholder="ABC Technologies"
          />

          <InputField
            label="Email"
            type="email"
            name="email"
            value={
              formData?.email || ""
            }
            onChange={onChange}
            placeholder="admin@company.com"
          />

        </div>

        {/* Footer */}

        <div className="flex justify-end gap-4 border-t border-gray-200 bg-white px-8 py-6">

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-xl border border-gray-300 px-6 py-3 font-medium transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <div className="w-44">

            {loading ? (
              <button
                type="button"
                disabled
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-700 px-6 py-3 font-semibold text-white opacity-80 cursor-not-allowed"
              >
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />

                Sending...
              </button>
            ) : (
              <PrimaryButton
                text="Send Invitation"
                onClick={onSubmit}
              />
            )}

          </div>

        </div>

      </div>
    </div>
  );
};

export default InviteTenantModal;