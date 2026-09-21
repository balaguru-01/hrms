import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import Logo from "../../components/common/Logo";
import AuthCard from "../../components/auth/AuthCard";
import AuthHeader from "../../components/auth/AuthHeader";
import DynamicForm from "../../components/form/DynamicForm";

import { useToast } from "../../context/ToastContext";

import authBg from "../../assets/images/auth-bg.jpg";

const TenantRegistration = () => {
  const [searchParams] = useSearchParams();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(false);
  const [registrationCompleted, setRegistrationCompleted] =
    useState(false);

  const token = searchParams.get("token");

  // ---------------------------------------
  // Decode invitation token
  // ---------------------------------------
  const invitationData = useMemo(() => {
    if (!token) {
      return null;
    }

    try {
      const decoded = jwtDecode(token);

      if (!decoded || typeof decoded !== "object") {
        return null;
      }

      return decoded;
    } catch {
      return null;
    }
  }, [token]);

  const organizationName =
    invitationData?.organizationName || "";

  const email = invitationData?.email || "";

  const isTokenExpired = Boolean(
    invitationData?.exp &&
      Date.now() >= invitationData.exp * 1000
  );

  const isInvitationUsable =
    Boolean(
      token &&
        invitationData &&
        organizationName &&
        email &&
        invitationData?.purpose === "TenantInvitation"
    ) && !isTokenExpired;

  // ---------------------------------------
  // Registration fields
  // ---------------------------------------
  const registrationFields = useMemo(
    () => [
      {
        name: "firstName",
        label: "First Name",
        type: "text",
        placeholder: "Enter first name",
        required: true,
        inputClassName: "py-2.5",
      },

      {
        name: "lastName",
        label: "Last Name",
        type: "text",
        placeholder: "Enter last name",
        required: true,
        inputClassName: "py-2.5",
      },

      {
        name: "phone",
        label: "Phone Number",
        type: "tel",
        placeholder: "Enter 10 digit phone number",
        required: true,
        inputClassName: "py-2.5",
      },

      {
        name: "location",
        label: "Location",
        type: "text",
        placeholder: "Enter location",
        required: true,
        inputClassName: "py-2.5",
      },

      {
        name: "password",
        label: "Password",
        type: "password",
        placeholder: "Enter password",
        required: true,
        inputClassName: "py-2.5",
      },

      {
        name: "confirmPassword",
        label: "Confirm Password",
        type: "password",
        placeholder: "Confirm password",
        required: true,
        inputClassName: "py-2.5",
      },
    ],
    []
  );

  const registrationDefaultValues = useMemo(
    () => ({
      firstName: "",
      lastName: "",
      phone: "",
      location: "",
      password: "",
      confirmPassword: "",
    }),
    []
  );

  // ---------------------------------------
  // Token validation
  // ---------------------------------------
  useEffect(() => {
    if (!token) {
      showToast({
        type: "error",
        title: "Invalid Registration Link",
        message:
          "The registration link is missing the invitation token.",
      });

      return;
    }

    if (!invitationData) {
      showToast({
        type: "error",
        title: "Invalid Registration Link",
        message:
          "The registration link is invalid.",
      });

      return;
    }

    if (
      invitationData.purpose !==
      "TenantInvitation"
    ) {
      showToast({
        type: "error",
        title: "Invalid Invitation",
        message:
          "This link is not a valid tenant registration invitation.",
      });

      return;
    }

    if (isTokenExpired) {
      showToast({
        type: "error",
        title: "Invitation Expired",
        message:
          "This tenant registration invitation has expired.",
      });
    }
  }, [
    token,
    invitationData,
    isTokenExpired,
    showToast,
  ]);

  // ---------------------------------------
  // Submit registration
  // ---------------------------------------
  const handleRegistrationSubmit = async (
    formData
  ) => {
    if (!isInvitationUsable) {
      showToast({
        type: "error",
        title: "Invalid Invitation",
        message:
          "This registration invitation is invalid or expired.",
      });

      return;
    }

    const firstName = formData.firstName
      ?.trim();

    const lastName = formData.lastName
      ?.trim();

    const phone = formData.phone
      ?.trim();

    const location = formData.location
      ?.trim();

    const password = formData.password || "";

    const confirmPassword =
      formData.confirmPassword || "";

    // ---------------------------------------
    // First name
    // ---------------------------------------
    if (!firstName) {
      showToast({
        type: "error",
        title: "Validation Error",
        message: "First name is required.",
      });

      return;
    }

    if (!/^[A-Za-z]+$/.test(firstName)) {
      showToast({
        type: "error",
        title: "Validation Error",
        message:
          "First name should contain letters only.",
      });

      return;
    }

    // ---------------------------------------
    // Last name
    // ---------------------------------------
    if (!lastName) {
      showToast({
        type: "error",
        title: "Validation Error",
        message: "Last name is required.",
      });

      return;
    }

    if (!/^[A-Za-z]+$/.test(lastName)) {
      showToast({
        type: "error",
        title: "Validation Error",
        message:
          "Last name should contain letters only.",
      });

      return;
    }

    // ---------------------------------------
    // Phone number
    // ---------------------------------------
    if (!/^\d{10}$/.test(phone)) {
      showToast({
        type: "error",
        title: "Invalid Phone Number",
        message:
          "Phone number must contain exactly 10 digits.",
      });

      return;
    }

    // ---------------------------------------
    // Location
    // ---------------------------------------
    if (!location) {
      showToast({
        type: "error",
        title: "Validation Error",
        message: "Location is required.",
      });

      return;
    }

    // ---------------------------------------
    // Password
    // ---------------------------------------
    if (password.length < 8) {
      showToast({
        type: "error",
        title: "Invalid Password",
        message:
          "Password must contain at least 8 characters.",
      });

      return;
    }

    if (!/[A-Z]/.test(password)) {
      showToast({
        type: "error",
        title: "Invalid Password",
        message:
          "Password must contain at least one capital letter.",
      });

      return;
    }

    if (!/[a-z]/.test(password)) {
      showToast({
        type: "error",
        title: "Invalid Password",
        message:
          "Password must contain at least one small letter.",
      });

      return;
    }

    if (!/\d/.test(password)) {
      showToast({
        type: "error",
        title: "Invalid Password",
        message:
          "Password must contain at least one number.",
      });

      return;
    }

    // ---------------------------------------
    // Confirm password
    // ---------------------------------------
    if (password !== confirmPassword) {
      showToast({
        type: "error",
        title: "Password Mismatch",
        message:
          "Password and confirm password must match.",
      });

      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/tenant-invitations/register",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            token,
            firstName,
            lastName,
            phone,
            location,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        showToast({
          type: "error",
          title: "Registration Failed",
          message:
            data?.message ||
            "Unable to complete registration.",
        });

        return;
      }

      showToast({
        type: "success",
        title: "Registration Submitted",
        message:
          "Your registration has been submitted and is pending approval.",
      });

      setRegistrationCompleted(true);
    } catch (error) {
      console.error(
        "Tenant registration error:",
        error
      );

      showToast({
        type: "error",
        title: "Registration Failed",
        message:
          "Unable to complete registration. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------
  // Validation error from DynamicForm
  // ---------------------------------------
  const handleValidationError = (
    validationErrors
  ) => {
    const firstError = Object.values(
      validationErrors || {}
    )[0];

    showToast({
      type: "error",
      title: "Validation Error",
      message:
        firstError?.message ||
        "Please complete all required fields.",
    });
  };

  // ---------------------------------------
  // Success screen
  // ---------------------------------------
  if (registrationCompleted) {
    return (
      <div
        className="flex min-h-screen items-center justify-center bg-cover bg-center bg-no-repeat px-4 py-6"
        style={{
          backgroundImage: `url(${authBg})`,
        }}
      >
        <div className="w-full">
          <div className="mb-5 flex justify-center">
            <Logo className="h-10 w-auto" />
          </div>

          <AuthCard className="mx-auto max-w-[650px] !px-6 !py-7 text-center">
            <AuthHeader
              title="Registration Submitted"
              subtitle="Your tenant account is pending approval."
            />

            <div className="mt-5 rounded-2xl border border-green-200 bg-green-50 p-5">
              <p className="text-sm leading-6 text-green-700">
                Your registration has been successfully
                submitted.
              </p>

              <p className="mt-2 text-sm font-semibold text-gray-800">
                Organization: {organizationName}
              </p>

              <p className="mt-1 text-sm text-gray-600">
                Email: {email}
              </p>
            </div>
          </AuthCard>
        </div>
      </div>
    );
  }

  // ---------------------------------------
  // Main screen
  // ---------------------------------------
  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat px-4 py-6 sm:px-6"
      style={{
        backgroundImage: `url(${authBg})`,
      }}
    >
      <div className="w-full">
        <div className="mb-5 flex justify-center">
          <Logo className="h-10 w-auto" />
        </div>

        <AuthCard className="mx-auto max-w-[700px] !px-5 !py-6">
          <AuthHeader
            title="Tenant Registration"
            subtitle="Complete your personal details"
          />

          {!isInvitationUsable ? (
            <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-5 text-center">
              <p className="text-sm font-semibold text-red-700">
                This registration link is invalid or expired.
              </p>

              <p className="mt-2 text-sm text-red-600">
                Please request a new invitation link.
              </p>
            </div>
          ) : (
            <>
              {/* Invitation information */}
              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Organization Name
                  </label>

                  <div className="rounded-xl border border-gray-300 bg-gray-50 px-4 py-3">
                    <p className="text-sm font-semibold text-gray-800">
                      {organizationName}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Email
                  </label>

                  <div className="rounded-xl border border-gray-300 bg-gray-50 px-4 py-3">
                    <p className="text-sm font-semibold text-gray-800">
                      {email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Personal details */}
              <div className="mt-5">
                <DynamicForm
                  fields={registrationFields}
                  defaultValues={
                    registrationDefaultValues
                  }
                  onSubmit={
                    handleRegistrationSubmit
                  }
                  onValidationError={
                    handleValidationError
                  }
                  submitText="COMPLETE REGISTRATION"
                  loadingText="SUBMITTING..."
                  loading={loading}
                  mode="onChange"
                  disableSubmitUntilFilled={false}
                  twoColumnLayout
                  submitButtonFullWidth={false}
                />
              </div>
            </>
          )}
        </AuthCard>
      </div>
    </div>
  );
};

export default TenantRegistration;