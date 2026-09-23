import FormInput from "./FormInput";
import FormPassword from "./FormPassword";

const FormField = ({
  field,
  registration,
  control,
  formLoading,
  error,
}) => {
  if (field.type === "password") {
    return (
      <FormPassword
        field={field}
        registration={registration}
        error={error}
        formLoading={formLoading}
      />
    );
  }

  if (field.type === "custom") {
    const CustomComponent =
      field.component;

    if (!CustomComponent) {
      return null;
    }

    return (
      <CustomComponent
        field={field}
        registration={registration}
        control={control}
        formLoading={formLoading}
        error={error}
      />
    );
  }

  return (
    <FormInput
      field={field}
      registration={registration}
      error={error}
      formLoading={formLoading}
    />
  );
};

export default FormField;