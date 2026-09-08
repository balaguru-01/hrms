import {
  useCallback,
  useMemo,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";

import DynamicTable from "../../components/tables/DynamicTable";
import DynamicPagination from "../../components/tables/DynamicPagination";
import DynamicTableActions from "../../components/tables/DynamicTableActions";

import DynamicDetailsModal from "../../components/Modals/DynamicDetailsModal";
import DynamicConfirmationModal from "../../components/Modals/DynamicConfirmationModal";

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

  const [confirmation, setConfirmation] =
    useState(null);

  const handleViewUser = useCallback(
    (user) => {
      setSelectedUser(user);
    },
    []
  );

  const handleRemoveUser = useCallback(
    (user) => {
      setConfirmation({
        type: "remove",
        user,
        title: "Remove User",
        description: `Are you sure you want to remove ${user.firstName} ${user.lastName}?`,
        confirmLabel: "Remove User",
      });
    },
    []
  );

  const handleMakeInactive = useCallback(
    (user) => {
      setConfirmation({
        type: "inactive",
        user,
        title: "Make User Inactive",
        description: `Are you sure you want to make ${user.firstName} ${user.lastName} inactive?`,
        confirmLabel: "Make Inactive",
      });
    },
    []
  );

  const handleConfirmAction = () => {
    if (!confirmation?.user) {
      return;
    }

    const {
      type,
      user,
    } = confirmation;

    const fullName =
      `${user?.firstName || ""} ${
        user?.lastName || ""
      }`.trim() || "User";

    if (type === "remove") {
      removeUser(user.id);

      showToast(
        `${fullName} has been removed.`,
        "success"
      );
    }

    if (type === "inactive") {
      makeInactiveUser(user.id);

      showToast(
        `${fullName} has been made inactive.`,
        "success"
      );
    }

    setConfirmation(null);
    setSelectedUser(null);
  };

  const handleCancelConfirmation = () => {
    setConfirmation(null);
  };

  const handlePageChange = (page) => {
    if (
      page < 1 ||
      page >
        activeUsersPagination.totalPages ||
      page ===
        activeUsersPagination.currentPage
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

  const columns = useMemo(
    () => [
      {
        key: "user",
        header: "User",
        width: "30%",

        render: (user) => {
          const fullName =
            `${user?.firstName || ""} ${
              user?.lastName || ""
            }`.trim();

          return (
            <div className="flex min-w-0 items-center gap-3">
              {/* User Information */}

              <button
                type="button"
                onClick={() =>
                  handleViewUser(user)
                }
                className="
                  flex
                  min-w-0
                  items-center
                  gap-3
                  text-left
                "
              >
                <div
                  className="
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-green-100
                    font-semibold
                    text-green-700
                  "
                >
                  {user?.firstName
                    ?.charAt(0)
                    .toUpperCase() || "U"}
                </div>

                <div className="min-w-0">
                  <p
                    className="
                      truncate
                      text-sm
                      font-semibold
                      text-gray-900
                    "
                  >
                    {fullName ||
                      "Unknown User"}
                  </p>

                  <p
                    className="
                      truncate
                      text-xs
                      text-gray-500
                    "
                  >
                    {user?.designation ||
                      "—"}
                  </p>
                </div>
              </button>
            </div>
          );
        },
      },

      {
        key: "email",
        header: "Email",
        width: "27%",
        accessor: "email",
        cellClassName:
          "text-gray-600",
      },

      {
        key: "role",
        header: "Role",
        width: "18%",
        accessor: "role",
        cellClassName:
          "text-gray-700",
      },

      {
        key: "status",
        header: "Status",
        width: "15%",
        headerClassName:
          "text-center",
        cellClassName:
          "text-center",

        render: () => (
          <span
            className="
              inline-flex
              rounded-full
              bg-green-50
              px-3
              py-1
              text-xs
              font-medium
              text-green-700
            "
          >
            Active
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

        render: (user) => (
          <DynamicTableActions
            row={user}
            actions={[
              {
                type: "remove",
                label: "Remove User",
                onClick:
                  handleRemoveUser,
              },
              {
                type: "inactive",
                label: "Make Inactive",
                onClick:
                  handleMakeInactive,
              },
            ]}
            buttonLabel={`Quick actions for ${
              user?.fullName ||
              `${user?.firstName || ""} ${
                user?.lastName || ""
              }`.trim() ||
              "user"
            }`}
          />
        ),
      },
    ],
    [
      handleViewUser,
      handleRemoveUser,
      handleMakeInactive,
    ]
  );

  const userDetailFields = [
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
        Boolean(user?.joinedAt),
    },

    {
      key: "registeredAt",
      label: "Registered At",
      type: "date",
      show: (user) =>
        Boolean(user?.registeredAt),
    },
  ];

  const currentPage =
    activeUsersPagination?.currentPage ||
    1;

  const totalPages =
    activeUsersPagination?.totalPages ||
    1;

  const totalUsers =
    activeUsersPagination?.totalUsers ||
    0;

  const pageSize =
    activeUsersPagination?.pageSize ||
    10;

  return (
    <DashboardLayout
      title="Active Users"
      subtitle="View and manage users currently working under your enterprise."
    >
      <div className="space-y-5">
        <div
          className="
            flex
            flex-col
            gap-3
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Active Users
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {totalUsers} active user
              {totalUsers !== 1
                ? "s"
                : ""}
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              navigate(-1)
            }
            className="
              self-start
              rounded-xl
              border
              border-gray-300
              px-4
              py-2
              text-sm
              font-medium
              text-gray-700
              transition
              hover:bg-gray-50
            "
          >
            Back
          </button>
        </div>

        <DynamicTable
          columns={columns}
          data={activeUsers}
          rowKey="id"
          minWidth="900px"
          className="overflow-visible"
          emptyTitle="No Active Users"
          emptyDescription="There are currently no active users under your enterprise."
        />

        <DynamicPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalUsers}
          pageSize={pageSize}
          pageSizeOptions={
            PAGE_SIZE_OPTIONS
          }
          onPageChange={
            handlePageChange
          }
          onPageSizeChange={
            handlePageSizeChange
          }
          itemLabel="active users"
        />
      </div>

      <DynamicDetailsModal
        open={Boolean(selectedUser)}
        title="User Details"
        subtitle="Review user's account information"
        data={selectedUser}
        fields={userDetailFields}
        avatar={
          selectedUser?.firstName
            ?.charAt(0)
            .toUpperCase() || "U"
        }
        onClose={() =>
          setSelectedUser(null)
        }
      />

      <DynamicConfirmationModal
        open={Boolean(confirmation)}
        title={
          confirmation?.title ||
          "Confirm Action"
        }
        description={
          confirmation?.description ||
          ""
        }
        confirmLabel={
          confirmation?.confirmLabel ||
          "Confirm"
        }
        cancelLabel="Cancel"
        onConfirm={
          handleConfirmAction
        }
        onCancel={
          handleCancelConfirmation
        }
      />
    </DashboardLayout>
  );
};

export default ActiveUsers;