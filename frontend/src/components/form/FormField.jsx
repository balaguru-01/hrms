import FormInput from "./FormInput";
import FormPassword from "./FormPassword";

const FormField = ({
  field,
  registration,
}) => {
  if (field.type === "password") {
    return (
      <FormPassword
        field={field}
        registration={registration}
      />
    );
  }

  return (
    <FormInput
      field={field}
      registration={registration}
    />
  );
};

export default FormField;