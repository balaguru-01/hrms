import { useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";
import UserList from "../../components/enterprise-user/UserList";
import UserDetailsModal from "../../components/enterprise-user/UserDetailsModal";
import ConfirmationModal from "../../components/common/ConfirmationModal";

import { useEnterpriseUsers } from "../../context/EnterpriseUserContext";
import { useToast } from "../../context/ToastContext";

const PAGE_SIZE_OPTIONS = [
  10,
  20,
  30,
  50,
];

const ActiveUsers = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const {
    activeUsers,
    activeUsersPagination,
    fetchActiveUsers,
    removeUser,
    makeInactiveUser,
  } = useEnterpriseUsers();

  const [selectedUser, setSelectedUser] =
    useState(null);

  const [removeUserTarget, setRemoveUserTarget] =
    useState(null);

  const [inactiveUser, setInactiveUser] =
    useState(null);

  const handleViewUser = (user) => {
    setSelectedUser(user);
  };

  const handleRemoveUser = (user) => {
    setRemoveUserTarget(user);
  };

  const handleMakeInactive = (user) => {
    setInactiveUser(user);
  };

  const confirmRemoveUser = () => {
    if (!removeUserTarget) return;

    removeUser(removeUserTarget.id);

    showToast(
      `${removeUserTarget.firstName} ${removeUserTarget.lastName} has been removed.`,
      "success"
    );

    setRemoveUserTarget(null);
  };

  const confirmMakeInactive = () => {
    if (!inactiveUser) return;

    makeInactiveUser(inactiveUser.id);

    showToast(
      `${inactiveUser.firstName} ${inactiveUser.lastName} has been made inactive.`,
      "success"
    );

    setInactiveUser(null);
  };

  const handlePageChange = (page) => {
    if (
      page < 1 ||
      page > activeUsersPagination.totalPages ||
      page === activeUsersPagination.currentPage
    ) {
      return;
    }

    fetchActiveUsers(
      page,
      activeUsersPagination.pageSize
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
        activeUsersPagination.pageSize
    ) {
      return;
    }

    fetchActiveUsers(
      1,
      newPageSize
    );
  };

  const currentPage =
    activeUsersPagination.currentPage;

  const totalPages =
    activeUsersPagination.totalPages;

  const totalUsers =
    activeUsersPagination.totalUsers;

  const pageSize =
    activeUsersPagination.pageSize;

  const startItem =
    totalUsers === 0
      ? 0
      : (currentPage - 1) * pageSize + 1;

  const endItem =
    totalUsers === 0
      ? 0
      : Math.min(
          currentPage * pageSize,
          totalUsers
        );

  return (
    <DashboardLayout
      title="Active Users"
      subtitle="View and manage users currently working under your enterprise."
    >
      <div className="space-y-5">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Active Users
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {totalUsers} active user
              {totalUsers !== 1 ? "s" : ""}
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

        {/* User List */}
        <UserList
          users={activeUsers}
          onUserClick={handleViewUser}
          actions={[
            {
              type: "remove",
              label: "Remove User",
              onClick: handleRemoveUser,
            },
            {
              type: "inactive",
              label: "Make Inactive",
              onClick: handleMakeInactive,
            },
          ]}
          emptyTitle="No Active Users"
          emptyDescription="There are currently no active users under your enterprise."
        />

        {/* Pagination */}
        {totalUsers > 0 && (
          <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white px-5 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            {/* Result Count + Rows Per Page */}
            <div className="flex flex-wrap items-center gap-4">
              {/* Rows Per Page */}
              <div className="flex items-center gap-2">
                <label
                  htmlFor="active-users-rows-per-page"
                  className="text-sm text-gray-500"
                >
                  Rows per page:
                </label>

                <select
                  id="active-users-rows-per-page"
                  value={pageSize}
                  onChange={(event) =>
                    handlePageSizeChange(
                      Number(
                        event.target.value
                      )
                    )
                  }
                  className="
                    rounded-lg
                    border
                    border-gray-300
                    bg-white
                    px-2.5
                    py-1.5
                    text-sm
                    font-medium
                    text-gray-700
                    outline-none
                    transition
                    focus:border-green-500
                    focus:ring-1
                    focus:ring-green-500
                  "
                >
                  {PAGE_SIZE_OPTIONS.map(
                    (option) => (
                      <option
                        key={option}
                        value={option}
                      >
                        {option}
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* Result Count */}
              <p className="text-sm text-gray-500">
                Showing{" "}
                <span className="font-medium text-gray-700">
                  {startItem}
                </span>{" "}
                to{" "}
                <span className="font-medium text-gray-700">
                  {endItem}
                </span>{" "}
                of{" "}
                <span className="font-medium text-gray-700">
                  {totalUsers}
                </span>{" "}
                active users
              </p>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() =>
                  handlePageChange(
                    currentPage - 1
                  )
                }
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>

              <span className="px-2 text-sm text-gray-600">
                Page{" "}
                <span className="font-semibold text-gray-900">
                  {currentPage}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-gray-900">
                  {Math.max(
                    totalPages,
                    1
                  )}
                </span>
              </span>

              <button
                type="button"
                disabled={
                  currentPage >= totalPages
                }
                onClick={() =>
                  handlePageChange(
                    currentPage + 1
                  )
                }
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* User Details */}
      <UserDetailsModal
        open={Boolean(selectedUser)}
        user={selectedUser}
        onClose={() => setSelectedUser(null)}
      />

      {/* Remove User Confirmation */}
      <ConfirmationModal
        isOpen={Boolean(removeUserTarget)}
        title="Remove User"
        message={
          removeUserTarget
            ? `Are you sure you want to remove ${removeUserTarget.firstName} ${removeUserTarget.lastName}?`
            : ""
        }
        confirmText="Remove User"
        cancelText="Cancel"
        onConfirm={confirmRemoveUser}
        onCancel={() =>
          setRemoveUserTarget(null)
        }
      />

      {/* Make Inactive Confirmation */}
      <ConfirmationModal
        isOpen={Boolean(inactiveUser)}
        title="Make User Inactive"
        message={
          inactiveUser
            ? `Are you sure you want to make ${inactiveUser.firstName} ${inactiveUser.lastName} inactive?`
            : ""
        }
        confirmText="Make Inactive"
        cancelText="Cancel"
        onConfirm={confirmMakeInactive}
        onCancel={() => setInactiveUser(null)}
      />
    </DashboardLayout>
  );
};

export default ActiveUsers;