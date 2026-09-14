import {
  MdBlock,
  MdCheck,
  MdDelete,
} from "react-icons/md";

export const USER_STATUS = {
  ALL: "all",
  ACTIVE: "active",
  PENDING: "pending",
  REJECTED: "rejected",
};

export const API_STATUS = {
  ACTIVE: "Active",
  PENDING: "Pending",
  REJECTED: "Rejected",
};

export const DEFAULT_PAGE_SIZE = 10;

export const PAGE_SIZE_OPTIONS = [
  10,
  20,
  30,
  50,
];

export const USER_STATUS_TABS = [
  {
    key: USER_STATUS.ALL,
    label: "All Users",
  },
  {
    key: USER_STATUS.ACTIVE,
    label: "Active Users",
  },
  {
    key: USER_STATUS.PENDING,
    label: "Pending Users",
  },
  {
    key: USER_STATUS.REJECTED,
    label: "Rejected Users",
  },
];

export const USER_STATUS_CONFIG = {
  pending: {
    className:
      "bg-yellow-50 text-yellow-700",
  },

  active: {
    className:
      "bg-green-50 text-green-700",
  },

  rejected: {
    className:
      "bg-red-50 text-red-700",
  },

  inactive: {
    className:
      "bg-gray-100 text-gray-600",
  },

  default: {
    className:
      "bg-gray-100 text-gray-600",
  },
};

export const USER_ACTIONS_CONFIG = {
  pending: [
    {
      type: "approve",
      label: "Approve User",
    },
    {
      type: "reject",
      label: "Reject User",
    },
  ],

  active: [
    {
      type: "remove",
      label: "Remove User",
    },
    {
      type: "inactive",
      label: "Make Inactive",
    },
  ],

  rejected: [],

  inactive: [],
};

export const CONFIRMATION_CONFIG = {
  approve: {
    title: "Approve User",
    description: (user) =>
      `Are you sure you want to approve ${user.firstName} ${user.lastName}?`,
    confirmLabel: "Approve",
    icon: <MdCheck />,
    iconClassName: "text-green-600",
    confirmClassName:
      "bg-green-600 hover:bg-green-700",
  },

  reject: {
    title: "Reject User",
    description: (user) =>
      `Are you sure you want to reject ${user.firstName} ${user.lastName}?`,
    confirmLabel: "Reject",
    icon: <MdDelete />,
    iconClassName: "text-red-600",
    confirmClassName:
      "bg-red-600 hover:bg-red-700",
  },

  remove: {
    title: "Remove User",
    description: (user) =>
      `Are you sure you want to remove ${user.firstName} ${user.lastName}?`,
    confirmLabel: "Remove",
    icon: <MdDelete />,
    iconClassName: "text-red-600",
    confirmClassName:
      "bg-red-600 hover:bg-red-700",
  },

  inactive: {
    title: "Make User Inactive",
    description: (user) =>
      `Are you sure you want to make ${user.firstName} ${user.lastName} inactive?`,
    confirmLabel: "Make Inactive",
    icon: <MdBlock />,
    iconClassName: "text-yellow-600",
    confirmClassName:
      "bg-yellow-500 hover:bg-yellow-600",
  },
};

export const USER_DETAIL_FIELDS = [
  {
    key: "email",
    label: "Email",
    breakAll: true,
  },

  {
    key: "role",
    label: "Role",
  },

  {
    key: "designation",
    label: "Designation",
  },

  {
    key: "phone",
    label: "Phone",
  },

  {
    key: "location",
    label: "Location",
  },

  {
    key: "status",
    label: "Status",
    capitalize: true,
  },

  {
    key: "joinedAt",
    label: "Joined At",
    type: "date",
    show: (user) =>
      Boolean(user.joinedAt),
  },

  {
    key: "registeredAt",
    label: "Registered At",
    type: "date",
    show: (user) =>
      Boolean(user.registeredAt),
  },

  {
    key: "rejectionReason",
    label: "Reason for Rejection",
    fullWidth: true,
    show: (user) =>
      Boolean(user.rejectionReason),
  },
];