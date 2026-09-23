import { useLocation } from "react-router-dom";

import { useState } from "react";

import Logo from "../../components/common/Logo";

import AuthCard from "../../components/auth/AuthCard";

import BackButton from "../../components/common/BackButton";

import StepIndicator from "../../components/auth/StepIndicator";

import OrganizationInfo from "../../components/auth/OrganizationInfo";

import AuthFooter from "../../components/auth/AuthFooter";

import InputField from "../../components/forms/InputField";

import PasswordField from "../../components/forms/PasswordField";

import PrimaryButton from "../../components/buttons/PrimaryButton";

import bgImage from "../../assets/images/auth-bg.jpg";

const TenantLogin = () => {
  const location = useLocation();

  const organization =
    location.state?.organization || {
      name: "Acme Corporation",
      domain: "acmecorp.com",
    };

  const [employeeId, setEmployeeId] = useState("");

  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log({
      organization,
      employeeId,
      password,
    });

    // TODO:
    // Call Login API
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${bgImage})`,
      }}
    >
      {/* Overlay */}

      <div className="flex min-h-screen flex-col bg-white/50 backdrop-blur-[1px]">

        {/* Logo */}

        <div className="w-full px-10 pt-8">
          <Logo className="h-16 w-auto" />
        </div>

        {/* Center */}

        <div className="flex flex-1 justify-center px-6 py-8">
          <AuthCard className="my-auto">

            <BackButton
              to="/tenant/organization"
              text="Back"
            />

            {/* Step Indicator */}

            <div className="mb-8 mt-6">
              <StepIndicator
                currentStep={2}
                totalSteps={2}
              />
            </div>

            {/* Organization */}

            <OrganizationInfo
              organizationName={organization.name}
              organizationDomain={organization.domain}
            />

            {/* Heading */}

            <h2 className="mt-6 text-center text-5xl font-bold text-gray-900">
              Sign in to your account
            </h2>

            {/* Form */}

            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-5"
            >
              <InputField
                label="Employee ID / Email"
                placeholder="Enter employee ID or email"
                value={employeeId}
                onChange={(e) =>
                  setEmployeeId(e.target.value)
                }
              />

              <PasswordField
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
              />

              {/* Remember */}

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300"
                  />

                  Remember me
                </label>

                <button
                  type="button"
                  className="text-sm text-green-700 hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              <PrimaryButton
                type="submit"
                text="Login"
              />
            </form>

            <AuthFooter />
          </AuthCard>
        </div>
      </div>
    </div>
  );
};

export default TenantLogin;