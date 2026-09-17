import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

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

import { enterpriseMenuItems } from "../../config/EnterpriseAdmin/EpAdminSidebarConfig";

import { useToast } from "../../context/ToastContext";

const TenantManagement = () => {
  const { showToast } = useToast();

  // -------------------------
  // Tenant Data
  // -------------------------

  const [tenants, setTenants] = useState([]);

  const [loading, setLoading] = useState(true);

  // -------------------------
  // Search
  // -------------------------

  const [search, setSearch] = useState("");

  // -------------------------
  // Status Filter
  // -------------------------

  const [statusFilter, setStatusFilter] =
    useState("All");

  // -------------------------
  // Sort
  // -------------------------

  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });

  // -------------------------
  // Pagination
  // -------------------------

  const [currentPage, setCurrentPage] = useState(1);

  const [pageSize, setPageSize] = useState(5);

  // -------------------------
  // Invite Tenant
  // -------------------------

  const [
    showInviteModal,
    setShowInviteModal,
  ] = useState(false);

  const [inviteForm, setInviteForm] = useState({
    organizationName: "",
    email: "",
  });

  const [inviteLoading, setInviteLoading] =
    useState(false);

  // -------------------------
  // View / Edit / Delete
  // -------------------------

  const [
    showViewModal,
    setShowViewModal,
  ] = useState(false);

  const [
    showEditModal,
    setShowEditModal,
  ] = useState(false);

  const [
    showDeleteModal,
    setShowDeleteModal,
  ] = useState(false);

  const [
    selectedTenant,
    setSelectedTenant,
  ] = useState(null);

  // -------------------------
  // Fetch Tenants
  // -------------------------

  const fetchTenants = useCallback(async () => {
    try {
      setLoading(true);

      const token =
        localStorage.getItem("accessToken");

      if (!token) {
        showToast({
          type: "error",
          title: "Authentication Error",
          message:
            "Please login again. Token not found.",
        });

        return;
      }

      const response = await fetch(
        "http://localhost:5000/tenants",
        {
          method: "GET",

          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        showToast({
          type: "error",
          title: "Failed to Load Tenants",
          message:
            data.message ||
            "Unable to fetch tenants.",
        });

        return;
      }

      const formattedTenants =
        (data.data || []).map(
          (tenant) => ({
            // Keep original MongoDB data
            ...tenant,

            // Frontend fields
            id: tenant._id,

            organization:
              tenant.orgName || "",

            name:
              tenant.orgName || "",

            email:
              tenant.email || "",

            phone:
              tenant.phone || "",

            employees:
              tenant.employeeCount ?? 0,

            status:
              tenant.subscription?.status ||
              "Pending",

            createdAt:
              tenant.createdAt,
          })
        );

      setTenants(formattedTenants);
    } catch (error) {
      console.error(
        "Fetch Tenants Error:",
        error
      );

      showToast({
        type: "error",
        title: "Network Error",
        message:
          "Unable to load tenants.",
      });
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchTenants();
  }, [fetchTenants]);

  // -------------------------
  // Search + Filter + Sort
  // -------------------------

  const filteredTenants = useMemo(() => {
    const normalizedSearch =
      search.trim().toLowerCase();

    const result = tenants.filter(
      (tenant) => {
        const tenantName =
          tenant.organization ||
          tenant.name ||
          tenant.orgName ||
          "";

        const tenantEmail =
          tenant.email || "";

        const tenantStatus =
          tenant.status ||
          tenant.subscription?.status ||
          "Pending";

        const matchesSearch =
          !normalizedSearch ||
          tenantName
            .toLowerCase()
            .includes(normalizedSearch) ||
          tenantEmail
            .toLowerCase()
            .includes(normalizedSearch);

        const matchesStatus =
          statusFilter === "All" ||
          tenantStatus === statusFilter;

        return (
          matchesSearch &&
          matchesStatus
        );
      }
    );

    result.sort((a, b) => {
      let firstValue;
      let secondValue;

      if (sortConfig.key === "name") {
        firstValue =
          a.organization ||
          a.name ||
          a.orgName ||
          "";

        secondValue =
          b.organization ||
          b.name ||
          b.orgName ||
          "";

        firstValue =
          firstValue.toLowerCase();

        secondValue =
          secondValue.toLowerCase();
      } else if (
        sortConfig.key === "employees"
      ) {
        firstValue =
          a.employees ?? 0;

        secondValue =
          b.employees ?? 0;
      } else if (
        sortConfig.key === "createdAt"
      ) {
        firstValue = new Date(
          a.createdAt || 0
        );

        secondValue = new Date(
          b.createdAt || 0
        );
      } else {
        firstValue =
          a[sortConfig.key] ?? "";

        secondValue =
          b[sortConfig.key] ?? "";
      }

      if (firstValue < secondValue) {
        return (
          sortConfig.direction === "asc"
            ? -1
            : 1
        );
      }

      if (firstValue > secondValue) {
        return (
          sortConfig.direction === "asc"
            ? 1
            : -1
        );
      }

      return 0;
    });

    return result;
  }, [
    tenants,
    search,
    statusFilter,
    sortConfig,
  ]);

  // -------------------------
  // Pagination
  // -------------------------

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredTenants.length / pageSize
    )
  );

  const paginatedTenants = useMemo(() => {
    const startIndex =
      (currentPage - 1) *
      pageSize;

    return filteredTenants.slice(
      startIndex,
      startIndex + pageSize
    );
  }, [
    filteredTenants,
    currentPage,
    pageSize,
  ]);

  // -------------------------
  // Search
  // -------------------------

  const handleSearchChange = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };

  // -------------------------
  // Status
  // -------------------------

  const handleStatusChange = (value) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  // -------------------------
  // Sort
  // -------------------------

  const handleSort = (key) => {
    setSortConfig(
      (previousConfig) => ({
        key,

        direction:
          previousConfig.key === key &&
          previousConfig.direction === "asc"
            ? "desc"
            : "asc",
      })
    );

    setCurrentPage(1);
  };

  // -------------------------
  // Pagination
  // -------------------------

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  // -------------------------
  // View
  // -------------------------

  const handleViewTenant = (tenant) => {
    setSelectedTenant(tenant);
    setShowViewModal(true);
  };

  // -------------------------
  // Edit
  // -------------------------

  const handleEditTenant = (tenant) => {
    setSelectedTenant({
      ...tenant,

      organization:
        tenant.organization ||
        tenant.name ||
        tenant.orgName ||
        "",
    });

    setShowEditModal(true);
  };

  // -------------------------
  // Delete
  // -------------------------

  const handleDeleteTenant = (tenant) => {
    setSelectedTenant(tenant);
    setShowDeleteModal(true);
  };

  // -------------------------
  // Open Invite Modal
  // -------------------------

  const handleInviteTenant = () => {
    setInviteForm({
      organizationName: "",
      email: "",
    });

    setShowInviteModal(true);
  };

  // -------------------------
  // Invite Input Change
  // -------------------------

  const handleInviteChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    let updatedValue = value;

    if (
      name === "organizationName"
    ) {
      updatedValue =
        value
          .toLowerCase()
          .replace(
            /[^a-z]/g,
            ""
          );
    }

    setInviteForm(
      (previous) => ({
        ...previous,

        [name]:
          updatedValue,
      })
    );
  };

  // -------------------------
  // Send Invitation
  // -------------------------

  const handleInviteSubmit =
    async () => {
      if (inviteLoading) {
        return;
      }

      const organizationName =
        inviteForm.organizationName.trim();

      const email =
        inviteForm.email
          .trim()
          .toLowerCase();

      // Organization required
      if (!organizationName) {
        showToast({
          type: "error",
          title:
            "Validation Error",
          message:
            "Organization name is required.",
        });

        return;
      }

      // Email required
      if (!email) {
        showToast({
          type: "error",
          title:
            "Validation Error",
          message:
            "Email is required.",
        });

        return;
      }

      const token =
        localStorage.getItem(
          "accessToken"
        );

      if (!token) {
        showToast({
          type: "error",
          title:
            "Authentication Error",
          message:
            "Please login again. Token not found.",
        });

        return;
      }

      try {
        setInviteLoading(true);

        const response =
          await fetch(
            "http://localhost:5000/tenant-invitations/invite",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${token}`,
              },

              body:
                JSON.stringify({
                  organizationName,
                  email,
                }),
            }
          );

        const data =
          await response.json();

        if (
          !response.ok ||
          !data.success
        ) {
          showToast({
            type: "error",
            title:
              "Invitation Failed",
            message:
              data.message ||
              "Failed to send tenant invitation.",
          });

          return;
        }

        // Invitation successfully sent
        showToast({
          type: "success",
          title:
            "Invitation Sent",
          message:
            data.message ||
            "Tenant invitation sent successfully.",
        });

        setInviteForm({
          organizationName: "",
          email: "",
        });

        setShowInviteModal(false);

        // Refresh tenant list immediately
        await fetchTenants();

      } catch (error) {
        console.error(
          "Invite Tenant Error:",
          error
        );

        showToast({
          type: "error",
          title:
            "Invitation Failed",
          message:
            "Unable to send tenant invitation. Please try again.",
        });

      } finally {
        setInviteLoading(false);
      }
    };

  // -------------------------
  // Update Tenant
  // -------------------------

  const handleUpdateTenant =
    async (updatedTenant) => {
      try {
        const token =
          localStorage.getItem(
            "accessToken"
          );

        if (!token) {
          showToast({
            type: "error",
            title:
              "Authentication Error",
            message:
              "Please login again. Token not found.",
          });

          return;
        }

        const employeeCount =
          Number(
            updatedTenant.employees
          );

        if (
          employeeCount < 0 ||
          employeeCount > 70
        ) {
          showToast({
            type: "error",
            title:
              "Invalid Employee Count",
            message:
              "Employee count must be between 0 and 70.",
          });

          return;
        }

        const response =
          await fetch(
            `http://localhost:5000/tenants/${updatedTenant.id}`,
            {
              method: "PUT",

              headers: {
                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${token}`,
              },

              body:
                JSON.stringify({
                  orgName:
                    updatedTenant.organization,

                  email:
                    updatedTenant.email,

                  phone:
                    updatedTenant.phone,

                  employeeCount:
                    employeeCount,

                  subscription: {
                    ...(updatedTenant.subscription ||
                      {}),

                    status:
                      updatedTenant.status,
                  },
                }),
            }
          );

        const data =
          await response.json();

        if (
          !response.ok ||
          !data.success
        ) {
          showToast({
            type: "error",
            title:
              "Update Failed",
            message:
              data.message ||
              "Unable to update tenant.",
          });

          return;
        }

        const updatedBackendTenant =
          data.data;

        const formattedTenant = {
          ...updatedBackendTenant,

          id:
            updatedBackendTenant._id,

          organization:
            updatedBackendTenant
              .orgName ||
            "",

          name:
            updatedBackendTenant
              .orgName ||
            "",

          email:
            updatedBackendTenant
              .email ||
            "",

          phone:
            updatedBackendTenant
              .phone ||
            "",

          employees:
            updatedBackendTenant
              .employeeCount ??
            0,

          status:
            updatedBackendTenant
              .subscription
              ?.status ||
            "Pending",

          createdAt:
            updatedBackendTenant.createdAt,
        };

        setTenants(
          (previousTenants) =>
            previousTenants.map(
              (tenant) =>
                tenant.id ===
                formattedTenant.id
                  ? formattedTenant
                  : tenant
            )
        );

        setShowEditModal(false);

        setSelectedTenant(null);

        showToast({
          type: "success",
          title:
            "Tenant Updated",
          message:
            "Tenant information updated successfully.",
        });

      } catch (error) {
        console.error(
          "Update Tenant Error:",
          error
        );

        showToast({
          type: "error",
          title:
            "Update Failed",
          message:
            "Unable to update tenant. Please try again.",
        });
      }
    };

  // -------------------------
  // Delete
  // -------------------------

  const handleConfirmDelete =
    async () => {

      if (!selectedTenant) {
        return;
      }

      try {
        const token =
          localStorage.getItem(
            "accessToken"
          );

        if (!token) {
          showToast({
            type: "error",
            title:
              "Authentication Error",
            message:
              "Please login again. Token not found.",
          });

          return;
        }

        const response =
          await fetch(
            `http://localhost:5000/tenants/${selectedTenant.id}`,
            {
              method: "DELETE",

              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        const data =
          await response.json();

        if (
          !response.ok ||
          !data.success
        ) {
          showToast({
            type: "error",
            title:
              "Delete Failed",
            message:
              data.message ||
              "Unable to delete tenant.",
          });

          return;
        }

        setTenants(
          (previousTenants) =>
            previousTenants.filter(
              (tenant) =>
                tenant.id !==
                selectedTenant.id
            )
        );

        setShowDeleteModal(false);

        setSelectedTenant(null);

        showToast({
          type: "success",
          title:
            "Tenant Deleted",
          message:
            "Tenant deleted successfully.",
        });

      } catch (error) {
        console.error(
          "Delete Tenant Error:",
          error
        );

        showToast({
          type: "error",
          title:
            "Delete Failed",
          message:
            "Unable to delete tenant. Please try again.",
        });
      }
    };

  return (
    <DashboardLayout
      title="Tenant Management"
      subtitle="Invite and manage tenant organizations."
      menuItems={
        enterpriseMenuItems
      }
    >
      <div className="space-y-6">

        {/* Toolbar */}

        <TenantToolbar
          search={search}
          onSearch={
            handleSearchChange
          }
          onInvite={
            handleInviteTenant
          }
        />

        {/* Stats */}

        <TenantStats
          tenants={tenants}
        />

        {/* Filter */}

        <TenantFilter
          selectedFilter={
            statusFilter
          }
          onFilterChange={
            handleStatusChange
          }
        />

        {/* Table */}

        {loading ? (
          <TenantTableSkeleton />
        ) : paginatedTenants.length >
          0 ? (
          <>
            <TenantTable
              tenants={
                paginatedTenants
              }
              sortConfig={
                sortConfig
              }
              onSort={
                handleSort
              }
              onView={
                handleViewTenant
              }
              onEdit={
                handleEditTenant
              }
              onDelete={
                handleDeleteTenant
              }
            />

            <TenantPagination
              currentPage={
                currentPage
              }
              totalPages={
                totalPages
              }
              pageSize={
                pageSize
              }
              totalItems={
                filteredTenants.length
              }
              onPageChange={
                handlePageChange
              }
              onPageSizeChange={
                handlePageSizeChange
              }
            />
          </>
        ) : (
          <TenantEmptyState
            search={search}
            statusFilter={
              statusFilter
            }
          />
        )}
      </div>

      {/* Invite Tenant Modal */}

      <InviteTenantModal
        open={
          showInviteModal
        }
        onClose={() =>
          setShowInviteModal(
            false
          )
        }
        formData={
          inviteForm
        }
        onChange={
          handleInviteChange
        }
        onSubmit={
          handleInviteSubmit
        }
        loading={
          inviteLoading
        }
      />

      {/* View Tenant Modal */}

      <ViewTenantModal
        open={
          showViewModal
        }
        tenant={
          selectedTenant
        }
        onClose={() => {
          setShowViewModal(false);
          setSelectedTenant(null);
        }}
      />

      {/* Edit Tenant Modal */}

      <EditTenantModal
        open={
          showEditModal
        }
        tenant={
          selectedTenant
        }
        onClose={() => {
          setShowEditModal(false);
          setSelectedTenant(null);
        }}
        onUpdate={
          handleUpdateTenant
        }
      />

      {/* Delete Tenant Modal */}

      <DeleteTenantModal
        open={
          showDeleteModal
        }
        tenant={
          selectedTenant
        }
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedTenant(null);
        }}
        onConfirm={
          handleConfirmDelete
        }
      />
    </DashboardLayout>
  );
};

export default TenantManagement;