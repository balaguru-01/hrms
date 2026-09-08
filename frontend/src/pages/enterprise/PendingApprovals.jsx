import {
  useCallback,
  useMemo,
  useState,
} from "react";

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

const PendingApprovals = () => {
  const { showToast } = useToast();

  const {
    pendingApprovals,
    pendingApprovalsPagination,
    fetchPendingApprovals,
    approveUser,
    rejectUser,
  } = useEnterpriseUsers();

  const [search, setSearch] = useState("");

  const [selectedFilter, setSelectedFilter] =
    useState("All");

  const [selectedRequest, setSelectedRequest] =
    useState(null);

  const [confirmation, setConfirmation] =
    useState(null);

  const [rejectReason, setRejectReason] =
    useState("");

  /*
   * Filter the currently loaded pending users
   * using the existing search and status filter
   * behaviour.
   */
  const filteredRequests = useMemo(() => {
    const normalizedSearch =
      search.trim().toLowerCase();

    return pendingApprovals.filter(
      (request) => {
        const organization =
          request?.organization ||
          request?.tenant?.orgName ||
          "";

        const fullName =
          `${request?.firstName || ""} ${
            request?.lastName || ""
          }`.trim();

        const email =
          request?.email || "";

        const matchesSearch =
          !normalizedSearch ||
          organization
            .toLowerCase()
            .includes(normalizedSearch) ||
          fullName
            .toLowerCase()
            .includes(normalizedSearch) ||
          email
            .toLowerCase()
            .includes(normalizedSearch);

        const requestStatus =
          request?.status
            ?.toLowerCase() || "";

        const matchesFilter =
          selectedFilter === "All"
            ? true
            : requestStatus ===
              selectedFilter.toLowerCase();

        return (
          matchesSearch &&
          matchesFilter
        );
      }
    );
  }, [
    pendingApprovals,
    search,
    selectedFilter,
  ]);

  /*
   * Open the user details modal.
   */
  const handleViewRequest = useCallback(
    (request) => {
      setSelectedRequest(request);
    },
    []
  );

  /*
   * Open approval confirmation modal.
   */
  const handleApprove = useCallback(
    (request) => {
      setConfirmation({
        type: "approve",
        user: request,
        title: "Approve User",
        description: `Are you sure you want to approve ${request.firstName} ${request.lastName}?`,
        confirmLabel: "Approve User",
      });
    },
    []
  );

  /*
   * Open rejection confirmation modal
   * and reset the rejection reason.
   */
  const handleReject = useCallback(
    (request) => {
      setRejectReason("");

      setConfirmation({
        type: "reject",
        user: request,
        title: "Reject User",
        description: `Are you sure you want to reject ${request.firstName} ${request.lastName}?`,
        confirmLabel: "Reject User",
      });
    },
    []
  );

  /*
   * Execute the confirmed action.
   */
  const handleConfirmAction =
    useCallback(() => {
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

      if (type === "approve") {
        approveUser(user.id);

        showToast(
          `${fullName} has been approved.`,
          "success"
        );
      }

      if (type === "reject") {
        rejectUser(
          user.id,
          rejectReason.trim() ||
            "Registration request was rejected."
        );

        showToast(
          `${fullName} has been rejected.`,
          "success"
        );
      }

      setConfirmation(null);
      setSelectedRequest(null);
      setRejectReason("");
    }, [
      confirmation,
      approveUser,
      rejectUser,
      rejectReason,
      showToast,
    ]);

  /*
   * Backend pagination.
   */
  const handlePageChange = useCallback(
    (page) => {
      if (
        page < 1 ||
        page >
          pendingApprovalsPagination.totalPages ||
        page ===
          pendingApprovalsPagination.currentPage
      ) {
        return;
      }

      fetchPendingApprovals(
        page,
        pendingApprovalsPagination.pageSize
      );
    },
    [
      pendingApprovalsPagination,
      fetchPendingApprovals,
    ]
  );

  /*
   * Change backend page size and
   * restart from page one.
   */
  const handlePageSizeChange =
    useCallback(
      (newPageSize) => {
        if (
          !PAGE_SIZE_OPTIONS.includes(
            newPageSize
          ) ||
          newPageSize ===
            pendingApprovalsPagination.pageSize
        ) {
          return;
        }

        fetchPendingApprovals(
          1,
          newPageSize
        );
      },
      [
        pendingApprovalsPagination.pageSize,
        fetchPendingApprovals,
      ]
    );

  /*
   * Reusable table column configuration.
   */
  const columns = useMemo(
    () => [
      {
        key: "user",
        header: "User",
        width: "28%",

        render: (user) => {
          const fullName =
            `${user?.firstName || ""} ${
              user?.lastName || ""
            }`.trim();

          return (
            <button
              type="button"
              onClick={() =>
                handleViewRequest(user)
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
                  bg-yellow-100
                  font-semibold
                  text-yellow-700
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
              bg-yellow-50
              px-3
              py-1
              text-xs
              font-medium
              text-yellow-700
            "
          >
            Pending
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
                type: "approve",
                label: "Approve User",
                onClick:
                  handleApprove,
              },
              {
                type: "reject",
                label: "Reject User",
                onClick:
                  handleReject,
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
      handleViewRequest,
      handleApprove,
      handleReject,
    ]
  );

  /*
   * User details configuration.
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
      key: "registeredAt",
      label: "Registered At",
      type: "date",
      show: (user) =>
        Boolean(user?.registeredAt),
    },
  ];

  const currentPage =
    pendingApprovalsPagination.currentPage;

  const totalPages =
    pendingApprovalsPagination.totalPages;

  const totalUsers =
    pendingApprovalsPagination.totalUsers;

  const pageSize =
    pendingApprovalsPagination.pageSize;

  return (
    <DashboardLayout
      title="Pending Approvals"
      subtitle="Review user registration requests awaiting approval."
    >
      <div className="space-y-8">

        {/* Search */}
        <div
          className="
            flex
            flex-col
            gap-4
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Pending Users
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Review and manage registration requests.
            </p>
          </div>

          <div className="w-full sm:w-80">
            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search users..."
              className="
                w-full
                rounded-lg
                border
                border-gray-300
                bg-white
                px-4
                py-2.5
                text-sm
                text-gray-700
                outline-none
                transition
                placeholder:text-gray-400
                focus:border-green-500
                focus:ring-1
                focus:ring-green-500
              "
            />
          </div>
        </div>

        {/* Statistics */}
        <div
          className="
            grid
            grid-cols-1
            gap-4
            sm:grid-cols-2
            lg:grid-cols-3
          "
        >
          <div
            className="
              rounded-xl
              border
              border-gray-200
              bg-white
              p-5
              shadow-sm
            "
          >
            <p className="text-sm text-gray-500">
              Pending Requests
            </p>

            <p className="mt-2 text-2xl font-semibold text-gray-900">
              {pendingApprovals.length}
            </p>
          </div>

          <div
            className="
              rounded-xl
              border
              border-gray-200
              bg-white
              p-5
              shadow-sm
            "
          >
            <p className="text-sm text-gray-500">
              Showing
            </p>

            <p className="mt-2 text-2xl font-semibold text-yellow-600">
              {filteredRequests.length}
            </p>
          </div>

          <div
            className="
              rounded-xl
              border
              border-gray-200
              bg-white
              p-5
              shadow-sm
            "
          >
            <p className="text-sm text-gray-500">
              Current Page
            </p>

            <p className="mt-2 text-2xl font-semibold text-gray-900">
              {currentPage}
            </p>
          </div>
        </div>

        {/* Status Filter */}
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
            <h3 className="text-sm font-semibold text-gray-800">
              Filter Requests
            </h3>

            <p className="mt-1 text-xs text-gray-500">
              Filter pending requests by status.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              "All",
              "Pending",
            ].map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() =>
                  setSelectedFilter(
                    filter
                  )
                }
                className={`
                  rounded-lg
                  px-4
                  py-2
                  text-sm
                  font-medium
                  transition
                  ${
                    selectedFilter ===
                    filter
                      ? "bg-green-600 text-white"
                      : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                  }
                `}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Pending Users Table */}
        <DynamicTable
          columns={columns}
          data={filteredRequests}
          rowKey="id"
          minWidth="900px"
          className="overflow-visible"
          emptyTitle="No Pending Requests"
          emptyDescription="All user registration requests have been reviewed."
        />

        {/* Backend Pagination */}
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
          itemLabel="pending users"
        />
      </div>

      {/* User Details */}
      <DynamicDetailsModal
        open={Boolean(selectedRequest)}
        title="User Details"
        subtitle="Review user's registration information"
        data={selectedRequest}
        fields={userDetailFields}
        avatar={
          selectedRequest?.firstName
            ?.charAt(0)
            .toUpperCase() || "U"
        }
        onClose={() =>
          setSelectedRequest(null)
        }
      />

      {/* Confirmation */}
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

        /*
         * Show rejection reason only
         * when rejecting a user.
         */
        showInput={
          confirmation?.type ===
          "reject"
        }
        inputLabel="Rejection Reason"
        inputValue={rejectReason}
        inputPlaceholder="Enter the reason for rejecting this user..."
        onInputChange={
          setRejectReason
        }
        inputRequired={
          confirmation?.type ===
          "reject"
        }

        onConfirm={
          handleConfirmAction
        }

        onCancel={() => {
          setConfirmation(null);
          setRejectReason("");
        }}
      />
    </DashboardLayout>
  );
};

export default PendingApprovals;