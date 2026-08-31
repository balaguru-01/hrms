import { MdLock } from "react-icons/md";

const AuthFooter = ({
  text = "Secure authentication powered by TenantHub",
  className = "mt-8",
}) => {
  return (
    <div
      className={`${className} flex items-center justify-center gap-2 text-sm text-gray-500`}
    >
      <MdLock className="relative" />
      <span>{text}</span>
    </div>
  );
};

export default AuthFooter;