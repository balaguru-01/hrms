import { useMemo, useState } from "react";

import {
  MdCancel,
} from "react-icons/md";

import { FaPaperPlane } from "react-icons/fa";

import DashboardLayout from "../../components/layout/DashboardLayout";

import DynamicTable from "../../components/tables/DynamicTable";
import DynamicPagination from "../../components/tables/DynamicPagination";
import DynamicTableActions from "../../components/tables/DynamicTableActions";
import DynamicDetailsModal from "../../components/Modals/DynamicDetailsModal";
import DynamicConfirmationModal from "../../components/Modals/DynamicConfirmationModal";

import { useEnterpriseUsers } from "../../context/EnterpriseUserContext";
import { useToast } from "../../context/ToastContext";

import {
  enterpriseMenuItems,
} from "../../config/EnterpriseAdmin/EpAdminSidebarConfig";

const PAGE_SIZE_OPTIONS = [10, 20, 30, 50];

const CONFIRMATION_CONFIG = {
  cancel: {
    icon: <MdCancel />,
    iconClassName: "text-red-600",
    confirmClassName:
      "bg-red-600 hover:bg-red-700",
  },

  resend: {
    icon: <FaPaperPlane />,
    iconClassName: "text-green-600",
    confirmClassName:
      "bg-green-600 hover:bg-green-700",
  },
};

const InvitationsSent = () => {
  const {
    sentInvitations,
    sentInvitationsPagination,
    fetchSentInvitations,
    cancelInvitation: cancelInvitationFromContext,
  } = useEnterpriseUsers();

  const { showToast } = useToast();

  const [selectedInvitation, setSelectedInvitation] =
    useState(null);

  const [
    cancelInvitationTarget,
    setCancelInvitationTarget,
  ] = useState(null);

  const [
    resendInvitationTarget,
    setResendInvitationTarget,
  ] = useState(null);

  const [cancelOpen, setCancelOpen] =
    useState(false);

  const [resendOpen, setResendOpen] =
    useState(false);

  const invitations = useMemo(() => {
    return (sentInvitations || []).map(
      (invitation) => {
        const isExpired =
          !invitation.invitationExpiresAt ||
          new Date(
            invitation.invitationExpiresAt
          ) <= new Date();

        let invitedAt = "—";

        if (
          invitation.invitationSentAt
        ) {
          const date = new Date(
            invitation.invitationSentAt
          );

          const day = String(
            date.getDate()
          ).padStart(2, "0");

          const month = String(
            date.getMonth() + 1
          ).padStart(2, "0");

          const year =
            date.getFullYear();

          invitedAt = `${day}/${month}/${year}`;
        }

        return {
          ...invitation,
          id: invitation.invitationId,
          invitedAt,
          isExpired,
        };
      }
    );
  }, [sentInvitations]);

  const handlePageChange = (page) => {
    if (
      page < 1 ||
      page >
        sentInvitationsPagination.totalPages ||
      page ===
        sentInvitationsPagination.currentPage
    ) {
      return;
    }

    fetchSentInvitations(
      page,
      sentInvitationsPagination.pageSize
    );
  };

  const handlePageSizeChange = (
    newPageSize
  ) => {
    if (
      !PAGE_SIZE_OPTIONS.includes(
        newPageSize
      ) ||
      newPageSize ===
        sentInvitationsPagination.pageSize
    ) {
      return;
    }

    fetchSentInvitations(
      1,
      newPageSize
    );
  };

  const handleViewInvitation = (
    invitation
  ) => {
    setSelectedInvitation(
      invitation
    );
  };

  const handleResendInvitation = (
    invitation
  ) => {
    setResendInvitationTarget(
      invitation
    );

    setResendOpen(true);
  };

  const handleCancelInvitation = (
    invitation
  ) => {
    setCancelInvitationTarget(
      invitation
    );

    setCancelOpen(true);
  };

  const handleConfirmCancelInvitation =
    async () => {
      if (!cancelInvitationTarget) {
        return;
      }

      try {
        const cancelledInvitationId =
          cancelInvitationTarget.id;

        if (
          typeof cancelInvitationFromContext ===
          "function"
        ) {
          cancelInvitationFromContext(
            cancelledInvitationId
          );
        }

        showToast(
          "Invitation cancelled successfully.",
          "success"
        );

        setCancelOpen(false);
        setCancelInvitationTarget(
          null
        );
      } catch (error) {
        console.error(
          "Unable to cancel invitation:",
          error
        );

        showToast(
          "Unable to cancel invitation.",
          "error"
        );
      }
    };

  const handleConfirmResendInvitation =
    async () => {
      if (!resendInvitationTarget) {
        return;
      }

      try {
        showToast(
          "Invitation resend will be processed.",
          "success"
        );

        setResendOpen(false);
        setResendInvitationTarget(
          null
        );

        await fetchSentInvitations(
          sentInvitationsPagination.currentPage,
          sentInvitationsPagination.pageSize
        );
      } catch (error) {
        console.error(
          "Unable to resend invitation:",
          error
        );

        showToast(
          "Unable to resend invitation.",
          "error"
        );
      }
    };

  const handleCloseCancelModal = () => {
    setCancelOpen(false);
    setCancelInvitationTarget(
      null
    );
  };

  const handleCloseResendModal = () => {
    setResendOpen(false);
    setResendInvitationTarget(
      null
    );
  };

  const columns = useMemo(
    () => [
      {
        key: "email",
        header: "Email",
        width: "24%",
        accessor: "email",
        cellClassName:
          "text-gray-600",
      },

      {
        key: "role",
        header: "Role",
        width: "17%",
        accessor: (invitation) =>
          invitation?.roleName ||
          invitation?.role ||
          "—",
        cellClassName:
          "text-gray-600",
      },

      {
        key: "designation",
        header: "Designation",
        width: "18%",
        accessor: (invitation) =>
          invitation?.designation ||
          invitation?.invitedDesignation ||
          "—",
        cellClassName:
          "text-gray-600",
      },

      {
        key: "invitedAt",
        header: "Invited At",
        width: "17%",
        accessor: "invitedAt",
        cellClassName:
          "text-gray-600",
      },

      {
        key: "status",
        header: "Status",
        width: "14%",
        headerClassName:
          "text-center",
        cellClassName:
          "text-center",
        stopRowClick: true,

        render: (invitation) => (
          <span
            className={`
              inline-flex
              rounded-full
              px-3
              py-1
              text-xs
              font-medium
              ${
                invitation?.isExpired
                  ? "bg-red-100 text-red-700"
                  : "bg-green-100 text-green-700"
              }
            `}
          >
            {invitation?.isExpired
              ? "Expired"
              : "Active"}
          </span>
        ),
      },

      {
        key: "actions",
        header: "Quick Actions",
        width: "150px",
        headerClassName:
          "text-center",
        cellClassName:
          "text-center",
        stopRowClick: true,

        render: (invitation) => (
          <DynamicTableActions
            row={invitation}
            actions={[
              {
                type: "resend",
                label: "Resend Invitation",
                icon: FaPaperPlane,
                className:
                  "text-green-600 hover:bg-green-50",
                onClick:
                  handleResendInvitation,
              },
              {
                type: "cancel",
                label: "Cancel Invitation",
                icon: MdCancel,
                className:
                  "text-red-600 hover:bg-red-50",
                onClick:
                  handleCancelInvitation,
              },
            ]}
            buttonLabel={`Quick actions for ${
              invitation?.email ||
              "invitation"
            }`}
          />
        ),
      },
    ],
    []
  );

  const invitationDetailFields = [
    {
      key: "email",
      label: "Email",
      breakAll: true,
    },

    {
      key: "roleName",
      label: "Role",
      getValue: (invitation) =>
        invitation?.roleName ||
        invitation?.role ||
        "—",
    },

    {
      key: "designation",
      label: "Designation",
      getValue: (invitation) =>
        invitation?.designation ||
        invitation?.invitedDesignation ||
        "—",
    },

    {
      key: "invitedAt",
      label: "Invited At",
    },

    {
      key: "invitationSentAt",
      label: "Invitation Sent At",
      type: "date",
      show: (invitation) =>
        Boolean(
          invitation?.invitationSentAt
        ),
    },

    {
      key: "invitationExpiresAt",
      label: "Invitation Expires At",
      type: "date",
      show: (invitation) =>
        Boolean(
          invitation?.invitationExpiresAt
        ),
    },

    {
      key: "status",
      label: "Status",
      getValue: (invitation) =>
        invitation?.isExpired
          ? "Expired"
          : "Active",
      capitalize: true,
    },
  ];

  const currentPage =
    sentInvitationsPagination
      ?.currentPage || 1;

  const totalPages =
    sentInvitationsPagination
      ?.totalPages || 1;

  const totalInvitations =
    sentInvitationsPagination
      ?.totalInvitations || 0;

  const pageSize =
    sentInvitationsPagination
      ?.pageSize || 10;

  return (
    <DashboardLayout
      title="Invitations Sent"
      subtitle="View and manage invitations sent to users."
      menuItems={enterpriseMenuItems}
      profilePath="/enterprise/profile"
    >
      <div className="space-y-6">
        {/* Table */}
        <DynamicTable
          columns={columns}
          data={invitations}
          rowKey="id"
          minWidth="950px"
          className="overflow-visible"
          emptyTitle="No invitations sent"
          emptyDescription="Invitations you send will appear here."
          emptyIcon={FaPaperPlane}
          onRowClick={
            handleViewInvitation
          }
        />

        {/* Pagination */}
        <DynamicPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalInvitations}
          pageSize={pageSize}
          pageSizeOptions={
            PAGE_SIZE_OPTIONS
          }
          onPageChange={handlePageChange}
          onPageSizeChange={
            handlePageSizeChange
          }
          itemLabel="users"
        />
      </div>

      {/* Invitation Details Modal */}
      <DynamicDetailsModal
        open={Boolean(
          selectedInvitation
        )}
        title="Invitation Details"
        subtitle="View invitation information"
        data={selectedInvitation}
        fields={invitationDetailFields}
        onClose={() =>
          setSelectedInvitation(
            null
          )
        }
      />

      {/* Cancel Invitation Confirmation */}
      <DynamicConfirmationModal
        open={cancelOpen}
        onCancel={
          handleCloseCancelModal
        }
        onConfirm={
          handleConfirmCancelInvitation
        }
        title="Cancel Invitation"
        description={
          cancelInvitationTarget
            ? `Are you sure you want to cancel the invitation sent to ${cancelInvitationTarget.email}?`
            : "Are you sure you want to cancel this invitation?"
        }
        confirmLabel="Cancel Invitation"
        cancelLabel="Keep Invitation"
        icon={
          CONFIRMATION_CONFIG.cancel.icon
        }
        iconClassName={
          CONFIRMATION_CONFIG.cancel.iconClassName
        }
        confirmClassName={
          CONFIRMATION_CONFIG.cancel.confirmClassName
        }
      />

      {/* Resend Invitation Confirmation */}
      <DynamicConfirmationModal
        open={resendOpen}
        onCancel={
          handleCloseResendModal
        }
        onConfirm={
          handleConfirmResendInvitation
        }
        title="Resend Invitation"
        description={
          resendInvitationTarget
            ? `Are you sure you want to resend the invitation to ${resendInvitationTarget.email}?`
            : "Are you sure you want to resend this invitation?"
        }
        confirmLabel="Resend Invitation"
        cancelLabel="Cancel"
        icon={
          CONFIRMATION_CONFIG.resend.icon
        }
        iconClassName={
          CONFIRMATION_CONFIG.resend.iconClassName
        }
        confirmClassName={
          CONFIRMATION_CONFIG.resend.confirmClassName
        }
      />
    </DashboardLayout>
  );
};

export default InvitationsSent;