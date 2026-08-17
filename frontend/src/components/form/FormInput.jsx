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
    autoComplete = "off",
  } = field;

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

      <input
        id={name}
        type={type}
        name={name}
        placeholder={placeholder}
        autoComplete={autoComplete}
        disabled={disabled}
        {...registration}
        className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition-all duration-200 focus:border-green-600 focus:ring-2 focus:ring-green-100 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
      />
    </div>
  );
};

export default FormInput;