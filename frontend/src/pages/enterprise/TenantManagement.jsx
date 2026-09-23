import {
  useMemo,
  useState,
  useEffect,
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
import DeleteTenantModal from "../../components/tenant/DeleteTenantModal";

import { useToast } from "../../context/ToastContext";

const STORAGE_KEY = "tenants";
const PENDING_KEY = "pendingRequests";

const initialTenants = [
  {
    id: 1,
    tenantId: "TEN-1",
    organization: "Acme Corporation",
    email: "admin@acme.com",
    contact: "John Smith",
    phone: "+91 9876543210",
    employees: 156,
    status: "Active",
    created: "12 Aug 2026",
  },

  {
    id: 2,
    tenantId: "TEN-2",
    organization: "TechNova Pvt Ltd",
    email: "contact@technova.com",
    contact: "Rahul Kumar",
    phone: "+91 9876543211",
    employees: 82,
    status: "Pending",
    created: "10 Aug 2026",
  },

  {
    id: 3,
    tenantId: "TEN-3",
    organization: "GreenLeaf Solutions",
    email: "admin@greenleaf.com",
    contact: "Priya Sharma",
    phone: "+91 9876543212",
    employees: 245,
    status: "Active",
    created: "05 Aug 2026",
  },
];

const TenantManagement = () => {
  const { showToast } = useToast();

  // ----------------------
  // DATA
  // ----------------------

  const [tenants, setTenants] = useState(() => {
    try {
      const savedTenants =
        localStorage.getItem(STORAGE_KEY);

      if (savedTenants) {
        return JSON.parse(savedTenants);
      }

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(initialTenants)
      );

      return initialTenants;
    } catch (error) {
      console.error(
        "Unable to load tenants:",
        error
      );

      return initialTenants;
    }
  });

  // ----------------------
  // LOAD PENDING REQUESTS
  // AND MERGE WITH TENANTS
  // ----------------------

  useEffect(() => {
    try {
      const storedRequests =
        JSON.parse(
          localStorage.getItem(PENDING_KEY) ||
            "[]"
        );

      if (!storedRequests.length) {
        return;
      }

      setTenants((previous) => {
        const mergedTenants = [...previous];

        storedRequests.forEach((request) => {
          const requestEmail =
            request.email
              ?.trim()
              .toLowerCase();

          const existingIndex =
            mergedTenants.findIndex(
              (tenant) =>
                tenant.email
                  ?.trim()
                  .toLowerCase() ===
                requestEmail
            );

          if (existingIndex !== -1) {
            // Update the existing tenant
            // instead of adding another row
            mergedTenants[
              existingIndex
            ] = {
              ...mergedTenants[
                existingIndex
              ],

              ...request,

              created:
                request.created ||
                request.requestedOn ||
                mergedTenants[
                  existingIndex
                ].created,
            };
          } else {
            // Add only if this tenant
            // does not already exist
            mergedTenants.push({
              ...request,

              tenantId:
                request.tenantId ||
                `TEN-${request.id}`,
            });
          }
        });

        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(mergedTenants)
        );

        return mergedTenants;
      });
    } catch (error) {
      console.error(
        "Unable to load pending requests:",
        error
      );
    }
  }, []);

  const [search, setSearch] =
    useState("");

  const [loading] =
    useState(false);

  const [
    selectedFilter,
    setSelectedFilter,
  ] = useState("All");

  const ITEMS_PER_PAGE = 5;

  const [
    currentPage,
    setCurrentPage,
  ] = useState(1);

  const [
    sortField,
    setSortField,
  ] = useState("");

  const [
    sortDirection,
    setSortDirection,
  ] = useState("asc");

  // ----------------------
  // INVITE
  // ----------------------

  const [
    inviteOpen,
    setInviteOpen,
  ] = useState(false);

  const [
    inviteForm,
    setInviteForm,
  ] = useState({
    organizationName: "",
    email: "",
  });

  const [
    inviteLoading,
    setInviteLoading,
  ] = useState(false);

  // ----------------------
  // VIEW / DELETE
  // ----------------------

  const [
    selectedTenant,
    setSelectedTenant,
  ] = useState(null);

  const [
    viewOpen,
    setViewOpen,
  ] = useState(false);

  const [
    deleteOpen,
    setDeleteOpen,
  ] = useState(false);

  // ----------------------
  // SAVE TENANTS
  // ----------------------

  const saveTenants = (updatedTenants) => {
    setTenants(updatedTenants);

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updatedTenants)
    );
  };

  // ----------------------
  // SEARCH / FILTER / SORT
  // ----------------------

  const filteredTenants =
    useMemo(() => {
      let data =
        tenants.filter(
          (tenant) => {
            const searchValue =
              search.toLowerCase();

            const matchesSearch =
              tenant.organization
                ?.toLowerCase()
                .includes(searchValue) ||
              tenant.email
                ?.toLowerCase()
                .includes(searchValue) ||
              tenant.contact
                ?.toLowerCase()
                .includes(searchValue);

            const matchesStatus =
              selectedFilter ===
              "All"
                ? true
                : tenant.status ===
                  selectedFilter;

            return (
              matchesSearch &&
              matchesStatus
            );
          }
        );

      if (sortField) {
        data = [...data].sort(
          (a, b) => {
            let valueA;
            let valueB;

            switch (sortField) {
              case "organization":
                valueA =
                  a.organization.toLowerCase();

                valueB =
                  b.organization.toLowerCase();

                break;

              case "employees":
                valueA =
                  Number(a.employees) || 0;

                valueB =
                  Number(b.employees) || 0;

                break;

              case "created":
                valueA =
                  new Date(a.created);

                valueB =
                  new Date(b.created);

                break;

              default:
                return 0;
            }

            if (valueA < valueB) {
              return sortDirection ===
                "asc"
                ? -1
                : 1;
            }

            if (valueA > valueB) {
              return sortDirection ===
                "asc"
                ? 1
                : -1;
            }

            return 0;
          }
        );
      }

      return data;
    }, [
      tenants,
      search,
      selectedFilter,
      sortField,
      sortDirection,
    ]);

  // ----------------------
  // PAGINATION
  // ----------------------

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredTenants.length /
        ITEMS_PER_PAGE
    )
  );

  const paginatedTenants =
    filteredTenants.slice(
      (currentPage - 1) *
        ITEMS_PER_PAGE,

      currentPage *
        ITEMS_PER_PAGE
    );

  // ----------------------
  // SEARCH
  // ----------------------

  const handleSearch = (e) => {
    setSearch(
      e.target.value
    );

    setCurrentPage(1);
  };

  // ----------------------
  // SORT
  // ----------------------

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(
        (previous) =>
          previous === "asc"
            ? "desc"
            : "asc"
      );
    } else {
      setSortField(field);

      setSortDirection("asc");
    }

    setCurrentPage(1);
  };

  // ----------------------
  // INVITE FORM CHANGE
  // ----------------------

  const handleInviteChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    let updatedValue = value;

    if (
      name === "organizationName"
    ) {
      updatedValue = value
        .toLowerCase()
        .replace(/[^a-z]/g, "");
    }

    setInviteForm(
      (previous) => ({
        ...previous,

        [name]: updatedValue,
      })
    );
  };

  // ----------------------
  // SEND INVITATION
  // ----------------------

  const handleInvite = async () => {
    if (inviteLoading) {
      return;
    }

    const organizationName =
      inviteForm.organizationName
        .trim();

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

    // Only lowercase letters
    if (
      !/^[a-z]+$/.test(
        organizationName
      )
    ) {
      showToast({
        type: "error",
        title:
          "Invalid Organization Name",
        message:
          "Organization name can contain only lowercase letters without spaces, numbers or symbols.",
      });

      return;
    }

    // Duplicate organization
    const organizationExists =
      tenants.some(
        (tenant) =>
          tenant.organization
            ?.toLowerCase()
            .replace(/[^a-z]/g, "") ===
          organizationName
      );

    if (organizationExists) {
      showToast({
        type: "error",
        title:
          "Organization Already Exists",
        message:
          "This organization name has already been registered or invited.",
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

            body: JSON.stringify({
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

      // Generate ONE unique ID
      const uniqueId =
        Date.now();

      const tenantId =
        `TEN-${uniqueId}`;

      const createdDate =
        new Date().toLocaleDateString(
          "en-IN",
          {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }
        );

      // ----------------------
      // CREATE TENANT
      // ----------------------

      const newTenant = {
        id: uniqueId,

        tenantId,

        organization:
          organizationName,

        email,

        contact: "-",

        phone: "-",

        employees: 0,

        status: "Pending",

        created:
          createdDate,
      };

      const updatedTenants = [
        ...tenants,
        newTenant,
      ];

      saveTenants(
        updatedTenants
      );

      // ----------------------
      // CREATE PENDING REQUEST
      // ----------------------

      const newRequest = {
        id: uniqueId,

        tenantId,

        organization:
          organizationName,

        contact: "-",

        email,

        phone: "-",

        employees: 0,

        requestedOn:
          createdDate,

        created:
          createdDate,

        status: "Pending",
      };

      const existingRequests =
        JSON.parse(
          localStorage.getItem(
            PENDING_KEY
          ) || "[]"
        );

      const existingRequestIndex =
        existingRequests.findIndex(
          (request) =>
            request.email
              ?.trim()
              .toLowerCase() ===
            email
        );

      let updatedRequests;

      if (
        existingRequestIndex !==
        -1
      ) {
        updatedRequests = [
          ...existingRequests,
        ];

        updatedRequests[
          existingRequestIndex
        ] = {
          ...updatedRequests[
            existingRequestIndex
          ],

          ...newRequest,
        };
      } else {
        updatedRequests = [
          ...existingRequests,
          newRequest,
        ];
      }

      localStorage.setItem(
        PENDING_KEY,
        JSON.stringify(
          updatedRequests
        )
      );

      // ----------------------
      // SUCCESS
      // ----------------------

      showToast({
        type: "success",

        title:
          "Invitation Sent",

        message:
          data.message ||
          "Tenant invitation sent successfully.",

        duration: 4000,
      });

      setInviteOpen(false);

      setInviteForm({
        organizationName: "",
        email: "",
      });
    } catch (error) {
      console.error(
        "Invite Error:",
        error
      );

      showToast({
        type: "error",

        title:
          "Something Went Wrong",

        message:
          "Unable to send the tenant invitation. Please try again.",

        duration: 4000,
      });
    } finally {
      setInviteLoading(false);
    }
  };

  // ----------------------
  // VIEW
  // ----------------------

  const handleView = (tenant) => {
    setSelectedTenant(tenant);

    setViewOpen(true);
  };

  // ----------------------
  // DELETE
  // ----------------------

  const handleDelete = (tenant) => {
    setSelectedTenant(tenant);

    setDeleteOpen(true);
  };

  const confirmDelete = (
    tenant
  ) => {
    const updatedTenants =
      tenants.filter(
        (item) =>
          item.id !== tenant.id
      );

    saveTenants(
      updatedTenants
    );

    const storedRequests =
      JSON.parse(
        localStorage.getItem(
          PENDING_KEY
        ) || "[]"
      );

    const updatedRequests =
      storedRequests.filter(
        (item) =>
          item.id !== tenant.id
      );

    localStorage.setItem(
      PENDING_KEY,
      JSON.stringify(
        updatedRequests
      )
    );

    setDeleteOpen(false);

    showToast({
      type: "success",

      title:
        "Tenant Deleted",

      message:
        "Tenant deleted successfully.",
    });
  };

  return (
    <DashboardLayout
      title="Tenant Management"
      subtitle="Invite and manage tenant organizations."
    >
      <div className="space-y-8">

        <TenantToolbar
          search={search}
          onSearch={
            handleSearch
          }
          onInvite={() =>
            setInviteOpen(true)
          }
        />

        <TenantStats
          tenants={tenants}
        />

        <TenantFilter
          selectedFilter={
            selectedFilter
          }
          onFilterChange={(
            filter
          ) => {
            setSelectedFilter(
              filter
            );

            setCurrentPage(1);
          }}
        />

        {loading ? (
          <TenantTableSkeleton />
        ) : filteredTenants.length >
          0 ? (
          <>
            <TenantTable
              tenants={
                paginatedTenants
              }

              onView={
                handleView
              }

              onDelete={
                handleDelete
              }

              sortField={
                sortField
              }

              sortDirection={
                sortDirection
              }

              onSort={
                handleSort
              }
            />

            <TenantPagination
              currentPage={
                currentPage
              }

              totalPages={
                totalPages
              }

              totalItems={
                filteredTenants.length
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

            onAction={() =>
              setInviteOpen(true)
            }
          />
        )}
      </div>

      {/* Invite Tenant Modal */}

      <InviteTenantModal
        open={inviteOpen}
        onClose={() =>
          setInviteOpen(false)
        }
        formData={inviteForm}
        onChange={
          handleInviteChange
        }
        onSubmit={
          handleInvite
        }
        loading={
          inviteLoading
        }
      />

      {/* View Tenant Modal */}

      <ViewTenantModal
        open={viewOpen}
        tenant={selectedTenant}
        onClose={() =>
          setViewOpen(false)
        }
      />

      {/* Delete Tenant Modal */}

      <DeleteTenantModal
        open={deleteOpen}
        tenant={selectedTenant}
        onClose={() =>
          setDeleteOpen(false)
        }
        onConfirm={
          confirmDelete
        }
      />
    </DashboardLayout>
  );
};

export default TenantManagement;