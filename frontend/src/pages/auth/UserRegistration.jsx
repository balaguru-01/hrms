import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useSearchParams,
} from "react-router-dom";

import { jwtDecode } from "jwt-decode";

import Logo from "../../components/common/Logo";
import AuthCard from "../../components/auth/AuthCard";
import AuthHeader from "../../components/auth/AuthHeader";
import AuthFooter from "../../components/auth/AuthFooter";

import DynamicForm from "../../components/form/DynamicForm";
import { MdHourglassTop } from "react-icons/md";

import {
  userRegistrationFields,
  userRegistrationDefaultValues,
} from "../../config/forms/userRegistration.config";

import {
  userRegistrationSchema,
} from "../../schemas/user/userRegistration.schema";

import {
  completeUserRegistration,
} from "../../api/enterpriseUserApi";

import { useToast } from "../../context/ToastContext";

import authBg from "../../assets/images/auth-bg.jpg";

const formatRoleName = (
  roleName = ""
) => {
  return roleName
    .replace(
      /([a-z])([A-Z])/g,
      "$1 $2"
    )
    .replace(
      /^./,
      (character) =>
        character.toUpperCase()
    );
};

const UserRegistration = () => {
  const [
    searchParams,
  ] = useSearchParams();

  const { showToast } =
    useToast();

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    registrationCompleted,
    setRegistrationCompleted,
  ] = useState(false);

  const [
    successMessage,
    setSuccessMessage,
  ] = useState("");

  const token =
    searchParams.get("token");

  const invitationData =
    useMemo(() => {
      if (!token) {
        return null;
      }

      try {
        const decoded =
          jwtDecode(token);

        if (
          !decoded ||
          typeof decoded !==
            "object"
        ) {
          return null;
        }

        return decoded;
      } catch {
        return null;
      }
    }, [token]);

  const email =
    invitationData?.email || "";

  const designation =
    invitationData?.designation ||
    "";

  const roleName =
    invitationData?.role?.name ||
    "";

  const tenantOrgName =
    invitationData?.tenant?.orgName ||
    "";

  const isTokenExpired =
    Boolean(
      invitationData?.exp &&
        Date.now() >=
          invitationData.exp * 1000
    );

  const isInvitationUsable =
    Boolean(
      token &&
        invitationData &&
        email &&
        designation
    ) && !isTokenExpired;

  const registrationDefaultValues =
    useMemo(
      () => ({
        ...userRegistrationDefaultValues,
        email,
      }),
      [email]
    );

  const registrationFields =
    useMemo(
      () =>
        userRegistrationFields.map(
          (field) => ({
            ...field,
            inputClassName:
              "py-2.5",
          })
        ),
      []
    );

  useEffect(() => {
    if (!token) {
      showToast({
        message:
          "The registration link is missing the required invitation token.",
        type: "error",
        title:
          "Invalid Registration Link",
      });

      return;
    }

    if (!invitationData) {
      showToast({
        message:
          "The registration link is invalid or could not be read.",
        type: "error",
        title:
          "Invalid Registration Link",
      });

      return;
    }

    if (isTokenExpired) {
      showToast({
        message:
          "This registration invitation has expired.",
        type: "error",
        title:
          "Invitation Expired",
      });
    }
  }, [
    token,
    invitationData,
    isTokenExpired,
    showToast,
  ]);

  const handleRegistrationSubmit =
    async (formData) => {
      if (!token) {
        showToast({
          message:
            "The registration token is missing.",
          type: "error",
        });

        return;
      }

      if (!isInvitationUsable) {
        showToast({
          message:
            "This registration invitation is invalid or expired.",
          type: "error",
        });

        return;
      }

      try {
        setLoading(true);

        const response =
          await completeUserRegistration({
            token,
            firstName:
              formData.firstName.trim(),
            lastName:
              formData.lastName.trim(),
            email,
            password:
              formData.password,
            phone:
              formData.phone.trim(),
            location:
              formData.location.trim(),
          });

        if (!response?.success) {
          showToast({
            message:
              response?.message ||
              "Unable to complete registration.",
            type: "error",
          });

          return;
        }

        setSuccessMessage(
          response?.message ||
            "Your registration was submitted successfully. Your account is pending for approval."
        );

        setRegistrationCompleted(
          true
        );
      } catch (error) {
        const backendMessage =
          error?.response?.data
            ?.message ||
          error?.response?.data
            ?.error;

        showToast({
          message:
            backendMessage ||
            "Unable to complete registration. Please try again.",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    };

  const handleValidationError =
    (validationErrors) => {
      const firstError =
        Object.values(
          validationErrors || {}
        )[0];

      showToast({
        message:
          firstError?.message ||
          "Please complete all required fields.",
        type: "error",
      });
    };

  if (registrationCompleted) {
    return (
      <div
        className="flex min-h-screen items-center justify-center bg-cover bg-center bg-no-repeat px-4 py-4 sm:px-6"
        style={{
          backgroundImage:
            `url(${authBg})`,
        }}
      >
        <div className="w-full">
          <div className="mb-4 flex justify-center sm:mb-5">
            <Logo className="h-9 w-auto sm:h-11" />
          </div>

          <AuthCard className="mx-auto !max-w-[650px] !px-5 !py-5 text-center">
            <AuthHeader
              className="mb-5"
              titleClassName="text-3xl"
              subtitleClassName="mt-2 text-sm"
              title="Registration"
              subtitle="Complete your account setup"
            />

            <div className="rounded-2xl border border-green-200 bg-green-50 p-4">
              <p className="text-sm leading-6 text-green-800 sm:text-base">
                {successMessage}
              </p>
            </div>

            <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-3">
              <p className="text-sm text-gray-500">
                Registered Email
              </p>

              <p className="mt-1 break-all text-sm font-semibold text-gray-900">
                {email}
              </p>
            </div>

            <p className="mt-4 text-sm leading-6 text-gray-500">
              Please wait for the invitor to review and approve
              your account.
            </p>

            <AuthFooter
                text="Your registration is securely under review."
                className="mt-4"
                icon={MdHourglassTop}
              />
          </AuthCard>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat px-4 py-4 sm:px-6 sm:py-5"
      style={{
        backgroundImage:
          `url(${authBg})`,
      }}
    >
      <div className="w-full">
        <div className="mb-3 flex justify-center sm:mb-4">
          <Logo className="h-9 w-auto sm:h-10" />
        </div>

        <AuthCard className="mx-auto !max-w-[620px] !px-4 !py-3 sm:!px-5 sm:!py-4">
          <AuthHeader
            className="mb-5"
            titleClassName="text-3xl"
            subtitleClassName="mt-2 text-sm"
            title="Registration"
            subtitle="Complete your account setup"
          />

          {!isInvitationUsable ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center">
              <p className="text-sm font-semibold text-red-700">
                This registration link is
                invalid or expired.
              </p>

              <p className="mt-2 text-sm leading-6 text-red-600">
                Please contact the person who
                sent you the invitation and
                request a new registration link.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-3 grid grid-cols-1 gap-x-5 gap-y-3 sm:grid-cols-2">
                <div>
                  <p className="mb-2 block text-sm font-medium text-gray-700">
                    Designation
                  </p>

                  <div className="cursor-not-allowed rounded-xl border border-gray-300 bg-gray-50 px-4 py-2.5">
                    <p className="text-sm font-semibold text-gray-900">
                      {designation}
                    </p>
                  </div>
                </div>

                {roleName && (
                  <div>
                    <p className="mb-2 block text-sm font-medium text-gray-700">
                      Role
                    </p>

                    <div className="cursor-not-allowed rounded-xl border border-gray-300 bg-gray-50 px-4 py-2.5">
                      <p className="text-sm font-semibold text-gray-900">
                        {formatRoleName(
                          roleName
                        )}
                      </p>
                    </div>
                  </div>
                )}

                {tenantOrgName && (
                  <div className="sm:col-span-2">
                    <p className="mb-2 block text-sm font-medium text-gray-700">
                      Tenant Organization
                    </p>

                    <div className="cursor-not-allowed rounded-xl border border-gray-300 bg-gray-50 px-4 py-2.5">
                      <p className="text-sm font-semibold text-gray-900">
                        {tenantOrgName}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <DynamicForm
                fields={registrationFields}
                schema={
                  userRegistrationSchema
                }
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
                disableSubmitUntilFilled={
                  false
                }
                twoColumnLayout
                submitButtonFullWidth={
                  false
                }
              />
            </>
          )}
        </AuthCard>
      </div>
    </div>
  );
};

export default UserRegistration;