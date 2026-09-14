import { useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";
import DashboardCards from "../../components/dashboard/DashboardCards";
import PrimaryButton from "../../components/buttons/PrimaryButton";
import InviteUserForm from "../../components/enterprise-user/InviteUserForm";

import { MdPersonAdd } from "react-icons/md";

import { sendUserInvitation } from "../../api/enterpriseUserApi";

import { useToast } from "../../context/ToastContext";
import { useEnterpriseUsers } from "../../context/EnterpriseUserContext";

import { ROUTES } from "../../utils/constants/routes";

import {
  enterpriseDashboardRecentActivities,
} from "../../config/EnterpriseAdmin/EpAdminDashboardConfig";

import {
  enterpriseMenuItems,
} from "../../config/EnterpriseAdmin/EpAdminSidebarConfig";

const EnterpriseDashboard = () => {
  const navigate = useNavigate();

  const { showToast } = useToast();

  const {
    stats,
    addInvitation,
    refreshDashboardStats,
  } = useEnterpriseUsers();

  const [
    isInviteFormOpen,
    setIsInviteFormOpen,
  ] = useState(false);

  const handleAddAdminUser = () => {
    setIsInviteFormOpen(
      (previous) => !previous
    );
  };

  const handleInviteCancel = () => {
    setIsInviteFormOpen(false);
  };

  const handleInviteSubmit = async (
    formData
  ) => {
    try {
      const response =
        await sendUserInvitation({
          email: formData.email.trim(),
          roleId: formData.roleId,
          invitedDesignation:
            formData.designation.trim(),
        });

      if (!response?.success) {
        showToast({
          message:
            response?.message ||
            "Unable to send the user invitation.",
          type: "error",
        });

        return;
      }

      addInvitation({
        email: formData.email.trim(),
        role:
          formData.roleName ||
          formData.role ||
          "User",
        designation:
          formData.designation.trim(),
      });

      await refreshDashboardStats();

      setIsInviteFormOpen(false);

      showToast({
        message:
          response?.message ||
          "User invitation sent successfully.",
        type: "success",
        title: "Invitation Sent",
        duration: 5000,
      });
    } catch (error) {
      const backendMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error;

      showToast({
        message:
          backendMessage ||
          "Unable to send the user invitation. Please try again.",
        type: "error",
      });
    }
  };

  return (
    <DashboardLayout
      title="Enterprise Dashboard"
      subtitle="Welcome back ! Here's an overview of your TenantHub platform."
      menuItems={enterpriseMenuItems}
      profilePath="/enterprise/profile"
    >
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
        <h2 className="text-xl font-semibold text-gray-900">
          Manage Admins &amp; Users
        </h2>

        <div className="mt-5">
          <DashboardCards
            stats={stats}
            onActiveUsersClick={() =>
              navigate(
                `${ROUTES.ENTERPRISE_USERS}?status=active`
              )
            }
            onInvitationsClick={() =>
              navigate(
                ROUTES.ENTERPRISE_INVITATIONS
              )
            }
            onPendingApprovalsClick={() =>
              navigate(
                `${ROUTES.ENTERPRISE_USERS}?status=pending`
              )
            }
            onRejectedRequestsClick={() =>
              navigate(
                `${ROUTES.ENTERPRISE_USERS}?status=rejected`
              )
            }
          />
        </div>

        <div className="mt-5 border-t border-gray-100 pt-4">
          <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="min-w-0 flex-1 text-sm font-semibold text-gray-900 sm:text-base">
              Invite administrators and users who will work under your enterprise.
            </p>

            <div className="w-full sm:w-auto sm:shrink-0">
              <div className="sm:w-48">
                <PrimaryButton
                  text="Invite User"
                  icon={<MdPersonAdd />}
                  onClick={handleAddAdminUser}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {isInviteFormOpen && (
        <InviteUserForm
          onCancel={handleInviteCancel}
          onSubmit={handleInviteSubmit}
        />
      )}

      <div className="mt-5 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
        <h2 className="text-xl font-semibold text-gray-900">
          Recent Activity
        </h2>

        <div className="mt-4 space-y-3">
          {enterpriseDashboardRecentActivities.map(
            (activity, index) => (
              <div key={activity.title}>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-800">
                      {activity.title}
                    </h3>

                    <p className="text-xs text-gray-500">
                      {activity.description}
                    </p>
                  </div>

                  <span className="shrink-0 text-xs text-gray-400">
                    {activity.time}
                  </span>
                </div>

                {index <
                  enterpriseDashboardRecentActivities.length -
                    1 && <hr />}
              </div>
            )
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EnterpriseDashboard;