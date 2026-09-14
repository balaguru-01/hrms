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
import StatusTabs from "../../components/tables/StatusTabs";
import DynamicDetailsModal from "../../components/Modals/DynamicDetailsModal";
import DynamicConfirmationModal from "../../components/Modals/DynamicConfirmationModal";

import { getUsers } from "../../api/enterpriseUserApi";
import { useEnterpriseUsers } from "../../context/EnterpriseUserContext";
import { useToast } from "../../context/ToastContext";

import {
  enterpriseMenuItems,
} from "../../config/EnterpriseAdmin/EpAdminSidebarConfig";

import {
  USER_STATUS,
  API_STATUS,
  DEFAULT_PAGE_SIZE,
  PAGE_SIZE_OPTIONS,
  USER_STATUS_TABS,
  USER_STATUS_CONFIG,
  USER_ACTIONS_CONFIG,
  CONFIRMATION_CONFIG,
  USER_DETAIL_FIELDS,
} from "../../config/EnterpriseAdmin/EpAdminUsersConfig";

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

  const [rejectionReason, setRejectionReason] =
    useState("");

  /*
   * Current status filter from URL.
   */
  const activeStatus =
    searchParams.get("status") ||
    USER_STATUS.ALL;

  const currentPageFromUrl = Number(
    searchParams.get("page") || 1
  );

  const currentPage =
    Number.isInteger(currentPageFromUrl) &&
    currentPageFromUrl > 0
      ? currentPageFromUrl
      : 1;

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

  
  const handleViewUser = (
    user
  ) => {
    setSelectedUser(user);
  };

 
  const openConfirmation = useCallback(
    (user, actionType) => {
      const config =
        CONFIRMATION_CONFIG[actionType];

      if (!config) {
        return;
      }

      setConfirmation({
        type: actionType,
        user,
        title: config.title,
        description:
          config.description(user),
        confirmLabel:
          config.confirmLabel,
        confirmationConfig: config,
      });
    },
    []
  );

  const handleApproveUser = useCallback(
    (user) => {
      openConfirmation(
        user,
        "approve"
      );
    },
    [openConfirmation]
  );

  
  const handleRejectUser = useCallback(
    (user) => {
      setRejectionReason("");

      openConfirmation(
        user,
        "reject"
      );
    },
    [openConfirmation]
  );

 
  const handleRemoveUser = useCallback(
    (user) => {
      openConfirmation(
        user,
        "remove"
      );
    },
    [openConfirmation]
  );

  
  const handleMakeInactive = useCallback(
    (user) => {
      openConfirmation(
        user,
        "inactive"
      );
    },
    [openConfirmation]
  );

 
  const getActionsForUser = useCallback(
    (user) => {
      const actionHandlers = {
        approve: handleApproveUser,
        reject: handleRejectUser,
        remove: handleRemoveUser,
        inactive: handleMakeInactive,
      };

      const configuredActions =
        USER_ACTIONS_CONFIG[
          user.status
        ] || [];

      return configuredActions.map(
        (action) => ({
          ...action,
          onClick:
            actionHandlers[action.type],
        })
      );
    },
    [
      handleApproveUser,
      handleRejectUser,
      handleRemoveUser,
      handleMakeInactive,
    ]
  );

  /*
   * Execute confirmed user action.
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
          await approveUser(user.id);

          showToast(
            `${user.firstName} ${user.lastName} has been approved.`,
            "success"
          );
        }

        if (type === "reject") {
          await rejectUser(
            user.id,
            rejectionReason.trim() ||
              "Registration request was rejected."
          );

          showToast(
            `${user.firstName} ${user.lastName} has been rejected.`,
            "success"
          );
        }

        if (type === "remove") {
          await removeUser(user.id);

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
        }

        setConfirmation(null);
        setRejectionReason("");

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
                  user.fullName || "user"
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
                <FaEye className="h-4 w-4" />
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

          const statusClass =
            USER_STATUS_CONFIG[
              status
            ]?.className ||
            USER_STATUS_CONFIG.default
              .className;

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
            Boolean(loggedInUserId) &&
            String(user.id) ===
              String(loggedInUserId);

          if (isCurrentUser) {
            return null;
          }

          return (
            <DynamicTableActions
              row={user}
              actions={getActionsForUser}
              buttonLabel={`Quick actions for ${
                user.fullName || "user"
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

  return (
    <DashboardLayout
      title="Users"
      subtitle="View and manage users under your enterprise."
      menuItems={enterpriseMenuItems}
      profilePath="/enterprise/profile"
    >
      <div className="space-y-5">
        {/* Status Tabs */}

        <div className="flex justify-center">
          <StatusTabs
            tabs={USER_STATUS_TABS}
            activeTab={activeStatus}
            onChange={handleStatusChange}
          />
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
        fields={USER_DETAIL_FIELDS}
        avatar={
          selectedUser?.firstName
            ?.charAt(0)
            .toUpperCase() || "U"
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
          confirmation?.description || ""
        }
        confirmLabel={
          confirmation?.confirmLabel ||
          "Confirm"
        }
        cancelLabel="Cancel"
        icon={
          confirmation
            ?.confirmationConfig?.icon
        }
        iconClassName={
          confirmation
            ?.confirmationConfig
            ?.iconClassName
        }
        confirmClassName={
          confirmation
            ?.confirmationConfig
            ?.confirmClassName
        }
        showInput={
          confirmation?.type === "reject"
        }
        inputLabel="Rejection Reason"
        inputValue={rejectionReason}
        inputPlaceholder="Enter the reason for rejecting this user..."
        onInputChange={
          setRejectionReason
        }
        inputRequired={
          confirmation?.type === "reject"
        }
        onConfirm={
          handleConfirmAction
        }
        onCancel={() => {
          setConfirmation(null);
          setRejectionReason("");
        }}
      />
    </DashboardLayout>
  );
};

export default Users;