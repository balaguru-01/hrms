import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import FormField from "./FormField";
import FormButton from "./FormButton";

const DynamicForm = ({
  fields = [],
  schema,
  defaultValues = {},
  onSubmit,
  onValidationError,
  submitText = "Submit",
  loadingText = "Submitting...",
  loading = false,
  className = "",
  mode = "onSubmit",

  forgotPassword = false,
  forgotPasswordText = "Forgot password?",
  onForgotPassword,
}) => {
  const {
    control,
    register,
    handleSubmit,
    formState: {
      isSubmitting,
    },
  } = useForm({
    resolver: schema
      ? zodResolver(schema)
      : undefined,

    defaultValues,

    mode,

    reValidateMode: "onChange",

    shouldFocusError: false,
  });

  /*
   * Watch all fields so the submit button can be
   * enabled/disabled without triggering validation.
   */
  const fieldValues = useWatch({
    control,
  });

  const isFormFilled = fields
    .filter(
      (field) => field.required !== false
    )
    .every((field) => {
      const value =
        fieldValues?.[field.name];

      return (
        value !== undefined &&
        value !== null &&
        String(value).trim() !== ""
      );
    });

  const isFormLoading =
    loading || isSubmitting;

  const isSubmitDisabled =
    !isFormFilled ||
    isFormLoading;

  const handleValidSubmit = async (
    data
  ) => {
    try {
      await onSubmit?.(data);
    } catch (error) {
      console.error(
        "Form submission failed:",
        error
      );
    }
  };

  const handleInvalidSubmit = (
    validationErrors
  ) => {
    onValidationError?.(
      validationErrors
    );
  };

  const handleForgotPassword = () => {
    if (isFormLoading) {
      return;
    }

    onForgotPassword?.();
  };

  return (
    <form
      onSubmit={handleSubmit(
        handleValidSubmit,
        handleInvalidSubmit
      )}
    //   noValidate
      autoComplete="off"
      className={`dynamic-form ${className}`}
    >
      <div className="space-y-4">
        {fields.map((field) => (
          <FormField
            key={field.name}
            field={field}
            registration={register(
              field.name
            )}
          />
        ))}

        {forgotPassword && (
          <div className="flex items-center justify-end text-sm">
            <button
              type="button"
              onClick={
                handleForgotPassword
              }
              disabled={isFormLoading}
              className="text-green-700 transition hover:underline disabled:cursor-not-allowed disabled:opacity-50"
            >
              {forgotPasswordText}
            </button>
          </div>
        )}

        <FormButton
          type="submit"
          loading={isFormLoading}
          disabled={isSubmitDisabled}
          fullWidth
        >
          {isFormLoading
            ? loadingText
            : submitText}
        </FormButton>
      </div>
    </form>
  );
};

export default DynamicForm;