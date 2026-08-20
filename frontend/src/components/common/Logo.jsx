import logo from "../../assets/images/logo.png";

const Logo = ({ className = "" }) => {
  return (
    <img
      src={logo}
      alt="TenantHub"
      className={`w-auto h-12 object-contain ${className}`}
    />
  );
};

export default Logo;