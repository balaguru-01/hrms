import DashboardCard from "./DashboardCard";

import {
  enterpriseDashboardCards,
} from "../../config/EnterpriseAdmin/EpAdminDashboardConfig";

const DashboardCards = ({
  stats,
  onActiveUsersClick,
  onInvitationsClick,
  onPendingApprovalsClick,
  onRejectedRequestsClick,
}) => {
  const cardActions = {
    invitationsSent:
      onInvitationsClick,

    activeUsers:
      onActiveUsersClick,

    pendingApprovals:
      onPendingApprovalsClick,

    rejectedRequests:
      onRejectedRequestsClick,
  };

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
      {enterpriseDashboardCards.map(
        (card) => {
          const Icon = card.icon;

          return (
            <DashboardCard
              key={card.key}
              title={card.title}
              value={
                stats?.[card.key] ?? 0
              }
              subtitle={card.subtitle}
              icon={<Icon />}
              color={card.color}
              onClick={
                cardActions[card.key]
              }
            />
          );
        }
      )}
    </div>
  );
};

export default DashboardCards;