const SessionExpiredModal = ({
  onExtend,
  onLeave,
  loading = false,
}) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-orange-100 text-2xl font-bold text-orange-600">
            !
          </div>

          <h2 className="text-xl font-semibold text-gray-900">
            Session Expired
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-600">
            Your session has expired. Would you like to extend
            your session or leave?
          </p>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onLeave}
            disabled={loading}
            className="flex-1 rounded-xl border border-gray-300 px-4 py-3 font-semibold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Leave
          </button>

          <button
            type="button"
            onClick={onExtend}
            disabled={loading}
            className="flex-1 rounded-xl bg-green-700 px-4 py-3 font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {loading ? "Extending..." : "Extend Session"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionExpiredModal;