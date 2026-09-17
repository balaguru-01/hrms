import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdBusiness } from "react-icons/md";

import Logo from "../../components/common/Logo";

import AuthCard from "../../components/auth/AuthCard";
import AuthHeader from "../../components/auth/AuthHeader";
import AuthFooter from "../../components/auth/AuthFooter";
import BackButton from "../../components/common/BackButton";
import StepIndicator from "../../components/auth/StepIndicator";

import OrganizationDropdown from "../../components/auth/OrganizationDropdown";

import PrimaryButton from "../../components/buttons/PrimaryButton";

import bgImage from "../../assets/images/auth-bg.jpg";

const organizations = [
  {
    id: 1,
    name: "Acme Corporation",
    domain: "acmecorp.com",
  },
  {
    id: 2,
    name: "TechNova Pvt Ltd",
    domain: "technova.com",
  },
  {
    id: 3,
    name: "GreenLeaf Solutions",
    domain: "greenleaf.com",
  },
];

const TenantOrganization = () => {
  const navigate = useNavigate();

  const [selectedOrganization, setSelectedOrganization] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleOrganizationSelect = (organization) => {
    setSelectedOrganization(organization);
    setShowDropdown(false);
  };

  const handleContinue = () => {
    if (!selectedOrganization) return;

    navigate("/tenant/login", {
      state: {
        organization: selectedOrganization,
      },
    });
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="min-h-screen bg-white/50 backdrop-blur-[1px] flex flex-col">

        <div className="w-full px-10 pt-8">
          <Logo className="h-16 w-auto" />
        </div>

        <div className="flex-1 flex items-center justify-center px-6 pb-8">

          <AuthCard>

            <BackButton
              to="/"
              text="Back"
            />

            <StepIndicator
              currentStep={1}
              totalSteps={2}
            />

            <AuthHeader
              icon={
                <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                  <MdBusiness className="text-4xl text-green-700" />
                </div>
              }
              title="Welcome Back"
              subtitle="Select your organization to continue."
            />

            <div className="relative mt-8">

              <label className="mb-2 block text-sm font-medium text-gray-700">
                Organization
              </label>

              <button
                type="button"
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex h-14 w-full items-center justify-between rounded-xl border border-gray-300 bg-white px-4 text-left transition hover:border-green-500 focus:border-green-600"
              >
                <span className={selectedOrganization ? "text-gray-900" : "text-gray-400"}>
                  {selectedOrganization
                    ? selectedOrganization.name
                    : "Select your organization"}
                </span>

                <svg
                  className={`h-5 w-5 transition ${showDropdown ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <OrganizationDropdown
                show={showDropdown}
                organizations={organizations}
                selectedOrganization={selectedOrganization}
                onSelect={handleOrganizationSelect}
              />

            </div>

            <div className="mt-8">

              <PrimaryButton
                text="Continue"
                disabled={!selectedOrganization}
                onClick={handleContinue}
              />

            </div>

            <div className="mt-6 text-center">

              <button className="text-sm text-green-700 hover:underline">
                Need help finding your organization?
              </button>

            </div>

            <AuthFooter />

          </AuthCard>

        </div>

      </div>

    </div>
  );
};

export default TenantOrganization;