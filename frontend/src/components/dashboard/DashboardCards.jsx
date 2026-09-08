import {
  MdPeople,
  MdMailOutline,
  MdPendingActions,
  MdCancel,
} from "react-icons/md";

import DashboardCard from "./DashboardCard";

const DashboardCards = ({
  stats,
  onActiveUsersClick,
  onInvitationsClick,
  onPendingApprovalsClick,
  onRejectedRequestsClick,
}) => {
  return (
    <div
      className="
        grid
        grid-cols-1
        gap-6
        md:grid-cols-2
        xl:grid-cols-4
      "
    >
      <DashboardCard
        title="Invitations Sent"
        value={stats?.invitationsSent ?? 0}
        subtitle="Waiting for registration"
        icon={<MdMailOutline />}
        color="blue"
        onClick={onInvitationsClick}
      />

      <DashboardCard
        title="Active Users"
        value={stats?.activeUsers ?? 0}
        subtitle="Currently working users under your enterprise"
        icon={<MdPeople />}
        color="green"
        onClick={onActiveUsersClick}
      />

      <DashboardCard
        title="Pending Users"
        value={stats?.pendingApprovals ?? 0}
        subtitle="Waiting for a review and action"
        icon={<MdPendingActions />}
        color="yellow"
        onClick={onPendingApprovalsClick}
      />

      <DashboardCard
        title="Rejected Users"
        value={stats?.rejectedRequests ?? 0}
        subtitle="Rejected user requests"
        icon={<MdCancel />}
        color="red"
        onClick={onRejectedRequestsClick}
      />
    </div>
  );
};

export default DashboardCards;