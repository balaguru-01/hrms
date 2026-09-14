import PrimaryButton from "../buttons/PrimaryButton";
import SecondaryButton from "../buttons/SecondaryButton";

const FormButton = ({
  children,
  type = "submit",
  variant = "primary",
  loading = false,
  disabled = false,
  fullWidth = true,
  onClick,
  className = "",
}) => {
  const ButtonComponent =
    variant === "secondary"
      ? SecondaryButton
      : PrimaryButton;

  return (
    <ButtonComponent
      type={type}
      loading={loading}
      disabled={disabled}
      fullWidth={fullWidth}
      onClick={onClick}
      className={className}
    >
      {children}
    </ButtonComponent>
  );
};

export default FormButton;