import {
  MdClose,
  MdMailOutline,
  MdOutlineHourglassTop,
} from "react-icons/md";

import InputField from "../forms/InputField";
import PrimaryButton from "../buttons/PrimaryButton";

const InviteTenantModal = ({
  open,
  onClose,
  formData,
  onChange,
  onSubmit,
  loading = false,
}) => {
  if (!open) return null;

  // Organization name validation
  const handleOrganizationChange = (e) => {
    const value = e.target.value;

    // Only lowercase letters are allowed
    const cleanedValue = value
      .toLowerCase()
      .replace(/[^a-z]/g, "");

    onChange({
      target: {
        name: "organizationName",
        value: cleanedValue,
      },
    });
  };

  // Email validation
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
  };

  const emailIsValid = isValidEmail(formData.email.trim());

  // Enable button only when:
  // 1. Organization name exists
  // 2. Email exists
  // 3. Email format is correct
  // 4. Not loading
  const isInviteDisabled =
    loading ||
    !formData.organizationName.trim() ||
    !formData.email.trim() ||
    !emailIsValid;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">

        {/* ================= HEADER ================= */}
        <div className="flex flex-shrink-0 items-center justify-between border-b border-gray-200 px-8 py-6">
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

        {/* ================= BODY ================= */}
        <div className="flex-1 space-y-5 overflow-y-auto px-8 py-8">

          {/* Organization Name */}
          <div>
            <InputField
              label="Organization Name"
              name="organizationName"
              value={formData.organizationName}
              onChange={handleOrganizationChange}
              placeholder="abctechnologies"
              disabled={loading}
              required
              helperText="Use only lowercase letters"
            />

            <p className="mt-2 text-xs text-gray-500">
              Numbers, spaces, and symbols are restricted.
            </p>
          </div>

          {/* Business Email */}
          <div>
            <InputField
              label="Business Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={onChange}
              placeholder="admin@company.com"
              disabled={loading}
              required
            />

            {/* Show email error only after user starts typing */}
            {formData.email.trim() && !emailIsValid && (
              <p className="mt-2 text-xs text-red-500">
                Please enter a valid email address.
              </p>
            )}
          </div>

          {/* Loading Message */}
          {loading && (
            <div className="flex items-center justify-center gap-3 rounded-xl bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
              <MdOutlineHourglassTop className="animate-spin text-xl" />

              <span>
                Sending invitation email...
              </span>
            </div>
          )}

        </div>

        {/* ================= FOOTER ================= */}
        <div className="flex flex-shrink-0 justify-end gap-4 border-t border-gray-200 bg-white px-8 py-6">

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-xl border border-gray-300 px-6 py-3 font-medium transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <div className="w-44">
            <PrimaryButton
              text={loading ? "Sending..." : "Send Invite"}
              onClick={onSubmit}
              disabled={isInviteDisabled}
            />
          </div>

        </div>
      </div>
    </div>
  );
};

export default InviteTenantModal;