export const enterpriseLoginFields = [
  {
    name: "email",
    type: "email",
    label: "Email Address",
    placeholder: "Enter your email",
    autoComplete: "username",
    required: true,
  },

  {
    name: "password",
    type: "password",
    label: "Password",
    placeholder: "Enter your password",
    autoComplete: "current-password",
    required: true,
  },
];

export const enterpriseLoginDefaultValues = {
  email: "",
  password: "",
};