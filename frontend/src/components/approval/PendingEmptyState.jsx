import { MdHourglassEmpty } from "react-icons/md";

const PendingEmptyState = ({
  title,
  description,
}) => {
  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-14 text-center shadow-sm">

      <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-yellow-100">

        <MdHourglassEmpty className="text-5xl text-yellow-600" />

      </div>

      <h2 className="mt-6 text-2xl font-bold text-gray-900">
        {title}
      </h2>

      <p className="mx-auto mt-3 max-w-lg text-gray-500">
        {description}
      </p>

    </div>
  );
};

export default PendingEmptyState;