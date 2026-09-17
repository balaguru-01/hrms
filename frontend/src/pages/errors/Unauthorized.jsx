import { useNavigate } from "react-router-dom";
import { MdHome } from "react-icons/md";

import unauthorizedImage from "../../assets/images/errors/unauthorized-access.png";
import { ROUTES } from "../../utils/constants/routes";

const Unauthorized = () => {
  const navigate = useNavigate();

  const handleGoToDashboard = () => {
    navigate(
      ROUTES.ENTERPRISE_DASHBOARD,
      {
        replace: true,
      }
    );
  };

  return (
    <div
      className="relative min-h-screen w-full bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${unauthorizedImage})`,
      }}
    >
      <button
        type="button"
        onClick={handleGoToDashboard}
        className="absolute bottom-[10%] left-1/2 flex min-w-[220px] -translate-x-1/2 items-center justify-center gap-2 rounded-xl bg-green-700 px-6 py-3 font-semibold text-white shadow-lg transition hover:bg-green-800"
      >
        <MdHome size={22} />
        Go to Dashboard
      </button>
    </div>
  );
};

export default Unauthorized;