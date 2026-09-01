export const userRegistrationFields = [
  {
    name: "email",
    type: "email",
    label: "Email Address",
    placeholder: "Email from invitation",
    disabled: true,
    required: true,
    fullWidth: true,
  },
  {
    name: "firstName",
    type: "text",
    label: "First Name",
    placeholder: "Enter first name",
    required: true,
  },
  {
    name: "lastName",
    type: "text",
    label: "Last Name",
    placeholder: "Enter last name",
    required: true,
  },
  {
    name: "password",
    type: "password",
    label: "Password",
    placeholder: "Create a password",
    required: true,
  },
  {
    name: "confirmPassword",
    type: "password",
    label: "Confirm Password",
    placeholder: "Re-enter your password",
    required: true,
  },
  {
    name: "phone",
    type: "tel",
    label: "Phone Number",
    placeholder: "Enter phone number",
    required: true,
  },
  {
    name: "location",
    type: "text",
    label: "Location",
    placeholder: "Enter location",
    required: true,
  },
];

export const userRegistrationDefaultValues = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
  phone: "",
  location: "",
};