import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { MdVisibility } from "react-icons/md";

import DashboardLayout from "../../components/layout/DashboardLayout";

import DynamicTable from "../../components/tables/DynamicTable";
import DynamicPagination from "../../components/tables/DynamicPagination";
import DynamicDetailsModal from "../../components/Modals/DynamicDetailsModal";

import { useEnterpriseUsers } from "../../context/EnterpriseUserContext";

const PAGE_SIZE_OPTIONS = [10, 20, 30, 50];

const RejectedRequests = () => {
  const navigate = useNavigate();

  const {
    rejectedRequests,
    rejectedRequestsPagination,
    fetchRejectedRequests,
  } = useEnterpriseUsers();

  const [
    selectedRequest,
    setSelectedRequest,
  ] = useState(null);

  const handleViewRequest = (request) => {
    setSelectedRequest(request);
  };

  const handlePageChange = (page) => {
    if (
      page < 1 ||
      page >
        rejectedRequestsPagination.totalPages ||
      page ===
        rejectedRequestsPagination.currentPage
    ) {
      return;
    }

    fetchRejectedRequests(
      page,
      rejectedRequestsPagination.pageSize
    );
  };

  const handlePageSizeChange = (newPageSize) => {
    if (
      !PAGE_SIZE_OPTIONS.includes(newPageSize) ||
      newPageSize ===
        rejectedRequestsPagination.pageSize
    ) {
      return;
    }

    fetchRejectedRequests(1, newPageSize);
  };

  const columns = useMemo(
    () => [
      {
        key: "user",
        header: "User",
        width: "28%",
        render: (request) => {
          const fullName =
            `${request?.firstName || ""} ${
              request?.lastName || ""
            }`.trim();

          return (
            <button
              type="button"
              onClick={() =>
                handleViewRequest(request)
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
                  bg-red-100
                  text-sm
                  font-semibold
                  text-red-700
                "
              >
                {(
                  request?.firstName?.[0] || ""
                ).toUpperCase()}
                {(
                  request?.lastName?.[0] || ""
                ).toUpperCase()}
              </div>

              <div className="min-w-0">
                <p
                  className="
                    truncate
                    text-sm
                    font-medium
                    text-gray-900
                  "
                >
                  {fullName ||
                    "Unknown User"}
                </p>

                {request?.designation && (
                  <p
                    className="
                      mt-0.5
                      truncate
                      text-xs
                      text-gray-500
                    "
                  >
                    {request.designation}
                  </p>
                )}
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
          "break-all text-gray-600",
      },

      {
        key: "role",
        header: "Role",
        width: "18%",
        accessor: "role",
        cellClassName:
          "text-gray-600",
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
              items-center
              rounded-full
              bg-red-50
              px-3
              py-1
              text-xs
              font-medium
              text-red-700
            "
          >
            Rejected
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
        render: (request) => (
          <button
            type="button"
            onClick={() =>
              handleViewRequest(request)
            }
            title="View Request"
            aria-label="View Request"
            className="
              inline-flex
              h-9
              w-9
              items-center
              justify-center
              rounded-lg
              border
              border-gray-200
              text-gray-500
              transition
              hover:border-gray-300
              hover:bg-gray-50
              hover:text-gray-700
            "
          >
            <MdVisibility size={18} />
          </button>
        ),
      },
    ],
    []
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
      key: "rejectionReason",
      label: "Rejection Reason",
      fullWidth: true,
    },
    {
      key: "rejectedAt",
      label: "Rejected At",
      type: "date",
      show: (request) =>
        Boolean(request?.rejectedAt),
    },
    {
      key: "registeredAt",
      label: "Registered At",
      type: "date",
      show: (request) =>
        Boolean(request?.registeredAt),
    },
  ];

  const currentPage =
    rejectedRequestsPagination.currentPage;

  const totalPages =
    rejectedRequestsPagination.totalPages;

  const totalRequests =
    rejectedRequestsPagination.totalUsers;

  const pageSize =
    rejectedRequestsPagination.pageSize;

  return (
    <DashboardLayout
      title="Rejected Requests"
      subtitle="View registration requests that were declined by the enterprise."
    >
      <div className="space-y-5">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Rejected Requests
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {totalRequests} rejected request
              {totalRequests !== 1
                ? "s"
                : ""}
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate(-1)}
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

        {/* Rejected Requests Table */}
        <DynamicTable
          columns={columns}
          data={rejectedRequests}
          rowKey="id"
          minWidth="900px"
          className="overflow-visible"
          emptyTitle="No Rejected Requests"
          emptyDescription="No user registration requests have been rejected."
        />

        {/* Pagination */}
        <DynamicPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalRequests}
          pageSize={pageSize}
          pageSizeOptions={PAGE_SIZE_OPTIONS}
          onPageChange={handlePageChange}
          onPageSizeChange={
            handlePageSizeChange
          }
          itemLabel="rejected requests"
        />
      </div>

      {/* User Details Modal */}
      <DynamicDetailsModal
        open={Boolean(selectedRequest)}
        title="User Details"
        subtitle="View rejected user's registration information"
        data={selectedRequest}
        fields={userDetailFields}
        avatar={
          `${
            selectedRequest?.firstName?.[0] ||
            ""
          }${
            selectedRequest?.lastName?.[0] ||
            ""
          }`.toUpperCase() || "U"
        }
        onClose={() =>
          setSelectedRequest(null)
        }
      />
    </DashboardLayout>
  );
};

export default RejectedRequests;