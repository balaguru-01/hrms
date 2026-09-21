import { useNavigate } from "react-router-dom";
import {
  MdExplore,
  MdHome,
} from "react-icons/md";

import notFoundImage from "../../assets/images/errors/page-not-found.png";
import { ROUTES } from "../../utils/constants/routes";

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoToDashboard = () => {
    navigate(
      ROUTES.ENTERPRISE_DASHBOARD,
      {
        replace: true,
      }
    );
  };

  const handleExplore = () => {
    navigate(
      ROUTES.HOME,
      {
        replace: true,
      }
    );
  };

  return (
    <div
      className="relative min-h-screen w-full bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${notFoundImage})`,
      }}
    >
      <div className="absolute bottom-[10%] left-1/2 flex -translate-x-1/2 flex-col items-center gap-3 sm:flex-row">
        <button
          type="button"
          onClick={handleGoToDashboard}
          className="flex min-w-[220px] items-center justify-center gap-2 rounded-xl bg-green-700 px-6 py-3 font-semibold text-white shadow-lg transition hover:bg-green-800"
        >
          <MdHome size={22} />
          Go to Dashboard
        </button>

        <button
          type="button"
          onClick={handleExplore}
          className="flex min-w-[160px] items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 shadow-lg transition hover:bg-gray-50"
        >
          <MdExplore size={22} />
          Explore
        </button>
      </div>
    </div>
  );
};

export default NotFound;