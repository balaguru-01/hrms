import {
  MdPeople,
  MdMailOutline,
  MdPendingActions,
  MdCancel,
} from "react-icons/md";

export const enterpriseDashboardCards = [
  {
    key: "invitationsSent",
    title: "Invitations Sent",
    subtitle: "Waiting for registration",
    icon: MdMailOutline,
    color: "blue",
  },

  {
    key: "activeUsers",
    title: "Active Users",
    subtitle:
      "Currently working users under your enterprise",
    icon: MdPeople,
    color: "green",
  },

  {
    key: "pendingApprovals",
    title: "Pending Users",
    subtitle: "Waiting for a review and action",
    icon: MdPendingActions,
    color: "yellow",
  },

  {
    key: "rejectedRequests",
    title: "Rejected Users",
    subtitle: "Rejected user requests",
    icon: MdCancel,
    color: "red",
  },
];

export const enterpriseDashboardRecentActivities = [
  {
    title: "New User Registered",
    description:
      "A new user completed registration.",
    time: "5 mins ago",
  },

  {
    title: "Invitation Accepted",
    description:
      "An invited user completed registration.",
    time: "30 mins ago",
  },

  {
    title: "User Approval Pending",
    description:
      "A registration request is waiting for approval.",
    time: "Today",
  },
];