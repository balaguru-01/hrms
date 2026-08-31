export const userRegistrationFields = [
  {
    name: "email",
    type: "email",
    label: "Email Address",
    placeholder: "Email from invitation",
    autoComplete: "email",
    disabled: true,
    required: true,
    fullWidth: true,
  },

  {
    name: "firstName",
    type: "text",
    label: "First Name",
    placeholder: "Enter first name",
    autoComplete: "given-name",
    required: true,
  },

  {
    name: "lastName",
    type: "text",
    label: "Last Name",
    placeholder: "Enter last name",
    autoComplete: "family-name",
    required: true,
  },

  {
    name: "password",
    type: "password",
    label: "Password",
    placeholder: "Create a password",
    autoComplete: "new-password",
    required: true,
  },

  {
    name: "confirmPassword",
    type: "password",
    label: "Confirm Password",
    placeholder: "Re-enter your password",
    autoComplete: "new-password",
    required: true,
  },

  {
    name: "phone",
    type: "tel",
    label: "Phone Number",
    placeholder: "Enter phone number",
    autoComplete: "tel",
    required: true,
  },

  {
    name: "location",
    type: "text",
    label: "Location",
    placeholder: "Enter location",
    autoComplete: "address-level2",
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