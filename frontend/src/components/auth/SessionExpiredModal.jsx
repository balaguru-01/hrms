import { MdWarning } from "react-icons/md";

import DynamicConfirmationModal from "../Modals/DynamicConfirmationModal";

const SessionExpiredModal = ({
  onExtend,
  onLeave,
  loading = false,
}) => {
  return (
    <DynamicConfirmationModal
      open={true}
      title="Session Expired"
      description="Your session has expired. Would you like to extend your session or leave?"
      confirmLabel={
        loading
          ? "Extending..."
          : "Extend Session"
      }
      cancelLabel="Leave"
      onConfirm={onExtend}
      onCancel={onLeave}
      icon={<MdWarning />}
      iconClassName="text-orange-600"
    />
  );
};

export default SessionExpiredModal;