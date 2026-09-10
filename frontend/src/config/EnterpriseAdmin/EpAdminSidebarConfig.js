import {
  MdAccessTime,
  MdApartment,
  MdAssignment,
  MdAssessment,
  MdBusiness,
  MdDashboard,
  MdNotifications,
  MdPendingActions,
  MdPeople,
  MdPerson,
  MdSettings,
} from "react-icons/md";

import { ROUTES } from "../../utils/constants/routes";

export const enterpriseMenuItems = [
  {
    title: "Dashboard",
    icon: MdDashboard,
    path: ROUTES.ENTERPRISE_DASHBOARD,
  },

  {
    title: "Tenant Management",
    icon: MdBusiness,
    path: ROUTES.ENTERPRISE_TENANT_MANAGEMENT,
  },

  {
    title: "Pending Approvals",
    icon: MdPendingActions,
    path: ROUTES.ENTERPRISE_USER_PENDING_APPROVALS,
  },

  {
    title: "Users",
    icon: MdPeople,
    path: ROUTES.ENTERPRISE_USERS,
  },

  {
    title: "Departments",
    icon: MdApartment,
    path: "/enterprise/departments",
  },

  {
    title: "Attendance",
    icon: MdAccessTime,
    path: "/enterprise/attendance",
  },

  {
    title: "Tasks",
    icon: MdAssignment,
    path: "/enterprise/tasks",
  },

  {
    title: "Reports",
    icon: MdAssessment,
    path: "/enterprise/reports",
  },

  {
    title: "Notifications",
    icon: MdNotifications,
    path: "/enterprise/notifications",
  },

  {
    title: "Settings",
    icon: MdSettings,
    path: "/enterprise/settings",
  },

  {
    title: "Profile",
    icon: MdPerson,
    path: ROUTES.ENTERPRISE_PROFILE,
  },
];