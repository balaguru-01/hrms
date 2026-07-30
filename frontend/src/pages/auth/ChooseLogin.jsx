import { useNavigate } from "react-router-dom";

import {
  MdBusiness,
  MdAdminPanelSettings,
  MdLock,
} from "react-icons/md";

import Logo from "../../components/common/logo";
import LoginOptionCard from "../../components/cards/LoginOptionCard";

import bgImage from "../../assets/images/login-bg.jpg";

const ChooseLogin = () => {
  const navigate = useNavigate();

  return (
    <div
      className="
        relative
        min-h-screen
        bg-cover
        bg-center
        bg-no-repeat
        overflow-hidden
        flex
        items-center
        justify-center
      "
      style={{
        backgroundImage: `url(${bgImage})`,
      }}
    >
      {/* Light Overlay */}

      <div className="absolute inset-0 bg-white/10 backdrop-blur-[0.8px]" />

      {/* Logo */}

      <Logo />

      {/* Login Card */}

      <div
        className="
          relative
          z-10
          w-[540px]
          rounded-[32px]
          bg-white/95
          shadow-[0_25px_60px_rgba(0,0,0,0.12)]
          p-10
          mt-10
        "
      >
        <h1 className="text-[44px] font-bold text-center text-gray-900">
          Welcome
        </h1>

        <p className="text-center text-gray-500 text-lg mt-3 mb-10">
          Choose how you want to sign in.
        </p>

        <div className="space-y-6">
          <LoginOptionCard
            icon={<MdAdminPanelSettings />}
            title="Enterprise"
            description="Platform administration and system management"
            onClick={() => navigate("/enterprise/login")}
          />

          <LoginOptionCard
            icon={<MdBusiness />}
            title="Tenant"
            description="Access your organization workspace and data"
            onClick={() => navigate("/tenant/organization")}
          />
        </div>

        <div className="flex justify-center mt-10">
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <MdLock />
            Secure authentication powered by TenantHub
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChooseLogin;