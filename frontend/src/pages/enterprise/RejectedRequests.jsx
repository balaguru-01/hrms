import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { MdVisibility } from "react-icons/md";

import DashboardLayout from "../../components/layout/DashboardLayout";
import UserDetailsModal from "../../components/enterprise-user/UserDetailsModal";

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
      newPageSize === rejectedRequestsPagination.pageSize
    ) {
      return;
    }

    fetchRejectedRequests(1, newPageSize);
  };

  const currentPage =
    rejectedRequestsPagination.currentPage;

  const totalPages =
    rejectedRequestsPagination.totalPages;

  const totalRequests =
    rejectedRequestsPagination.totalUsers;

  const pageSize =
    rejectedRequestsPagination.pageSize;

  const startItem =
    totalRequests === 0
      ? 0
      : (currentPage - 1) * pageSize + 1;

  const endItem =
    totalRequests === 0
      ? 0
      : Math.min(
          currentPage * pageSize,
          totalRequests
        );

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
            className="self-start rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Back
          </button>
        </div>

        {/* Rejected Requests Table */}
        {rejectedRequests.length > 0 ? (
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            {/* Table Header */}
            <div
              className="
                hidden
                grid-cols-[1.5fr_1.3fr_1fr_0.8fr_90px]
                gap-0
                border-b
                border-gray-200
                bg-gray-50
                px-5
                py-3
                text-xs
                font-semibold
                uppercase
                tracking-wide
                text-gray-500
                md:grid
              "
            >
              <span className="flex items-center justify-center">
                User
              </span>

              <span className="flex items-center justify-center border-l border-gray-200">
                Email
              </span>

              <span className="flex items-center justify-center border-l border-gray-200">
                Role
              </span>

              <span className="flex items-center justify-center border-l border-gray-200">
                Status
              </span>

              <span className="flex items-center justify-center border-l border-gray-200">
                Quick Actions
              </span>
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-gray-100">
              {rejectedRequests.map(
                (request) => {
                  const fullName =
                    `${request.firstName || ""} ${
                      request.lastName || ""
                    }`.trim();

                  return (
                    <div
                      key={request.id}
                      className="
                        grid
                        grid-cols-1
                        gap-3
                        px-5
                        py-4
                        transition
                        hover:bg-gray-50
                        md:grid-cols-[1.5fr_1.3fr_1fr_0.8fr_90px]
                        md:items-center
                        md:gap-0
                      "
                    >
                      {/* User */}
                      <div className="flex items-center justify-start md:justify-center">
                        <button
                          type="button"
                          onClick={() =>
                            handleViewRequest(
                              request
                            )
                          }
                          className="flex w-full items-center gap-3 text-left md:w-auto"
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
                              request.firstName?.[0] ||
                              ""
                            ).toUpperCase()}
                            {(
                              request.lastName?.[0] ||
                              ""
                            ).toUpperCase()}
                          </div>

                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {fullName ||
                                "Unknown User"}
                            </p>

                            {request.designation && (
                              <p className="mt-0.5 text-xs text-gray-500">
                                {
                                  request.designation
                                }
                              </p>
                            )}
                          </div>
                        </button>
                      </div>

                      {/* Email */}
                      <div className="flex items-center justify-start border-gray-200 md:justify-center md:border-l">
                        <div className="w-full md:w-auto">
                          <span className="mb-1 block text-xs font-medium uppercase text-gray-400 md:hidden">
                            Email
                          </span>

                          <p className="break-all text-sm text-gray-600">
                            {request.email ||
                              "—"}
                          </p>
                        </div>
                      </div>

                      {/* Role */}
                      <div className="flex items-center justify-start border-gray-200 md:justify-center md:border-l">
                        <div className="w-full md:w-auto">
                          <span className="mb-1 block text-xs font-medium uppercase text-gray-400 md:hidden">
                            Role
                          </span>

                          <p className="text-sm text-gray-600">
                            {request.role ||
                              "—"}
                          </p>
                        </div>
                      </div>

                      {/* Status */}
                      <div className="flex items-center justify-start border-gray-200 md:justify-center md:border-l">
                        <div>
                          <span className="mb-1 block text-xs font-medium uppercase text-gray-400 md:hidden">
                            Status
                          </span>

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
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="flex items-center justify-start border-gray-200 md:justify-center md:border-l">
                        <div>
                          <span className="mb-1 block text-xs font-medium uppercase text-gray-400 md:hidden">
                            Quick Actions
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              handleViewRequest(
                                request
                              )
                            }
                            title="View Request"
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
                            <MdVisibility
                              size={18}
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-gray-200 bg-white px-6 py-12 text-center shadow-sm">
            <h3 className="text-base font-semibold text-gray-900">
              No Rejected Requests
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              No user registration requests
              have been rejected.
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalRequests > 0 && (
          <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white px-5 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
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
                {totalRequests}
              </span>{" "}
              rejected requests
            </p>

            {/* Pagination Controls */}
            <div className="flex items-center gap-3">
              {/* Rows Per Page */}
              <div className="flex items-center gap-2">
                <label
                  htmlFor="rejected-requests-rows-per-page"
                  className="text-sm text-gray-500"
                >
                  Rows per page:
                </label>

                <select
                  id="rejected-requests-rows-per-page"
                  value={pageSize}
                  onChange={(event) =>
                    handlePageSizeChange(
                      Number(event.target.value)
                    )
                  }
                  className="
                    rounded-lg
                    border
                    border-gray-300
                    bg-white
                    px-2
                    py-2
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

              {/* Previous */}
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() =>
                  handlePageChange(
                    currentPage - 1
                  )
                }
                className="
                  rounded-lg
                  border
                  border-gray-300
                  px-3
                  py-2
                  text-sm
                  font-medium
                  text-gray-700
                  transition
                  hover:bg-gray-50
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                Previous
              </button>

              {/* Page */}
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

              {/* Next */}
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
                className="
                  rounded-lg
                  border
                  border-gray-300
                  px-3
                  py-2
                  text-sm
                  font-medium
                  text-gray-700
                  transition
                  hover:bg-gray-50
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* User Details Modal */}
      <UserDetailsModal
        open={Boolean(selectedRequest)}
        user={selectedRequest}
        onClose={() =>
          setSelectedRequest(null)
        }
      />
    </DashboardLayout>
  );
};

export default RejectedRequests;