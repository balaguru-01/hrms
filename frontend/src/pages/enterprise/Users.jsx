import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useSearchParams } from "react-router-dom";

import { jwtDecode } from "jwt-decode";

import DashboardLayout from "../../components/layout/DashboardLayout";
import UserList from "../../components/enterprise-user/UserList";
import UserDetailsModal from "../../components/enterprise-user/UserDetailsModal";
import ConfirmationModal from "../../components/common/ConfirmationModal";

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
        email: user?.email || "",
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
        fullName,
      };
    },
    []
  );

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
            fetchedPagination.totalUsers || 0,
          totalPages:
            fetchedPagination.totalPages || 0,
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

  const handleStatusChange = (status) => {
    setSearchParams({
      status,
      page: "1",
    });
  };

  const handlePageChange = (page) => {
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

  const handleViewUser = (user) => {
    setSelectedUser(user);
  };

  const getActionsForUser = (user) => {
    const actions = [];

    if (user.status === "pending") {
      actions.push({
        type: "approve",
        label: "Approve User",
        onClick: () =>
          handleApproveUser(user),
      });

      actions.push({
        type: "reject",
        label: "Reject User",
        onClick: () =>
          handleRejectUser(user),
      });
    }

    if (user.status === "active") {
      actions.push({
        type: "remove",
        label: "Remove User",
        onClick: () =>
          handleRemoveUser(user),
      });

      actions.push({
        type: "inactive",
        label: "Make Inactive",
        onClick: () =>
          handleMakeInactive(user),
      });
    }

    return actions;
  };

  const handleApproveUser = (user) => {
    setConfirmation({
      type: "approve",
      user,
      title: "Approve User",
      message: `Are you sure you want to approve ${user.firstName} ${user.lastName}?`,
      confirmText: "Approve User",
    });
  };

  const handleRejectUser = (user) => {
    setConfirmation({
      type: "reject",
      user,
      title: "Reject User",
      message: `Are you sure you want to reject ${user.firstName} ${user.lastName}?`,
      confirmText: "Reject User",
    });
  };

  const handleRemoveUser = (user) => {
    setConfirmation({
      type: "remove",
      user,
      title: "Remove User",
      message: `Are you sure you want to remove ${user.firstName} ${user.lastName}?`,
      confirmText: "Remove User",
    });
  };

  const handleMakeInactive = (user) => {
    setConfirmation({
      type: "inactive",
      user,
      title: "Make User Inactive",
      message: `Are you sure you want to make ${user.firstName} ${user.lastName} inactive?`,
      confirmText: "Make Inactive",
    });
  };

  const handleConfirmAction = () => {
    if (!confirmation?.user) {
      return;
    }

    const { type, user } =
      confirmation;

    if (type === "approve") {
      approveUser(user.id);
      showToast(
        `${user.firstName} ${user.lastName} has been approved.`,
        "success"
      );
    }

    if (type === "reject") {
      rejectUser(user.id);
      showToast(
        `${user.firstName} ${user.lastName} has been rejected.`,
        "success"
      );
    }

    if (type === "remove") {
      removeUser(user.id);
      showToast(
        `${user.firstName} ${user.lastName} has been removed.`,
        "success"
      );
    }

    if (type === "inactive") {
      makeInactiveUser(user.id);
      showToast(
        `${user.firstName} ${user.lastName} has been made inactive.`,
        "success"
      );
    }

    setConfirmation(null);

    fetchUsers(
      activeStatus,
      currentPage
    );
  };

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

  return (
    <DashboardLayout
      title="Users"
      subtitle="View and manage users under your enterprise."
    >
      <div className="space-y-5">
        {/* Status Tabs */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-1 rounded-xl border border-gray-200 bg-white p-1 shadow-sm">
            {statusTabs.map((tab) => {
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
            })}
          </div>
        </div>

        {isLoading ? (
          <div className="rounded-xl border border-gray-200 bg-white px-6 py-12 text-center shadow-sm">
            <p className="text-sm text-gray-500">
              Loading users...
            </p>
          </div>
        ) : users.length > 0 ? (
          <UserList
            users={users}
            onUserClick={
              handleViewUser
            }
            actions={getActionsForUser}
            loggedInUserId={
              loggedInUserId
            }
            pagination={pagination}
            onPageChange={
              handlePageChange
            }
            onPageSizeChange={
              handlePageSizeChange
            }
            emptyTitle="No Users"
            emptyDescription="There are currently no users under your enterprise."
          />
        ) : (
          <div className="rounded-xl border border-gray-200 bg-white px-6 py-12 text-center shadow-sm">
            <h3 className="text-base font-semibold text-gray-900">
              No Users Found
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              There are currently no users
              matching the selected status.
            </p>
          </div>
        )}
      </div>

      <UserDetailsModal
        open={Boolean(selectedUser)}
        user={selectedUser}
        onClose={() =>
          setSelectedUser(null)
        }
      />

      <ConfirmationModal
        isOpen={Boolean(confirmation)}
        title={
          confirmation?.title ||
          "Confirm Action"
        }
        message={
          confirmation?.message ||
          ""
        }
        confirmText={
          confirmation?.confirmText ||
          "Confirm"
        }
        cancelText="Cancel"
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