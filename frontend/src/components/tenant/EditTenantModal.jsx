import { useEffect, useState } from "react";

import { MdClose, MdEdit } from "react-icons/md";

import InputField from "../forms/InputField";

import PrimaryButton from "../buttons/PrimaryButton";

const EditTenantModal = ({
  open,
  tenant,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState({
    organization: "",
    contact: "",
    email: "",
    phone: "",
    employees: "",
    status: "Active",
  });

  useEffect(() => {
    if (tenant) {
      const employeeCount = Number(tenant.employees) || 0;

      setFormData({
        organization: tenant.organization || "",
        contact: tenant.contact || "",
        email: tenant.email || "",
        phone: tenant.phone || "",
        employees: employeeCount > 70 ? 70 : employeeCount,
        status: tenant.status || "Active",
      });
    }
  }, [tenant]);

  if (!open || !tenant) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "employees") {
      if (value === "") {
        setFormData({
          ...formData,
          employees: "",
        });
        return;
      }

      const employeeCount = Number(value);

      if (employeeCount > 70) {
        return;
      }

      if (employeeCount < 0) {
        return;
      }

      setFormData({
        ...formData,
        employees: employeeCount,
      });

      return;
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSave = () => {
    const employeeCount = Number(formData.employees);

    if (employeeCount > 70) {
      return;
    }

    onSubmit?.({
      ...tenant,
      ...formData,
      employees: employeeCount,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-3xl bg-white shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-8 py-6">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-100">
              <MdEdit className="text-3xl text-yellow-700" />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Edit Tenant
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Update tenant organization details
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

        {/* Body */}
        <div className="grid grid-cols-2 gap-5 px-8 py-8">
          <InputField
            label="Organization Name"
            name="organization"
            value={formData.organization}
            onChange={handleChange}
          />

          <InputField
            label="Contact Person"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
          />

          <InputField
            label="Business Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />

          <InputField
            label="Phone Number"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />

          <InputField
            label="Employee Count"
            name="employees"
            type="number"
            min="0"
            max="70"
            value={formData.employees}
            onChange={handleChange}
          />

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Status
            </label>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
            >
              <option>Active</option>
              <option>Pending</option>
              <option>Inactive</option>
            </select>
          </div>
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
              text="Save Changes"
              onClick={handleSave}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditTenantModal;