import { useMemo, useState } from "react";

import DashboardLayout from "../../components/layout/DashboardLayout";
import TenantToolbar from "../../components/tenant/TenantToolbar";
import TenantStats from "../../components/tenant/TenantStats";
import TenantFilter from "../../components/tenant/TenantFilter";
import TenantTable from "../../components/tenant/TenantTable";
import TenantPagination from "../../components/tenant/TenantPagination";
import TenantTableSkeleton from "../../components/tenant/TenantTableSkeleton";
import TenantEmptyState from "../../components/tenant/TenantEmptyState";

import InviteTenantModal from "../../components/tenant/InviteTenantModal";
import ViewTenantModal from "../../components/tenant/ViewTenantModal";
import EditTenantModal from "../../components/tenant/EditTenantModal";
import DeleteTenantModal from "../../components/tenant/DeleteTenantModal";

const initialTenants = [
  {
    id: 1,
    organization: "Acme Corporation",
    contact: "John David",
    email: "admin@acme.com",
    phone: "+91 9876543210",
    employees: 156,
    status: "Active",
    created: "12 Aug 2026",
  },
  {
    id: 2,
    organization: "TechNova Pvt Ltd",
    contact: "Michael Roy",
    email: "contact@technova.com",
    phone: "+91 9845621458",
    employees: 82,
    status: "Pending",
    created: "10 Aug 2026",
  },
  {
    id: 3,
    organization: "GreenLeaf Solutions",
    contact: "Sara Wilson",
    email: "admin@greenleaf.com",
    phone: "+91 9784512365",
    employees: 245,
    status: "Active",
    created: "05 Aug 2026",
  },
];

const TenantManagement = () => {
  /* ---------------------- Data ---------------------- */

  const [tenants, setTenants] = useState(initialTenants);
  const [search, setSearch] = useState("");
  const [loading] = useState(false);

  const [selectedFilter, setSelectedFilter] = useState("All");

  const ITEMS_PER_PAGE = 5;

  const [currentPage, setCurrentPage] = useState(1);

  const [sortField, setSortField] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");

  /* ---------------------- Invite ---------------------- */

  const [inviteOpen, setInviteOpen] = useState(false);

  const [inviteForm, setInviteForm] = useState({
    organizationName: "",
    contactPerson: "",
    email: "",
    phone: "",
    message: "",
  });

  /* ---------------------- View/Edit/Delete ---------------------- */

  const [selectedTenant, setSelectedTenant] = useState(null);

  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  /* ---------------------- Search/Filter/Sort ---------------------- */

  const filteredTenants = useMemo(() => {
    let data = tenants.filter((tenant) => {
      const matchesSearch = tenant.organization
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesStatus =
        selectedFilter === "All"
          ? true
          : tenant.status === selectedFilter;

      return matchesSearch && matchesStatus;
    });

    if (sortField) {
      data.sort((a, b) => {
        let valueA;
        let valueB;

        switch (sortField) {
          case "organization":
            valueA = a.organization.toLowerCase();
            valueB = b.organization.toLowerCase();
            break;

          case "employees":
            valueA = a.employees;
            valueB = b.employees;
            break;

          case "created":
            valueA = new Date(a.created);
            valueB = new Date(b.created);
            break;

          default:
            return 0;
        }

        if (valueA < valueB) {
          return sortDirection === "asc" ? -1 : 1;
        }

        if (valueA > valueB) {
          return sortDirection === "asc" ? 1 : -1;
        }

        return 0;
      });
    }

    return data;
  }, [
    tenants,
    search,
    selectedFilter,
    sortField,
    sortDirection,
  ]);

  /* ---------------------- Pagination ---------------------- */

  const totalPages = Math.max(
    1,
    Math.ceil(filteredTenants.length / ITEMS_PER_PAGE)
  );

  const paginatedTenants = filteredTenants.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  /* ---------------------- Search ---------------------- */

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  /* ---------------------- Sort ---------------------- */

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection((previous) =>
        previous === "asc" ? "desc" : "asc"
      );
    } else {
      setSortField(field);
      setSortDirection("asc");
    }

    setCurrentPage(1);
  };

  /* ---------------------- Invite ---------------------- */

const handleInviteChange = (e) => {
  setInviteForm({
    ...inviteForm,
    [e.target.name]: e.target.value,
  });
};

const handleInvite = async () => {
  try {
    // Get JWT token from localStorage
    const token = localStorage.getItem("accessToken");

    if (!token) {
      alert("Please login again. Token not found.");
      return;
    }

    // Call backend API
    const response = await fetch(
      "http://localhost:5000/tenants/invite",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          organizationName: inviteForm.organizationName,
          email: inviteForm.email,
        }),
      }
    );

    const data = await response.json();

    // If backend returns an error
    if (!response.ok || !data.success) {
      alert(data.message || "Failed to send invitation");
      return;
    }

    // Create pending request
    const newPendingRequest = {
      id: Date.now(),
      organization: inviteForm.organizationName,
      contact: inviteForm.contactPerson,
      email: inviteForm.email,
      phone: inviteForm.phone,
      requestedOn: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      status: "Pending",
    };

    // Get existing pending requests
    const existingRequests = JSON.parse(
      localStorage.getItem("pendingRequests") || "[]"
    );

    // Save new request
    localStorage.setItem(
      "pendingRequests",
      JSON.stringify([
        ...existingRequests,
        newPendingRequest,
      ])
    );

    // Add invited tenant to Tenant Management table
    const newTenant = {
      id: Date.now(),

      organization: inviteForm.organizationName,

      contact: inviteForm.contactPerson,

      email: inviteForm.email,

      phone: inviteForm.phone,

      employees: 0,

      status: "Pending",

      created: new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    };

    setTenants((previous) => [
      ...previous,
      newTenant,
    ]);

    // Success message
    alert(
      data.message || "Tenant invitation sent successfully"
    );

    // Close modal
    setInviteOpen(false);

    // Clear form
    setInviteForm({
      organizationName: "",
      contactPerson: "",
      email: "",
      phone: "",
      message: "",
    });

  } catch (error) {
    console.error("Invite Error:", error);

    alert(
      "Something went wrong while sending the invitation"
    );
  }
};
  /* ---------------------- View ---------------------- */

  const handleView = (tenant) => {
    setSelectedTenant(tenant);
    setViewOpen(true);
  };

  /* ---------------------- Edit ---------------------- */

  const handleEdit = (tenant) => {
    setSelectedTenant(tenant);
    setEditOpen(true);
  };

  const handleUpdate = (updatedTenant) => {
    setTenants((previous) =>
      previous.map((tenant) =>
        tenant.id === updatedTenant.id
          ? updatedTenant
          : tenant
      )
    );

    setEditOpen(false);
  };

  /* ---------------------- Delete ---------------------- */

  const handleDelete = (tenant) => {
    setSelectedTenant(tenant);
    setDeleteOpen(true);
  };

  const confirmDelete = (tenant) => {
    setTenants((previous) =>
      previous.filter((item) => item.id !== tenant.id)
    );

    setDeleteOpen(false);
  };

  return (
    <DashboardLayout
      title="Tenant Management"
      subtitle="Invite and manage tenant organizations."
    >
      <div className="space-y-8">

        <TenantToolbar
          search={search}
          onSearch={handleSearch}
          onInvite={() => setInviteOpen(true)}
        />

        <TenantStats tenants={tenants} />

        <TenantFilter
          selectedFilter={selectedFilter}
          onFilterChange={(filter) => {
            setSelectedFilter(filter);
            setCurrentPage(1);
          }}
        />

        {loading ? (
          <TenantTableSkeleton />
        ) : filteredTenants.length > 0 ? (
          <>
            <TenantTable
              tenants={paginatedTenants}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={handleSort}
            />

            <TenantPagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredTenants.length}
              pageSize={ITEMS_PER_PAGE}
              onPageChange={setCurrentPage}
            />
          </>
        ) : (
          <TenantEmptyState
            title={
              search
                ? "No matching tenants found"
                : "No tenants available"
            }
            description={
              search
                ? "Try searching with another organization name."
                : "Invite your first tenant organization to join TenantHub."
            }
            buttonText="Invite Tenant"
            onAction={() => setInviteOpen(true)}
          />
        )}

      </div>

      {/* Invite Tenant Modal */}
      <InviteTenantModal
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        formData={inviteForm}
        onChange={handleInviteChange}
        onSubmit={handleInvite}
      />

      {/* View Tenant Modal */}
      <ViewTenantModal
        open={viewOpen}
        tenant={selectedTenant}
        onClose={() => setViewOpen(false)}
      />

      {/* Edit Tenant Modal */}
      <EditTenantModal
        open={editOpen}
        tenant={selectedTenant}
        onClose={() => setEditOpen(false)}
        onSubmit={handleUpdate}
      />

      {/* Delete Tenant Modal */}
      <DeleteTenantModal
        open={deleteOpen}
        tenant={selectedTenant}
        onClose={() => setDeleteOpen(false)}
        onConfirm={confirmDelete}
      />

    </DashboardLayout>
  );
};

export default TenantManagement;