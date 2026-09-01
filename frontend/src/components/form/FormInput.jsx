import { MdEmail } from "react-icons/md";

const FormInput = ({
  field,
  registration,
}) => {
  const {
    name,
    type = "text",
    label,
    placeholder = "",
    disabled = false,
    inputClassName = "",
  } = field;

  const showEmailIcon =
    type === "email";

  return (
    <div className="space-y-2">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700"
      >
        {label}

        {field.required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}
      </label>

      <div className="relative">
        {showEmailIcon && (
          <MdEmail className="absolute left-4 top-1/2 z-10 -translate-y-1/2 text-xl text-gray-400" />
        )}

        <input
          id={name}
          type={type}
          name={name}
          placeholder={placeholder}
          disabled={disabled}
          {...registration}
          className={`w-full rounded-xl border border-gray-300 ${inputClassName || "py-3"} outline-none transition-all duration-200 focus:border-green-600 focus:ring-2 focus:ring-green-100 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500 ${
            showEmailIcon
              ? "pl-12 pr-4"
              : "px-4"
          }`}
        />
      </div>
    </div>
  );
};

export default FormInput;