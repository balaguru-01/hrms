import {
  useForm,
  useWatch,
} from "react-hook-form";
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

  disableSubmitUntilFilled = true,
  twoColumnLayout = false,

  submitButtonFullWidth = true,
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
    (disableSubmitUntilFilled &&
      !isFormFilled) ||
    isFormLoading;

  const hasOddNumberOfFields =
    fields.length % 2 !== 0;

  const handleValidSubmit = async (
    data
  ) => {
    try {
      await onSubmit?.(data);
    } catch {
      return;
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
      autoComplete="off"
      className={`dynamic-form ${className}`}
    >
      <div
        className={
          twoColumnLayout
            ? "grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2"
            : "space-y-4"
        }
      >
        {fields.map((field, index) => (
          <div
            key={field.name}
            className={
              twoColumnLayout &&
              hasOddNumberOfFields &&
              index === 0
                ? "sm:col-span-2"
                : ""
            }
          >
            <FormField
              field={field}
              registration={register(
                field.name
              )}
              control={control}
              formLoading={isFormLoading}
            />
          </div>
        ))}
      </div>

      {forgotPassword && (
        <div className="mt-4 flex items-center justify-end text-sm">
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

      <div className="mt-6 flex justify-center">
        <FormButton
          type="submit"
          loading={isFormLoading}
          disabled={isSubmitDisabled}
          fullWidth={
            submitButtonFullWidth
          }
          className={
            submitButtonFullWidth
              ? ""
              : "w-fit px-8 py-2.5 text-sm"
          }
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