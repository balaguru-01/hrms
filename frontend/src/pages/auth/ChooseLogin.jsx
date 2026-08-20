import { useNavigate } from "react-router-dom";
import {
  MdBusiness,
  MdAdminPanelSettings,
} from "react-icons/md";

import Logo from "../../components/common/Logo";
import AuthHeader from "../../components/auth/AuthHeader";
import AuthFooter from "../../components/auth/AuthFooter";
import LoginOptionCard from "../../components/cards/LoginOptionCard";

import bgImage from "../../assets/images/login-bg.jpg";

const ChooseLogin = () => {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${bgImage})`,
      }}
    >
      <div className="min-h-screen bg-white/10 backdrop-blur-[1.5px] flex flex-col">

        {/* Logo */}

        <div className="w-full px-10 pt-8">
          <Logo className="h-16 w-auto" />
        </div>

        {/* Center */}

        <div className="flex-1 flex items-center justify-start pl-24 pr-10 pb-8">

          {/* Glass Card */}

          <div
            className="
              w-full
              max-w-[700px]
              rounded-[32px]
              border
              border-white/70
              bg-white/70
              backdrop-blur-2xl
              shadow-[0_20px_60px_rgba(0,0,0,0.18)]
              px-10
              py-10
              relative
              overflow-hidden
            "
          >
            {/* Gloss Effect */}

            <div
              className="
                absolute
                inset-0
                pointer-events-none
                bg-gradient-to-br
                from-white/40
                via-white/10
                to-transparent
              "
            />

            <div className="relative z-10">

              <AuthHeader
                title="Welcome"
                subtitle="Choose how you want to sign in."
              />

              <div className="space-y-6">

                <LoginOptionCard
                  icon={<MdAdminPanelSettings />}
                  title="Enterprise"
                  description="Platform administration and system management"
                  onClick={() =>
                    navigate("/enterprise/login")
                  }
                />

                <LoginOptionCard
                  icon={<MdBusiness />}
                  title="Tenant"
                  description="Access your organization workspace and data"
                  onClick={() =>
                    navigate("/tenant/organization")
                  }
                />

              </div>

              <AuthFooter />

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default ChooseLogin;