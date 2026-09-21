import { MdClose } from "react-icons/md";

import InputField from "../forms/InputField";
import PrimaryButton from "../buttons/PrimaryButton";

const CreateTenantModal = ({
  open,
  onClose,
  formData,
  onChange,
  onSubmit,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">

      <div className="w-full max-w-2xl rounded-3xl bg-white shadow-2xl">

        {/* Header */}

        <div className="flex items-center justify-between border-b border-gray-200 px-8 py-6">

          <div>

            <h2 className="text-2xl font-bold text-gray-900">
              Create Tenant
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Register a new organization directly into TenantHub.
            </p>

          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 text-gray-500 transition hover:bg-gray-100 hover:text-red-500"
          >
            <MdClose size={24} />
          </button>

        </div>

        {/* Body */}

        <div className="grid grid-cols-1 gap-5 px-8 py-8 md:grid-cols-2">

          <InputField
            label="Organization Name"
            name="organizationName"
            value={formData.organizationName}
            onChange={onChange}
            placeholder="ABC Technologies"
          />

          <InputField
            label="Organization Code"
            name="organizationCode"
            value={formData.organizationCode}
            onChange={onChange}
            placeholder="ORG001"
          />

          <InputField
            label="Admin Name"
            name="adminName"
            value={formData.adminName}
            onChange={onChange}
            placeholder="John David"
          />

          <InputField
            label="Admin Email"
            type="email"
            name="adminEmail"
            value={formData.adminEmail}
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

          <InputField
            label="Company Domain"
            name="domain"
            value={formData.domain}
            onChange={onChange}
            placeholder="company.com"
          />

        </div>

        {/* Footer */}

        <div className="flex justify-end gap-4 border-t border-gray-200 px-8 py-6">

          <button
            onClick={onClose}
            className="rounded-xl border border-gray-300 px-6 py-3 font-medium transition hover:bg-gray-100"
          >
            Cancel
          </button>

          <div className="w-44">
            <PrimaryButton
              text="Create Tenant"
              onClick={onSubmit}
            />
          </div>

        </div>

      </div>

    </div>
  );
};

export default CreateTenantModal;