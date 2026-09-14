export const enterpriseLoginFields = [
  {
    name: "email",
    type: "email",
    label: "Email Address",
    placeholder: "Enter your email",
    autoComplete: "off",
    required: true,
  },

  {
    name: "password",
    type: "password",
    label: "Password",
    placeholder: "Enter your password",
    autoComplete: "new-password",
    required: true,
  },
];

export const enterpriseLoginDefaultValues = {
  email: "",
  password: "",
};