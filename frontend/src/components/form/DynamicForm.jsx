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
  secondaryAction = null,
}) => {
  const {
    control,
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
      isValid,
    },
  } = useForm({
    resolver: schema
      ? zodResolver(schema)
      : undefined,
    defaultValues,
    mode,
    reValidateMode: "onChange",
    shouldFocusError: true,
  });

  const fieldValues = useWatch({
    control,
  });

  // ---------------------------------------
  // CHECK REQUIRED FIELDS
  // ---------------------------------------
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

  // ---------------------------------------
  // LOADING
  // ---------------------------------------
  const isFormLoading =
    loading || isSubmitting;

  // ---------------------------------------
  // SUBMIT BUTTON
  // ---------------------------------------
  const isSubmitDisabled =
    (disableSubmitUntilFilled &&
      (!isFormFilled || !isValid)) ||
    isFormLoading;

  // ---------------------------------------
  // VALID SUBMIT
  // ---------------------------------------
  const handleValidSubmit = async (
    data
  ) => {
    try {
      await onSubmit?.(data);
    } catch (error) {
      console.error(
        "Form submit error:",
        error
      );
    }
  };

  // ---------------------------------------
  // INVALID SUBMIT
  // ---------------------------------------
  const handleInvalidSubmit = (
    validationErrors
  ) => {
    console.log(
      "Validation errors:",
      validationErrors
    );

    onValidationError?.(
      validationErrors
    );
  };

  // ---------------------------------------
  // FORGOT PASSWORD
  // ---------------------------------------
  const handleForgotPassword = () => {
    if (isFormLoading) {
      return;
    }

    onForgotPassword?.();
  };

  const hasSecondaryAction =
    Boolean(secondaryAction);

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
        {fields.map((field) => {
          // ---------------------------------------
          // FIELD REGISTRATION
          // ---------------------------------------
          const fieldRegistration =
            register(field.name, {
              // Add validation rules
              ...field.rules,

              // Custom input handling
              onChange: (event) => {
                const input =
                  event.target;

                // FIRST NAME
                if (
                  field.name ===
                  "firstName"
                ) {
                  input.value =
                    input.value.replace(
                      /[^A-Za-z]/g,
                      ""
                    );
                }

                // LAST NAME
                if (
                  field.name ===
                  "lastName"
                ) {
                  input.value =
                    input.value.replace(
                      /[^A-Za-z]/g,
                      ""
                    );
                }

                // PHONE NUMBER
                if (
                  field.name ===
                  "phone"
                ) {
                  input.value =
                    input.value
                      .replace(
                        /\D/g,
                        ""
                      )
                      .slice(0, 10);
                }
              },
            });

          return (
            <div
              key={field.name}
              className={
                field.fullWidth
                  ? "sm:col-span-2"
                  : ""
              }
            >
              <FormField
                field={field}
                registration={
                  fieldRegistration
                }
                control={control}
                formLoading={
                  isFormLoading
                }
                error={
                  errors[field.name]
                    ?.message
                }
              />
            </div>
          );
        })}
      </div>

      {/* ---------------------------------------
          FORGOT PASSWORD
      --------------------------------------- */}
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

      {/* ---------------------------------------
          SUBMIT AREA
      --------------------------------------- */}
      <div
        className={
          hasSecondaryAction
            ? "mt-6 flex items-center justify-end gap-3"
            : "mt-6 flex justify-center"
        }
      >
        {secondaryAction}

        <FormButton
          type="submit"
          loading={isFormLoading}
          disabled={isSubmitDisabled}
          fullWidth={
            hasSecondaryAction
              ? false
              : submitButtonFullWidth
          }
          className={
            hasSecondaryAction
              ? "w-fit px-8 py-2.5 text-sm"
              : submitButtonFullWidth
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