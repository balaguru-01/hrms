import logo from "../../assets/images/logo.png";

const Logo = () => {
  return (
    <div
      className="
        fixed
        top-2
        left-2
        z-50
      "
    >
      <img
        src={logo}
        alt="TenantHub"
        className="
          w-[320px]
          h-auto
          select-none
        "
      />
    </div>
  );
};

export default Logo;