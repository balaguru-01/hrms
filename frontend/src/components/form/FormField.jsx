import FormInput from "./FormInput";
import FormPassword from "./FormPassword";

const FormField = ({
  field,
  registration,
  control,
  formLoading,
}) => {
  if (field.type === "password") {
    return (
      <FormPassword
        field={field}
        registration={registration}
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