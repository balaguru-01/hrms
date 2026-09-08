import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useSearchParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { FaEye } from "react-icons/fa";

import DashboardLayout from "../../components/layout/DashboardLayout";
import DynamicTable from "../../components/tables/DynamicTable";
import DynamicPagination from "../../components/tables/DynamicPagination";
import DynamicTableActions from "../../components/tables/DynamicTableActions";
import DynamicDetailsModal from "../../components/Modals/DynamicDetailsModal";
import DynamicConfirmationModal from "../../components/Modals/DynamicConfirmationModal";

import { getUsers } from "../../api/enterpriseUserApi";
import { useEnterpriseUsers } from "../../context/EnterpriseUserContext";
import { useToast } from "../../context/ToastContext";

const USER_STATUS = {
  ALL: "all",
  ACTIVE: "active",
  PENDING: "pending",
  REJECTED: "rejected",
};

const API_STATUS = {
  ACTIVE: "Active",
  PENDING: "Pending",
  REJECTED: "Rejected",
};

const DEFAULT_PAGE_SIZE = 10;

const PAGE_SIZE_OPTIONS = [
  10,
  20,
  30,
  50,
];

const Users = () => {
  const [searchParams, setSearchParams] =
    useSearchParams();

  const { showToast } = useToast();

  const {
    approveUser,
    rejectUser,
    removeUser,
    makeInactiveUser,
  } = useEnterpriseUsers();

  const [users, setUsers] = useState([]);

  const [pageSize, setPageSize] =
    useState(DEFAULT_PAGE_SIZE);

  const [pagination, setPagination] =
    useState({
      currentPage: 1,
      pageSize: DEFAULT_PAGE_SIZE,
      totalUsers: 0,
      totalPages: 0,
    });

  const [isLoading, setIsLoading] =
    useState(false);

  const [selectedUser, setSelectedUser] =
    useState(null);

  const [confirmation, setConfirmation] =
    useState(null);

  /*
   * Current status filter from URL.
   */
  const activeStatus =
    searchParams.get("status") ||
    USER_STATUS.ALL;

  /*
   * Current page from URL.
   */
  const currentPageFromUrl = Number(
    searchParams.get("page") || 1
  );

  const currentPage =
    Number.isInteger(currentPageFromUrl) &&
    currentPageFromUrl > 0
      ? currentPageFromUrl
      : 1;

  /*
   * Logged-in user ID.
   *
   * This is used to prevent the current user's
   * own Quick Actions from being displayed.
   */
  const loggedInUserId = useMemo(() => {
    try {
      const accessToken =
        localStorage.getItem(
          "accessToken"
        );

      if (!accessToken) {
        return null;
      }

      const decodedToken =
        jwtDecode(accessToken);

      return (
        decodedToken?.userId ||
        decodedToken?.id ||
        decodedToken?._id ||
        null
      );
    } catch (error) {
      return null;
    }
  }, []);

  /*
   * Normalize API users into the shape
   * required by the reusable table.
   */
  const normalizeUser = useCallback(
    (user) => {
      const userId =
        user?._id ||
        user?.id ||
        user?.userId;

      const firstName =
        user?.firstName || "";

      const lastName =
        user?.lastName || "";

      const fullName =
        `${firstName} ${lastName}`.trim();

      return {
        id: userId,

        firstName,
        lastName,

        email:
          user?.email || "",

        role:
          user?.role?.name ||
          user?.roleName ||
          user?.role ||
          "",

        designation:
          user?.designation || "",

        phone:
          user?.phone || "",

        location:
          user?.location || "",

        status:
          user?.status?.toLowerCase?.() ||
          "",

        joinedAt:
          user?.joinedAt ||
          user?.createdAt ||
          null,

        registeredAt:
          user?.registeredAt ||
          user?.createdAt ||
          null,

        updatedAt:
          user?.updatedAt || null,

        rejectionReason:
          user?.rejectionReason ||
          "",

        fullName,
      };
    },
    []
  );

  /*
   * Fetch users.
   */
  const fetchUsers = useCallback(
    async (
      status = activeStatus,
      page = currentPage
    ) => {
      try {
        setIsLoading(true);

        const apiStatus =
          status === USER_STATUS.ALL
            ? undefined
            : API_STATUS[
                status.toUpperCase()
              ];

        const response =
          await getUsers({
            scope: "enterprise",
            status: apiStatus,
            page,
            limit: pageSize,
          });

        const fetchedUsers =
          response?.data?.users || [];

        const fetchedPagination =
          response?.data?.pagination || {
            currentPage: page,
            pageSize,
            totalUsers: 0,
            totalPages: 0,
          };

        const normalizedUsers =
          fetchedUsers
            .map(normalizeUser)
            .filter((user) => user.id);

        setUsers(normalizedUsers);

        setPagination({
          currentPage:
            fetchedPagination.currentPage ||
            page,

          pageSize:
            fetchedPagination.pageSize ||
            pageSize,

          totalUsers:
            fetchedPagination.totalUsers ||
            0,

          totalPages:
            fetchedPagination.totalPages ||
            0,
        });
      } catch (error) {
        console.error(
          "Failed to fetch users:",
          error
        );

        setUsers([]);

        setPagination({
          currentPage: page,
          pageSize,
          totalUsers: 0,
          totalPages: 0,
        });

        showToast(
          "Failed to fetch users.",
          "error"
        );
      } finally {
        setIsLoading(false);
      }
    },
    [
      activeStatus,
      currentPage,
      normalizeUser,
      pageSize,
      showToast,
    ]
  );

  /*
   * Fetch whenever the selected status,
   * page, or page size changes.
   */
  useEffect(() => {
    fetchUsers(
      activeStatus,
      currentPage
    );
  }, [
    activeStatus,
    currentPage,
    fetchUsers,
  ]);

  /*
   * Status tab change.
   */
  const handleStatusChange = (
    status
  ) => {
    setSearchParams({
      status,
      page: "1",
    });
  };

  /*
   * Page change.
   */
  const handlePageChange = (
    page
  ) => {
    if (
      page < 1 ||
      page > pagination.totalPages ||
      page === pagination.currentPage
    ) {
      return;
    }

    setSearchParams({
      status: activeStatus,
      page: String(page),
    });
  };

  /*
   * Page size change.
   */
  const handlePageSizeChange = (
    newPageSize
  ) => {
    if (
      !PAGE_SIZE_OPTIONS.includes(
        newPageSize
      ) ||
      newPageSize === pageSize
    ) {
      return;
    }

    setPageSize(newPageSize);

    setSearchParams({
      status: activeStatus,
      page: "1",
    });
  };

  /*
   * Open user details.
   */
  const handleViewUser = (
    user
  ) => {
    setSelectedUser(user);
  };

  /*
   * Open Approve confirmation.
   */
  const handleApproveUser = (
    user
  ) => {
    setConfirmation({
      type: "approve",
      user,

      title: "Approve User",

      description: `Are you sure you want to approve ${user.firstName} ${user.lastName}?`,

      confirmLabel: "Approve User",
    });
  };

  /*
   * Open Reject confirmation.
   */
  const handleRejectUser = (
    user
  ) => {
    setConfirmation({
      type: "reject",
      user,

      title: "Reject User",

      description: `Are you sure you want to reject ${user.firstName} ${user.lastName}?`,

      confirmLabel: "Reject User",
    });
  };

  /*
   * Open Remove confirmation.
   */
  const handleRemoveUser = (
    user
  ) => {
    setConfirmation({
      type: "remove",
      user,

      title: "Remove User",

      description: `Are you sure you want to remove ${user.firstName} ${user.lastName}?`,

      confirmLabel: "Remove User",
    });
  };

  /*
   * Open Make Inactive confirmation.
   */
  const handleMakeInactive = (
    user
  ) => {
    setConfirmation({
      type: "inactive",
      user,

      title: "Make User Inactive",

      description: `Are you sure you want to make ${user.firstName} ${user.lastName} inactive?`,

      confirmLabel: "Make Inactive",
    });
  };

  /*
   * Resolve Quick Actions for each user.
   */
  const getActionsForUser = useCallback(
    (user) => {
      const actions = [];

      if (user.status === "pending") {
        actions.push({
          type: "approve",
          label: "Approve User",
          onClick:
            handleApproveUser,
        });

        actions.push({
          type: "reject",
          label: "Reject User",
          onClick:
            handleRejectUser,
        });
      }

      if (user.status === "active") {
        actions.push({
          type: "remove",
          label: "Remove User",
          onClick:
            handleRemoveUser,
        });

        actions.push({
          type: "inactive",
          label: "Make Inactive",
          onClick:
            handleMakeInactive,
        });
      }

      return actions;
    },
    []
  );

  /*
   * Confirm the selected action.
   *
   * IMPORTANT:
   * The action is awaited first.
   * The table is refreshed only after the
   * action successfully completes.
   */
  const handleConfirmAction =
    async () => {
      if (!confirmation?.user) {
        return;
      }

      const {
        type,
        user,
      } = confirmation;

      try {
        setIsLoading(true);

        if (type === "approve") {
          await approveUser(
            user.id
          );

          showToast(
            `${user.firstName} ${user.lastName} has been approved.`,
            "success"
          );
        }

        if (type === "reject") {
          await rejectUser(
            user.id
          );

          showToast(
            `${user.firstName} ${user.lastName} has been rejected.`,
            "success"
          );
        }

        if (type === "remove") {
          await removeUser(
            user.id
          );

          showToast(
            `${user.firstName} ${user.lastName} has been removed.`,
            "success"
          );
        }

        if (type === "inactive") {
          await makeInactiveUser(
            user.id
          );

          showToast(
            `${user.firstName} ${user.lastName} has been made inactive.`,
            "success"
          );

          /*
           * Close confirmation only after
           * successful action.
           */
        }

        setConfirmation(null);

        /*
         * Refresh the current table after
         * the backend action succeeds.
         */
        await fetchUsers(
          activeStatus,
          currentPage
        );
      } catch (error) {
        console.error(
          "Failed to perform user action:",
          error
        );

        showToast(
          "Failed to perform the selected action.",
          "error"
        );
      } finally {
        setIsLoading(false);
      }
    };

  /*
   * User table columns.
   */
  const columns = useMemo(
    () => [
      {
        key: "user",
        header: "User",
        width: "28%",
        render: (user) => {
          const fullName =
            `${user.firstName || ""} ${
              user.lastName || ""
            }`.trim();

          return (
            <div
              className="
                flex
                min-w-0
                items-center
                justify-between
                gap-3
              "
            >
              {/* User Information */}

              <button
                type="button"
                onClick={() =>
                  handleViewUser(user)
                }
                className="
                  flex
                  min-w-0
                  flex-1
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
                  {user.firstName
                    ?.charAt(0)
                    .toUpperCase() ||
                    "U"}
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
                    {user.designation ||
                      "—"}
                  </p>
                </div>
              </button>

              {/* View User */}

              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  handleViewUser(user);
                }}
                aria-label={`View ${
                  user.fullName ||
                  "user"
                }`}
                title="View User"
                className="
                  flex
                  h-8
                  w-8
                  shrink-0
                  items-center
                  justify-center
                  rounded-md
                  text-gray-400
                  transition
                  hover:bg-gray-100
                  hover:text-green-600
                  focus:outline-none
                "
              >
                <FaEye
                  className="h-4 w-4"
                />
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
        width: "20%",
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
        render: (user) => {
          const status =
            user.status?.toLowerCase();

          let statusClass =
            "bg-gray-100 text-gray-600";

          if (status === "pending") {
            statusClass =
              "bg-yellow-50 text-yellow-700";
          }

          if (status === "active") {
            statusClass =
              "bg-green-50 text-green-700";
          }

          if (status === "rejected") {
            statusClass =
              "bg-red-50 text-red-700";
          }

          if (status === "inactive") {
            statusClass =
              "bg-gray-100 text-gray-600";
          }

          const formattedStatus =
            status
              ? status.charAt(0).toUpperCase() +
                status.slice(1)
              : "—";

          return (
            <span
              className={`
                inline-flex
                rounded-full
                px-3
                py-1
                text-xs
                font-medium
                ${statusClass}
              `}
            >
              {formattedStatus}
            </span>
          );
        },
      },

      {
        key: "actions",
        header: "Quick Actions",
        width: "150px",
        headerClassName:
          "text-left",
        cellClassName:
          "text-left",
        stopRowClick: true,

        render: (user) => {
          const isCurrentUser =
            Boolean(
              loggedInUserId
            ) &&
            String(user.id) ===
              String(
                loggedInUserId
              );

          if (isCurrentUser) {
            return null;
          }

          return (
            <DynamicTableActions
              row={user}
              actions={
                getActionsForUser
              }
              buttonLabel={`Quick actions for ${
                user.fullName ||
                "user"
              }`}
            />
          );
        },
      },
    ],
    [
      getActionsForUser,
      loggedInUserId,
    ]
  );

  /*
   * Status tabs.
   */
  const statusTabs = [
    {
      key: USER_STATUS.ALL,
      label: "All Users",
    },

    {
      key: USER_STATUS.ACTIVE,
      label: "Active Users",
    },

    {
      key: USER_STATUS.PENDING,
      label: "Pending Users",
    },

    {
      key: USER_STATUS.REJECTED,
      label: "Rejected Users",
    },
  ];

  /*
   * User details fields.
   */
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
        Boolean(user.joinedAt),
    },

    {
      key: "registeredAt",
      label: "Registered At",
      type: "date",
      show: (user) =>
        Boolean(user.registeredAt),
    },

    {
      key: "rejectionReason",
      label: "Reason for Rejection",
      fullWidth: true,
      show: (user) =>
        Boolean(
          user.rejectionReason
        ),
    },
  ];

  return (
    <DashboardLayout
      title="Users"
      subtitle="View and manage users under your enterprise."
    >
      <div className="space-y-5">
        {/* Status Tabs */}

        <div className="flex justify-center">
          <div
            className="
              inline-flex
              items-center
              gap-1
              rounded-xl
              border
              border-gray-200
              bg-white
              p-1
              shadow-sm
            "
          >
            {statusTabs.map(
              (tab) => {
                const isActive =
                  activeStatus ===
                  tab.key;

                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() =>
                      handleStatusChange(
                        tab.key
                      )
                    }
                    className={`
                      rounded-lg
                      px-5
                      py-2.5
                      text-sm
                      font-medium
                      transition
                      ${
                        isActive
                          ? "bg-green-600 text-white shadow-lg"
                          : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                      }
                    `}
                  >
                    {tab.label}
                  </button>
                );
              }
            )}
          </div>
        </div>

        {/* Loading */}

        {isLoading ? (
          <div
            className="
              rounded-xl
              border
              border-gray-200
              bg-white
              px-6
              py-12
              text-center
              shadow-sm
            "
          >
            <p className="text-sm text-gray-500">
              Loading users...
            </p>
          </div>
        ) : users.length > 0 ? (
          <>
            {/* Users Table */}

            <DynamicTable
              columns={columns}
              data={users}
              rowKey="id"
              minWidth="900px"
              className="overflow-visible"
            />

            {/* Pagination */}

            <DynamicPagination
              currentPage={
                pagination.currentPage
              }
              totalPages={
                pagination.totalPages
              }
              totalItems={
                pagination.totalUsers
              }
              pageSize={
                pagination.pageSize
              }
              pageSizeOptions={
                PAGE_SIZE_OPTIONS
              }
              onPageChange={
                handlePageChange
              }
              onPageSizeChange={
                handlePageSizeChange
              }
              itemLabel="users"
            />
          </>
        ) : (
          <div
            className="
              rounded-xl
              border
              border-gray-200
              bg-white
              px-6
              py-12
              text-center
              shadow-sm
            "
          >
            <h3
              className="
                text-base
                font-semibold
                text-gray-900
              "
            >
              No Users Found
            </h3>

            <p
              className="
                mt-1
                text-sm
                text-gray-500
              "
            >
              There are currently no users
              matching the selected status.
            </p>
          </div>
        )}
      </div>

      {/* User Details Modal */}

      <DynamicDetailsModal
        open={Boolean(selectedUser)}
        title="User Details"
        subtitle="Review user's account information"
        data={selectedUser}
        fields={
          userDetailFields
        }
        avatar={
          selectedUser?.firstName
            ?.charAt(0)
            .toUpperCase() ||
          "U"
        }
        onClose={() =>
          setSelectedUser(null)
        }
      />

      {/* Confirmation Modal */}

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
        onCancel={() =>
          setConfirmation(null)
        }
      />
    </DashboardLayout>
  );
};

export default Users;