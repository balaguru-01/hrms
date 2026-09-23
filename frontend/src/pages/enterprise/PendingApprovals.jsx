import { useMemo, useState } from "react";

import DashboardLayout from "../../components/layout/DashboardLayout";

import PendingToolbar from "../../components/approval/PendingToolbar";
import PendingStats from "../../components/approval/PendingStats";
import PendingFilter from "../../components/approval/PendingFilter";
import PendingTable from "../../components/approval/PendingTable";
import PendingPagination from "../../components/approval/PendingPagination";
import PendingTableSkeleton from "../../components/approval/PendingTableSkeleton";
import PendingEmptyState from "../../components/approval/PendingEmptyState";
import ViewRequestModal from "../../components/approval/ViewRequestModal";
import ApproveTenantModal from "../../components/approval/ApproveTenantModal";
import RejectTenantModal from "../../components/approval/RejectTenantModal";

const initialRequests = [
  {
    id: 1,
    organization: "Acme Corporation",
    contact: "John David",
    email: "admin@acme.com",
    phone: "+91 9876543210",
    requestedOn: "12 Aug 2026",
    status: "Pending",
  },
  {
    id: 2,
    organization: "TechNova Pvt Ltd",
    contact: "Michael Roy",
    email: "contact@technova.com",
    phone: "+91 9845621458",
    requestedOn: "11 Aug 2026",
    status: "Pending",
  },
  {
    id: 3,
    organization: "GreenLeaf Solutions",
    contact: "Sara Wilson",
    email: "admin@greenleaf.com",
    phone: "+91 9784512365",
    requestedOn: "09 Aug 2026",
    status: "Pending",
  },
];

const PendingApprovals = () => {
  const [requests, setRequests] = useState(() => {
    const savedRequests = JSON.parse(
      localStorage.getItem(
        "pendingRequests"
      ) || "[]"
    );

    return [
      ...initialRequests,
      ...savedRequests,
    ];
  });

  const [loading] = useState(false);

  const [search, setSearch] =
    useState("");

  const [selectedFilter, setSelectedFilter] =
    useState("All");

  const [currentPage, setCurrentPage] =
    useState(1);

  const ITEMS_PER_PAGE = 5;

  const [selectedRequest, setSelectedRequest] =
    useState(null);

  const [viewOpen, setViewOpen] =
    useState(false);

  const [approveOpen, setApproveOpen] =
    useState(false);

  const [rejectOpen, setRejectOpen] =
    useState(false);

  const [rejectReason, setRejectReason] =
    useState("");

  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      const matchesSearch =
        request.organization
          .toLowerCase()
          .includes(
            search.toLowerCase()
          );

      const matchesFilter =
        selectedFilter === "All"
          ? true
          : request.status ===
            selectedFilter;

      return (
        matchesSearch &&
        matchesFilter
      );
    });
  }, [
    requests,
    search,
    selectedFilter,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredRequests.length /
        ITEMS_PER_PAGE
    )
  );

  const paginatedRequests =
    filteredRequests.slice(
      (currentPage - 1) *
        ITEMS_PER_PAGE,
      currentPage *
        ITEMS_PER_PAGE
    );

  // ----------------------
  // APPROVE
  // ----------------------

  const handleApprove = () => {
    if (!selectedRequest) {
      return;
    }

    const updatedRequests =
      requests.map((item) =>
        item.id === selectedRequest.id
          ? {
              ...item,
              status: "Approved",
            }
          : item
      );

    setRequests(updatedRequests);

    // Save updated status
    const savedRequests = JSON.parse(
      localStorage.getItem(
        "pendingRequests"
      ) || "[]"
    );

    const updatedSavedRequests =
      savedRequests.map((item) =>
        item.id === selectedRequest.id
          ? {
              ...item,
              status: "Approved",
            }
          : item
      );

    localStorage.setItem(
      "pendingRequests",
      JSON.stringify(
        updatedSavedRequests
      )
    );

    setApproveOpen(false);

    setSelectedRequest(null);
  };

  // ----------------------
  // REJECT
  // ----------------------

  const handleReject = () => {
    if (!selectedRequest) {
      return;
    }

    const updatedRequests =
      requests.map((item) =>
        item.id === selectedRequest.id
          ? {
              ...item,
              status: "Rejected",
              rejectReason,
            }
          : item
      );

    setRequests(updatedRequests);

    // Save updated status
    const savedRequests = JSON.parse(
      localStorage.getItem(
        "pendingRequests"
      ) || "[]"
    );

    const updatedSavedRequests =
      savedRequests.map((item) =>
        item.id === selectedRequest.id
          ? {
              ...item,
              status: "Rejected",
              rejectReason,
            }
          : item
      );

    localStorage.setItem(
      "pendingRequests",
      JSON.stringify(
        updatedSavedRequests
      )
    );

    setRejectReason("");

    setRejectOpen(false);

    setSelectedRequest(null);
  };

  return (
    <DashboardLayout
      title="Pending Approvals"
      subtitle="Review tenant registration requests awaiting approval."
    >
      <div className="space-y-8">

        <PendingToolbar
          search={search}
          onSearch={(e) => {
            setSearch(
              e.target.value
            );

            setCurrentPage(1);
          }}
        />

        <PendingStats
          requests={requests}
        />

        <PendingFilter
          selectedFilter={
            selectedFilter
          }
          onFilterChange={(filter) => {
            setSelectedFilter(
              filter
            );

            setCurrentPage(1);
          }}
        />

        {loading ? (
          <PendingTableSkeleton />
        ) : filteredRequests.length >
          0 ? (
          <>
            <PendingTable
              requests={
                paginatedRequests
              }

              onView={(request) => {
                setSelectedRequest(
                  request
                );

                setViewOpen(true);
              }}

              onApprove={(request) => {
                setSelectedRequest(
                  request
                );

                setApproveOpen(true);
              }}

              onReject={(request) => {
                setSelectedRequest(
                  request
                );

                setRejectOpen(true);
              }}
            />

            <PendingPagination
              currentPage={
                currentPage
              }

              totalPages={
                totalPages
              }

              totalItems={
                filteredRequests.length
              }

              pageSize={
                ITEMS_PER_PAGE
              }

              onPageChange={
                setCurrentPage
              }
            />
          </>
        ) : (
          <PendingEmptyState
            title="No Requests"
            description="There are no tenant requests in this category."
          />
        )}

      </div>

      {/* View Request */}

      <ViewRequestModal
        open={viewOpen}
        request={selectedRequest}
        onClose={() =>
          setViewOpen(false)
        }
      />

      {/* Approve */}

      <ApproveTenantModal
        open={approveOpen}
        tenant={selectedRequest}
        onClose={() =>
          setApproveOpen(false)
        }
        onApprove={handleApprove}
      />

      {/* Reject */}

      <RejectTenantModal
        open={rejectOpen}
        tenant={selectedRequest}
        reason={rejectReason}
        onReasonChange={(e) =>
          setRejectReason(
            e.target.value
          )
        }
        onClose={() => {
          setRejectOpen(false);
          setRejectReason("");
        }}
        onReject={handleReject}
      />

    </DashboardLayout>
  );
};

export default PendingApprovals;