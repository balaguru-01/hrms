import { MdLock } from "react-icons/md";

const AuthFooter = ({ text = "Secure authentication powered by TenantHub" }) => {
  return (
    <div className="mt-8 flex items-center justify-center gap-2 text-sm text-gray-500">
      <MdLock />
      <span>{text}</span>
    </div>
  );
};

export default AuthFooter;