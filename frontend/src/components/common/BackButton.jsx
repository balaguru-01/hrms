import { MdArrowBack } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const BackButton = ({ to = "/", text = "Back" }) => {
  const navigate = useNavigate();

  return (
    <button type="button" onClick={() => navigate(to)} className="inline-flex items-center gap-2 font-medium text-green-700 transition-colors hover:text-green-800">
      <MdArrowBack size={20} />
      <span>{text}</span>
    </button>
  );
};

export default BackButton;