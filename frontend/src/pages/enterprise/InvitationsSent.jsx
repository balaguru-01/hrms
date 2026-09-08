import { createPortal } from "react-dom";
import { useEffect, useRef, useState } from "react";

import {
  MdCancel,
  MdChevronLeft,
  MdChevronRight,
  MdMoreVert,
  MdSend,
} from "react-icons/md";

import DashboardLayout from "../../components/layout/DashboardLayout";
import InvitationDetailsModal from "../../components/enterprise-user/InvitationDetailsModal";
import ConfirmationModal from "../../components/common/ConfirmationModal";

import { useEnterpriseUsers } from "../../context/EnterpriseUserContext";
import { useToast } from "../../context/ToastContext";

const PAGE_SIZE_OPTIONS = [10, 20, 30, 50];

const InvitationsSent = () => {
  const {
    sentInvitations,
    sentInvitationsPagination,
    fetchSentInvitations,
  } = useEnterpriseUsers();

  const { showToast } = useToast();

  const [invitations, setInvitations] = useState([]);
  const [selectedInvitation, setSelectedInvitation] = useState(null);

  const [cancelInvitationTarget, setCancelInvitationTarget] =
    useState(null);

  const [resendInvitationTarget, setResendInvitationTarget] =
    useState(null);

  const [cancelOpen, setCancelOpen] = useState(false);
  const [resendOpen, setResendOpen] = useState(false);

  const [openMenuId, setOpenMenuId] = useState(null);

  const [menuPosition, setMenuPosition] = useState({
    top: 0,
    left: 0,
  });

  const menuRef = useRef(null);

  useEffect(() => {
    const formattedInvitations =
      (sentInvitations || []).map((invitation) => {
        const isExpired =
          !invitation.invitationExpiresAt ||
          new Date(invitation.invitationExpiresAt) <= new Date();

        let invitedAt = "—";

        if (invitation.invitationSentAt) {
          const date = new Date(invitation.invitationSentAt);

          const day = String(date.getDate()).padStart(2, "0");
          const month = String(date.getMonth() + 1).padStart(
            2,
            "0"
          );
          const year = date.getFullYear();

          invitedAt = `${day}/${month}/${year}`;
        }

        return {
          ...invitation,
          id: invitation.invitationId,
          invitedAt,
          isExpired,
        };
      });

    setInvitations(formattedInvitations);
  }, [sentInvitations]);

  const handlePageChange = (page) => {
    if (
      page < 1 ||
      page > sentInvitationsPagination.totalPages ||
      page === sentInvitationsPagination.currentPage
    ) {
      return;
    }

    fetchSentInvitations(
      page,
      sentInvitationsPagination.pageSize
    );
  };

  const handlePageSizeChange = (newPageSize) => {
    if (
      !PAGE_SIZE_OPTIONS.includes(newPageSize) ||
      newPageSize === sentInvitationsPagination.pageSize
    ) {
      return;
    }

    fetchSentInvitations(1, newPageSize);
  };

  const handleQuickActionMenu = (event, invitationId) => {
    if (openMenuId === invitationId) {
      setOpenMenuId(null);
      return;
    }

    const buttonRect =
      event.currentTarget.getBoundingClientRect();

    const menuWidth = 208;
    const menuHeight = 90;
    const spacing = 4;
    const viewportPadding = 8;

    let left = buttonRect.right - menuWidth;
    let top = buttonRect.bottom + spacing;

    if (
      left + menuWidth >
      window.innerWidth - viewportPadding
    ) {
      left =
        window.innerWidth -
        menuWidth -
        viewportPadding;
    }

    if (left < viewportPadding) {
      left = viewportPadding;
    }

    if (
      top + menuHeight >
      window.innerHeight - viewportPadding
    ) {
      top =
        buttonRect.top -
        menuHeight -
        spacing;
    }

    setMenuPosition({
      top,
      left,
    });

    setOpenMenuId(invitationId);
  };

  const handleResendInvitation = (invitation) => {
    setResendInvitationTarget(invitation);
    setOpenMenuId(null);
    setResendOpen(true);
  };

  const handleCancelInvitation = (invitation) => {
    setCancelInvitationTarget(invitation);
    setOpenMenuId(null);
    setCancelOpen(true);
  };

  const handleConfirmCancelInvitation = async () => {
    if (!cancelInvitationTarget) return;

    try {
      const cancelledInvitationId =
        cancelInvitationTarget.id;

      setInvitations((currentInvitations) =>
        currentInvitations.filter(
          (invitation) =>
            invitation.id !== cancelledInvitationId
        )
      );

      showToast(
        "Invitation cancelled successfully.",
        "success"
      );

      setCancelOpen(false);
      setCancelInvitationTarget(null);
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

  const handleConfirmResendInvitation = async () => {
    if (!resendInvitationTarget) return;

    try {
      /*
       * Resend invitation API call will be connected here.
       */

      showToast(
        "Invitation resend will be processed.",
        "success"
      );

      setResendOpen(false);
      setResendInvitationTarget(null);

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
    setCancelInvitationTarget(null);
  };

  const handleCloseResendModal = () => {
    setResendOpen(false);
    setResendInvitationTarget(null);
  };

  const currentPage =
    sentInvitationsPagination?.currentPage || 1;

  const totalPages =
    sentInvitationsPagination?.totalPages || 1;

  const totalInvitations =
    sentInvitationsPagination?.totalInvitations || 0;

  const pageSize =
    sentInvitationsPagination?.pageSize || 10;

  const startItem =
    totalInvitations === 0
      ? 0
      : (currentPage - 1) * pageSize + 1;

  const endItem =
    totalInvitations === 0
      ? 0
      : Math.min(
          currentPage * pageSize,
          totalInvitations
        );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Invitations Sent
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            View and manage invitations sent to users.
          </p>
        </div>

        {/* Table + Pagination */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px]">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  {/* Email */}
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Email
                  </th>

                  {/* Role */}
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    <div className="border-l border-gray-200 pl-5">
                      Role
                    </div>
                  </th>

                  {/* Designation */}
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    <div className="border-l border-gray-200 pl-5">
                      Designation
                    </div>
                  </th>

                  {/* Invited At */}
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    <div className="border-l border-gray-200 pl-5">
                      Invited At
                    </div>
                  </th>

                  {/* Status */}
                  <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">
                    <div className="relative flex items-center justify-center before:absolute before:left-0 before:h-5 before:border-l before:border-gray-200 pl-8">
                      Status
                    </div>
                  </th>

                  {/* Quick Action */}
                  <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">
                    <div className="flex items-center justify-center border-l border-gray-200">
                      Quick Action
                    </div>
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {invitations.length > 0 ? (
                  invitations.map((invitation) => (
                    <tr
                      key={invitation.id}
                      onClick={() =>
                        setSelectedInvitation(invitation)
                      }
                      className="cursor-pointer transition-colors hover:bg-gray-50"
                    >
                      {/* Email */}
                      <td className="px-5 py-4 text-sm text-gray-600">
                        {invitation.email || "—"}
                      </td>

                      {/* Role */}
                      <td className="px-5 py-4 text-sm text-gray-600">
                        <div className="border-l border-gray-200 pl-5">
                          {invitation.roleName ||
                            invitation.role ||
                            "—"}
                        </div>
                      </td>

                      {/* Designation */}
                      <td className="px-5 py-4 text-sm text-gray-600">
                        <div className="border-l border-gray-200 pl-5">
                          {invitation.designation ||
                            invitation.invitedDesignation ||
                            "—"}
                        </div>
                      </td>

                      {/* Invited At */}
                      <td className="px-5 py-4 text-sm text-gray-600">
                        <div className="border-l border-gray-200 pl-5">
                          {invitation.invitedAt}
                        </div>
                      </td>

                      {/* Status */}
                      <td
                        className="px-5 py-4 text-center"
                        onClick={(event) =>
                          event.stopPropagation()
                        }
                      >
                        <div className="relative flex items-center justify-center before:absolute before:left-0 before:h-6 before:border-l before:border-gray-200 pl-8">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                              invitation.isExpired
                                ? "bg-red-100 text-red-700"
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            {invitation.isExpired
                              ? "Expired"
                              : "Active"}
                          </span>
                        </div>
                      </td>

                      {/* Quick Action */}
                      <td
                        className="px-5 py-4"
                        onClick={(event) =>
                          event.stopPropagation()
                        }
                      >
                        <div className="relative flex items-center justify-center border-l border-gray-200">
                          <button
                            type="button"
                            onClick={(event) =>
                              handleQuickActionMenu(
                                event,
                                invitation.id
                              )
                            }
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
                            aria-label="Quick actions"
                          >
                            <MdMoreVert size={20} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 py-12 text-center"
                    >
                      <div className="flex flex-col items-center justify-center">
                        <MdSend
                          size={42}
                          className="mb-3 text-gray-300"
                        />

                        <p className="text-sm font-medium text-gray-600">
                          No invitations sent
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          Invitations you send will appear
                          here.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="border-t border-gray-200 px-5 py-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-4">
              {/* Rows Per Page */}
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>Rows per page:</span>

                <select
                  value={pageSize}
                  onChange={(event) =>
                    handlePageSizeChange(
                      Number(event.target.value)
                    )
                  }
                  className="rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-300"
                >
                  {PAGE_SIZE_OPTIONS.map((option) => (
                    <option
                      key={option}
                      value={option}
                    >
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {/* Showing Count */}
              <div className="text-sm text-gray-500">
                Showing {startItem} to {endItem} of{" "}
                {totalInvitations} users
              </div>

              </div>


              {/* Page Navigation */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() =>
                    handlePageChange(currentPage - 1)
                  }
                  disabled={currentPage === 1}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Previous page"
                >
                  <MdChevronLeft size={20} />
                </button>

                <span className="px-2 text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    handlePageChange(currentPage + 1)
                  }
                  disabled={currentPage === totalPages}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Next page"
                >
                  <MdChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Menu Overlay */}
      {openMenuId &&
        createPortal(
          <>
            <button
              type="button"
              onClick={() => setOpenMenuId(null)}
              className="fixed inset-0 z-10 cursor-default"
              aria-label="Close quick actions"
            />

            <div
              ref={menuRef}
              className="fixed z-20 w-52 rounded-lg border border-gray-200 bg-white py-1 shadow-lg"
              style={{
                top: menuPosition.top,
                left: menuPosition.left,
              }}
            >
              {(() => {
                const invitation = invitations.find(
                  (item) => item.id === openMenuId
                );

                if (!invitation) return null;

                return (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        handleResendInvitation(
                          invitation
                        )
                      }
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-green-600 transition-colors hover:bg-green-50"
                    >
                      <MdSend size={18} />
                      <span>Resend Invitation</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleCancelInvitation(
                          invitation
                        )
                      }
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-red-600 transition-colors hover:bg-red-50"
                    >
                      <MdCancel size={18} />
                      <span>Cancel Invitation</span>
                    </button>
                  </>
                );
              })()}
            </div>
          </>,
          document.body
        )}

      {/* Invitation Details Modal */}
      <InvitationDetailsModal
        open={Boolean(selectedInvitation)}
        invitation={selectedInvitation}
        onClose={() => setSelectedInvitation(null)}
      />

      {/* Cancel Invitation Confirmation */}
      <ConfirmationModal
        isOpen={cancelOpen}
        onCancel={handleCloseCancelModal}
        onConfirm={handleConfirmCancelInvitation}
        title="Cancel Invitation"
        message={
          cancelInvitationTarget
            ? `Are you sure you want to cancel the invitation sent to ${cancelInvitationTarget.email}?`
            : "Are you sure you want to cancel this invitation?"
        }
        confirmText="Cancel Invitation"
        cancelText="Keep Invitation"
      />

      {/* Resend Invitation Confirmation */}
      <ConfirmationModal
        isOpen={resendOpen}
        onCancel={handleCloseResendModal}
        onConfirm={handleConfirmResendInvitation}
        title="Resend Invitation"
        message={
          resendInvitationTarget
            ? `Are you sure you want to resend the invitation to ${resendInvitationTarget.email}?`
            : "Are you sure you want to resend this invitation?"
        }
        confirmText="Resend Invitation"
        cancelText="Cancel"
      />
    </DashboardLayout>
  );
};

export default InvitationsSent;