import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getSentInvitations,
  getUsers,
} from "../api/enterpriseUserApi";

/*
 * Temporary mock data
 *
 * These are kept for invitation-related UI
 * and fallback/action compatibility.
 *
 * User lists are now fetched from the backend.
 */
const initialActiveUsers = [];

const initialInvitations = [];

const initialPendingApprovals = [];

const initialRejectedRequests = [];

const EnterpriseUserContext =
  createContext(null);

export const EnterpriseUserProvider = ({
  children,
}) => {
  /*
   * User data
   */
  const [activeUsers, setActiveUsers] =
    useState(initialActiveUsers);

  const [invitations, setInvitations] =
    useState(initialInvitations);

  const [
    pendingApprovals,
    setPendingApprovals,
  ] = useState(initialPendingApprovals);

  const [
    rejectedRequests,
    setRejectedRequests,
  ] = useState(
    initialRejectedRequests
  );

  const [inactiveUsers, setInactiveUsers] =
    useState([]);

  /*
   * Pagination information for each
   * user status.
   *
   * The backend handles the actual
   * pagination using page + limit.
   */
  const [
    activeUsersPagination,
    setActiveUsersPagination,
  ] = useState({
    currentPage: 1,
    pageSize: 10,
    totalUsers: 0,
    totalPages: 0,
  });

  const [
    pendingApprovalsPagination,
    setPendingApprovalsPagination,
  ] = useState({
    currentPage: 1,
    pageSize: 10,
    totalUsers: 0,
    totalPages: 0,
  });

  const [
    rejectedRequestsPagination,
    setRejectedRequestsPagination,
  ] = useState({
    currentPage: 1,
    pageSize: 10,
    totalUsers: 0,
    totalPages: 0,
  });

  /*
   * Pagination information for
   * sent invitations.
   */
  const [
    sentInvitationsPagination,
    setSentInvitationsPagination,
  ] = useState({
    currentPage: 1,
    pageSize: 10,
    totalInvitations: 0,
    totalPages: 0,
  });

  /*
   * Dashboard statistics
   */
  const [
    dashboardStats,
    setDashboardStats,
  ] = useState({
    activeUsers: 0,
    invitationsSent: 0,
    pendingApprovals: 0,
    rejectedRequests: 0,
  });

  /*
   * Default page size
   */
  const PAGE_SIZE = 10;

  /*
   * Normalize backend user data so
   * existing frontend components can
   * continue using the same structure.
   */
  const normalizeUser = useCallback(
    (user) => {
      if (!user) {
        return null;
      }

      const formatDate = (date) => {
        if (!date) {
          return "";
        }

        const parsedDate =
          new Date(date);

        if (
          Number.isNaN(
            parsedDate.getTime()
          )
        ) {
          return "";
        }

        return parsedDate.toLocaleDateString(
          "en-GB",
          {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }
        );
      };

      return {
        id: user._id,
        firstName:
          user.firstName || "",
        lastName:
          user.lastName || "",
        email:
          user.email || "",
        role:
          user.role?.name || "",
        designation:
          user.designation || "",
        phone:
          user.phone || "",
        location:
          user.location || "",
        status:
          user.status?.toLowerCase() ||
          "",
        joinedAt:
          formatDate(
            user.joiningDate
          ),
        registeredAt:
          formatDate(
            user.createdAt
          ),
        updatedAt:
          user.updatedAt,
      };
    },
    []
  );

  /*
   * Fetch users for a specific status
   * and page.
   *
   * This function is reusable by:
   * - Active Users
   * - Pending Users
   * - Rejected Users
   * - All Users
   */
  const fetchUsersByStatus =
    useCallback(
      async ({
        status,
        page = 1,
        limit = PAGE_SIZE,
      }) => {
        try {
          const response =
            await getUsers({
              scope: "enterprise",
              status,
              page,
              limit,
            });

          const fetchedUsers =
            response?.data?.users ||
            [];

          const fetchedPagination =
            response?.data
              ?.pagination || {
              currentPage: page,
              pageSize: limit,
              totalUsers: 0,
              totalPages: 0,
            };

          const normalizedUsers =
            fetchedUsers
              .map(
                normalizeUser
              )
              .filter(Boolean);

          return {
            users: normalizedUsers,
            pagination:
              fetchedPagination,
          };
        } catch (error) {
          console.error(
            `Unable to fetch ${status || "all"} users:`,
            error
          );

          throw error;
        }
      },
      [normalizeUser]
    );

  /*
   * Fetch Active Users
   */
  const fetchActiveUsers =
    useCallback(
      async (
        page = 1,
        limit = PAGE_SIZE
      ) => {
        try {
          const result =
            await fetchUsersByStatus({
              status: "Active",
              page,
              limit,
            });

          setActiveUsers(
            result.users
          );

          setActiveUsersPagination(
            result.pagination
          );

          return result;
        } catch (error) {
          setActiveUsers([]);

          setActiveUsersPagination({
            currentPage: 1,
            pageSize:
              limit,
            totalUsers: 0,
            totalPages: 0,
          });

          return null;
        }
      },
      [fetchUsersByStatus]
    );

  /*
   * Fetch Pending Users
   */
  const fetchPendingApprovals =
    useCallback(
      async (
        page = 1,
        limit = PAGE_SIZE
      ) => {
        try {
          const result =
            await fetchUsersByStatus({
              status: "Pending",
              page,
              limit,
            });

          setPendingApprovals(
            result.users
          );

          setPendingApprovalsPagination(
            result.pagination
          );

          return result;
        } catch (error) {
          setPendingApprovals([]);

          setPendingApprovalsPagination({
            currentPage: 1,
            pageSize:
              limit,
            totalUsers: 0,
            totalPages: 0,
          });

          return null;
        }
      },
      [fetchUsersByStatus]
    );

  /*
   * Fetch Rejected Users
   */
  const fetchRejectedRequests =
    useCallback(
      async (
        page = 1,
        limit = PAGE_SIZE
      ) => {
        try {
          const result =
            await fetchUsersByStatus({
              status: "Rejected",
              page,
              limit,
            });

          setRejectedRequests(
            result.users
          );

          setRejectedRequestsPagination(
            result.pagination
          );

          return result;
        } catch (error) {
          setRejectedRequests([]);

          setRejectedRequestsPagination({
            currentPage: 1,
            pageSize:
              limit,
            totalUsers: 0,
            totalPages: 0,
          });

          return null;
        }
      },
      [fetchUsersByStatus]
    );

  /*
   * Fetch Sent Invitations
   *
   * Backend handles pagination using
   * page + limit.
   */
  const fetchSentInvitations =
    useCallback(
      async (
        page = 1,
        limit = PAGE_SIZE
      ) => {
        try {
          const response =
            await getSentInvitations({
              page,
              limit,
            });

          const fetchedInvitations =
            response?.data?.invitations ||
            [];

          const fetchedPagination =
            response?.data
              ?.pagination || {
              currentPage: page,
              pageSize: limit,
              totalInvitations: 0,
              totalPages: 0,
            };

          setInvitations(
            fetchedInvitations
          );

          setSentInvitationsPagination(
            fetchedPagination
          );

          return {
            invitations:
              fetchedInvitations,
            pagination:
              fetchedPagination,
          };
        } catch (error) {
          console.error(
            "Unable to fetch sent invitations:",
            error
          );

          setInvitations([]);

          setSentInvitationsPagination({
            currentPage: 1,
            pageSize: limit,
            totalInvitations: 0,
            totalPages: 0,
          });

          return null;
        }
      },
      []
    );

  /*
   * Fetch dashboard statistics.
   *
   * IMPORTANT:
   * We cannot calculate these values
   * using users.length anymore because
   * the backend returns only one page.
   *
   * Instead, each status request returns
   * totalUsers from the backend.
   */
  const fetchDashboardStats =
    useCallback(
      async () => {
        try {
          const [
            activeResponse,
            pendingResponse,
            rejectedResponse,
            invitationsResponse,
          ] =
            await Promise.all([
              getUsers({
                scope:
                  "enterprise",
                status:
                  "Active",
                page: 1,
                limit: 1,
              }),

              getUsers({
                scope:
                  "enterprise",
                status:
                  "Pending",
                page: 1,
                limit: 1,
              }),

              getUsers({
                scope:
                  "enterprise",
                status:
                  "Rejected",
                page: 1,
                limit: 1,
              }),

              getSentInvitations(),
            ]);

          const activeTotal =
            activeResponse?.data
              ?.pagination
              ?.totalUsers || 0;

          const pendingTotal =
            pendingResponse?.data
              ?.pagination
              ?.totalUsers || 0;

          const rejectedTotal =
            rejectedResponse?.data
              ?.pagination
              ?.totalUsers || 0;

          const invitationsTotal =
            invitationsResponse
              ?.data?.pagination
              ?.totalInvitations ||
            0;

          setDashboardStats({
            activeUsers:
              activeTotal,

            pendingApprovals:
              pendingTotal,

            rejectedRequests:
              rejectedTotal,

            invitationsSent:
              invitationsTotal,
          });
        } catch (error) {
          console.error(
            "Failed to fetch dashboard statistics:",
            error
          );
        }
      },
      []
    );

  /*
   * Fetch initial user data and
   * dashboard statistics.
   */
  useEffect(() => {
    fetchActiveUsers(1);
    fetchPendingApprovals(1);
    fetchRejectedRequests(1);
    fetchSentInvitations(1);
    fetchDashboardStats();
  }, [
    fetchActiveUsers,
    fetchPendingApprovals,
    fetchRejectedRequests,
    fetchSentInvitations,
    fetchDashboardStats,
  ]);

  /*
   * Refresh dashboard statistics
   */
  const refreshDashboardStats =
    async () => {
      await fetchDashboardStats();
    };

  /*
   * Add invitation
   *
   * Kept temporarily for the existing
   * invitation UI.
   */
  const addInvitation = ({
    email,
    role,
    designation,
  }) => {
    const invitation = {
      id: `inv-${Date.now()}`,
      email,
      role,
      designation,
      invitedAt:
        new Date().toLocaleString(
          "en-IN",
          {
            dateStyle: "medium",
            timeStyle: "short",
          }
        ),
      expiresAt:
        new Date(
          Date.now() +
            24 *
              60 *
              60 *
              1000
        ).toLocaleString(
          "en-IN",
          {
            dateStyle: "medium",
            timeStyle: "short",
          }
        ),
      status: "sent",
    };

    setInvitations(
      (previous) => [
        invitation,
        ...previous,
      ]
    );
  };

  /*
   * Cancel invitation
   */
  const cancelInvitation = (
    invitationId
  ) => {
    setInvitations(
      (previous) =>
        previous.filter(
          (invitation) =>
            invitation.id !==
            invitationId
        )
    );
  };

  /*
   * Approve user
   *
   * API integration will be connected
   * later. For now this keeps the
   * existing frontend behaviour.
   */
  const approveUser = (
    userId
  ) => {
    setPendingApprovals(
      (previous) => {
        const user =
          previous.find(
            (item) =>
              item.id ===
              userId
          );

        if (!user) {
          return previous;
        }

        const approvedUser = {
          ...user,
          status: "active",
          joinedAt:
            new Date().toLocaleDateString(
              "en-IN",
              {
                day: "2-digit",
                month: "short",
                year: "numeric",
              }
            ),
        };

        setActiveUsers(
          (current) => [
            approvedUser,
            ...current,
          ]
        );

        return previous.filter(
          (item) =>
            item.id !== userId
        );
      }
    );
  };

  /*
   * Reject user
   *
   * API integration will be connected
   * later. For now this keeps the
   * existing frontend behaviour.
   */
  const rejectUser = (
    userId,
    rejectionReason =
      "Registration request was rejected."
  ) => {
    setPendingApprovals(
      (previous) => {
        const user =
          previous.find(
            (item) =>
              item.id ===
              userId
          );

        if (!user) {
          return previous;
        }

        const rejectedUser = {
          ...user,
          status: "rejected",
          rejectedAt:
            new Date().toLocaleString(
              "en-IN",
              {
                dateStyle:
                  "medium",
                timeStyle:
                  "short",
              }
            ),
          rejectionReason,
        };

        setRejectedRequests(
          (current) => [
            rejectedUser,
            ...current,
          ]
        );

        return previous.filter(
          (item) =>
            item.id !== userId
        );
      }
    );
  };

  /*
   * Remove active user
   *
   * API integration will be connected
   * later.
   */
  const removeUser = (
    userId
  ) => {
    setActiveUsers(
      (previous) =>
        previous.filter(
          (user) =>
            user.id !== userId
        )
    );
  };

  /*
   * Make user inactive
   *
   * API integration will be connected
   * later.
   */
  const makeInactiveUser = (
    userId
  ) => {
    setActiveUsers(
      (previous) => {
        const user =
          previous.find(
            (item) =>
              item.id ===
              userId
          );

        if (!user) {
          return previous;
        }

        const inactiveUser = {
          ...user,
          status: "inactive",
        };

        setInactiveUsers(
          (current) => [
            inactiveUser,
            ...current,
          ]
        );

        return previous.filter(
          (item) =>
            item.id !== userId
        );
      }
    );
  };

  /*
   * Dashboard statistics
   */
  const stats = useMemo(
    () => ({
      activeUsers:
        dashboardStats.activeUsers,

      invitationsSent:
        dashboardStats.invitationsSent,

      pendingApprovals:
        dashboardStats.pendingApprovals,

      rejectedRequests:
        dashboardStats.rejectedRequests,
    }),
    [dashboardStats]
  );

  const value = {
    /*
     * User data
     */
    activeUsers,

    /*
     * Existing invitation state
     *
     * Keep this unchanged for existing
     * components that already use
     * `invitations`.
     */
    invitations,

    /*
     * Sent invitation state
     *
     * Expose the same state using the
     * name expected by InvitationsSent.
     */
    sentInvitations: invitations,

    pendingApprovals,
    rejectedRequests,
    inactiveUsers,

    /*
     * Pagination
     */
    activeUsersPagination,
    pendingApprovalsPagination,
    rejectedRequestsPagination,
    sentInvitationsPagination,

    /*
     * User fetching functions
     */
    fetchUsersByStatus,
    fetchActiveUsers,
    fetchPendingApprovals,
    fetchRejectedRequests,

    /*
     * Sent invitations fetching
     */
    fetchSentInvitations,

    /*
     * Dashboard statistics
     */
    stats,
    refreshDashboardStats,

    /*
     * Existing invitation actions
     */
    addInvitation,
    cancelInvitation,

    /*
     * Existing user actions
     */
    approveUser,
    rejectUser,
    removeUser,
    makeInactiveUser,
  };

  return (
    <EnterpriseUserContext.Provider
      value={value}
    >
      {children}
    </EnterpriseUserContext.Provider>
  );
};

export const useEnterpriseUsers =
  () => {
    const context =
      useContext(
        EnterpriseUserContext
      );

    if (!context) {
      throw new Error(
        "useEnterpriseUsers must be used within an EnterpriseUserProvider"
      );
    }

    return context;
  };

export default EnterpriseUserContext;