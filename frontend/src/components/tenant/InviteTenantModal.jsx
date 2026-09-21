import { MdClose, MdMailOutline } from "react-icons/md";
import InputField from "../forms/InputField";
import PrimaryButton from "../buttons/PrimaryButton";

const InviteTenantModal = ({
  open,
  onClose,
  formData,
  onChange,
  onSubmit,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">

      <div className="w-full max-w-xl max-h-[90vh] rounded-3xl bg-white shadow-2xl flex flex-col overflow-hidden">

        {/* Header */}

        <div className="flex items-center justify-between border-b border-gray-200 px-8 py-6 flex-shrink-0">
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
            onClick={onClose}
            className="rounded-xl p-2 text-gray-500 transition hover:bg-gray-100 hover:text-red-500"
          >
            <MdClose size={24} />
          </button>

        </div>

        {/* Scrollable Body */}

        <div className="flex-1 overflow-y-auto px-8 py-8 space-y-5">
          <InputField
            label="Organization Name"
            name="organizationName"
            value={formData.organizationName}
            onChange={onChange}
            placeholder="ABC Technologies"
          />

          <InputField
            label="Contact Person"
            name="contactPerson"
            value={formData.contactPerson}
            onChange={onChange}
            placeholder="John David"
          />

          <InputField
            label="Business Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={onChange}
            placeholder="admin@company.com"
          />

          <InputField
            label="Phone Number"
            name="phone"
            value={formData.phone}
            onChange={onChange}
            placeholder="+91 9876543210"
          />

          <div>

            <label className="mb-2 block text-sm font-medium text-gray-700">
              Invitation Message
            </label>

            <textarea
              rows={5}
              name="message"
              value={formData.message}
              onChange={onChange}
              placeholder="Write a short invitation message..."
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100 resize-none"
            />

          </div>

        </div>

        {/* Footer */}

        <div className="flex justify-end gap-4 border-t border-gray-200 px-8 py-6 bg-white flex-shrink-0">

          <button
            onClick={onClose}
            className="rounded-xl border border-gray-300 px-6 py-3 font-medium transition hover:bg-gray-100"
          >
            Cancel
          </button>

          <div className="w-44">

            <PrimaryButton
              text="Send Invite"
              onClick={onSubmit}
            />

          </div>

        </div>

      </div>

    </div>
  );
};

export default InviteTenantModal;