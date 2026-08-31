export const inviteUserFields = [
  {
    name: "email",
    type: "email",
    label: "Email Address",
    placeholder: "john.doe@example.com",
    autoComplete: "off",
    required: true,
  },
  {
    name: "designation",
    type: "text",
    label: "Designation",
    placeholder: "e.g. Operations Manager",
    autoComplete: "off",
    required: true,
  },
];

export const inviteUserDefaultValues = {
  email: "",
  designation: "",
  roleId: "",
};