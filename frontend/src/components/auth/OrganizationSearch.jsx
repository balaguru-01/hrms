// src/components/auth/OrganizationSearch.jsx

import { MdSearch } from "react-icons/md";
import InputField from "../forms/InputField";

const OrganizationSearch = ({
  value,
  onChange,
}) => {
  return (
    <InputField
      label="Organization Name"
      type="text"
      placeholder="Search your organization..."
      value={value}
      onChange={onChange}
      icon={<MdSearch size={20} />}
    />
  );
};

export default OrganizationSearch;