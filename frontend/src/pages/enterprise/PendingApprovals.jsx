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

const PAGE_SIZE_OPTIONS = [5, 10, 20, 30];

const PendingApprovals = () => {
  const [requests, setRequests] = useState(initialRequests);

  const [loading] = useState(false);

  const [search, setSearch] = useState("");

  const [selectedFilter, setSelectedFilter] = useState("All");

  const [currentPage, setCurrentPage] = useState(1);

  const [itemsPerPage, setItemsPerPage] = useState(5);

  const [selectedRequest, setSelectedRequest] = useState(null);

  const [viewOpen, setViewOpen] = useState(false);

  const [approveOpen, setApproveOpen] = useState(false);

  const [rejectOpen, setRejectOpen] = useState(false);

  const [rejectReason, setRejectReason] = useState("");

  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      const matchesSearch =
        request.organization
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesFilter =
        selectedFilter === "All"
          ? true
          : request.status === selectedFilter;

      return matchesSearch && matchesFilter;
    });
  }, [requests, search, selectedFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredRequests.length / itemsPerPage)
  );

  const paginatedRequests = filteredRequests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageSizeChange = (newPageSize) => {
    if (
      !PAGE_SIZE_OPTIONS.includes(newPageSize) ||
      newPageSize === itemsPerPage
    ) {
      return;
    }

    setItemsPerPage(newPageSize);
    setCurrentPage(1);
  };

  const handleApprove = () => {
    console.log("Approved :", selectedRequest);

    setRequests((prev) =>
      prev.filter((item) => item.id !== selectedRequest.id)
    );

    setApproveOpen(false);
  };

  const handleReject = () => {
    console.log(selectedRequest, rejectReason);

    setRequests((prev) =>
      prev.filter((item) => item.id !== selectedRequest.id)
    );

    setRejectReason("");

    setRejectOpen(false);
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
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />

        <PendingStats requests={requests} />

        <PendingFilter
          selectedFilter={selectedFilter}
          onFilterChange={(filter) => {
            setSelectedFilter(filter);
            setCurrentPage(1);
          }}
        />

        {loading ? (
          <PendingTableSkeleton />
        ) : filteredRequests.length > 0 ? (
          <>
            <PendingTable
              requests={paginatedRequests}
              onView={(request) => {
                setSelectedRequest(request);
                setViewOpen(true);
              }}
              onApprove={(request) => {
                setSelectedRequest(request);
                setApproveOpen(true);
              }}
              onReject={(request) => {
                setSelectedRequest(request);
                setRejectOpen(true);
              }}
            />

            <PendingPagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredRequests.length}
              pageSize={itemsPerPage}
              onPageChange={setCurrentPage}
              pageSizeOptions={PAGE_SIZE_OPTIONS}
              onPageSizeChange={handlePageSizeChange}
            />
          </>
        ) : (
          <PendingEmptyState
            title="No Pending Requests"
            description="All tenant registration requests have been reviewed."
          />
        )}
      </div>

      <ViewRequestModal
        open={viewOpen}
        request={selectedRequest}
        onClose={() => setViewOpen(false)}
      />

      <ApproveTenantModal
        open={approveOpen}
        tenant={selectedRequest}
        onClose={() => setApproveOpen(false)}
        onApprove={handleApprove}
      />

      <RejectTenantModal
        open={rejectOpen}
        tenant={selectedRequest}
        reason={rejectReason}
        onReasonChange={(e) =>
          setRejectReason(e.target.value)
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