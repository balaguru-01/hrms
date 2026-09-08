import { useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";
import UserList from "../../components/enterprise-user/UserList";
import UserDetailsModal from "../../components/enterprise-user/UserDetailsModal";

import { useEnterpriseUsers } from "../../context/EnterpriseUserContext";
import { useToast } from "../../context/ToastContext";

const EnterpriseUserPendingApprovals = () => {
  const navigate = useNavigate();

  const { showToast } = useToast();

  const {
    pendingApprovals,
    approveUser,
    rejectUser,
  } = useEnterpriseUsers();

  const [
    selectedUser,
    setSelectedUser,
  ] = useState(null);

  const handleViewUser = (user) => {
    setSelectedUser(user);
  };

  const handleApprove = (
    user = selectedUser
  ) => {
    if (!user) {
      return;
    }

    approveUser(user.id);

    setSelectedUser(null);

    showToast({
      message:
        "The user has been approved successfully.",
      type: "success",
      title: "User Approved",
    });
  };

  const handleReject = (
    user = selectedUser
  ) => {
    if (!user) {
      return;
    }

    rejectUser(
      user.id,
      "Registration request was rejected by the Enterprise Admin."
    );

    setSelectedUser(null);

    showToast({
      message:
        "The registration request has been rejected.",
      type: "success",
      title: "Request Rejected",
    });
  };

  return (
    <DashboardLayout
      title="Pending Approvals"
      subtitle="Review users who have completed registration and are waiting for enterprise approval."
    >
      <div className="space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              User Approval Requests
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {pendingApprovals.length} pending request
              {pendingApprovals.length !== 1
                ? "s"
                : ""}
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="self-start rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Back
          </button>
        </div>

        <UserList
          users={pendingApprovals}
          onUserClick={handleViewUser}
          actions={[
            {
              type: "view",
              label: "View",
              onClick: handleViewUser,
            },
            {
              type: "approve",
              label: "Approve",
              onClick: handleApprove,
            },
            {
              type: "reject",
              label: "Reject",
              onClick: handleReject,
            },
          ]}
          emptyTitle="No Pending Approvals"
          emptyDescription="There are no user registration requests waiting for approval."
        />
      </div>

      <UserDetailsModal
        open={Boolean(selectedUser)}
        user={selectedUser}
        onClose={() => setSelectedUser(null)}
        actions={[
          {
            label: "Reject",
            variant: "danger",
            onClick: () =>
              handleReject(selectedUser),
          },
          {
            label: "Approve",
            variant: "success",
            onClick: () =>
              handleApprove(selectedUser),
          },
        ]}
      />
    </DashboardLayout>
  );
};

export default EnterpriseUserPendingApprovals;