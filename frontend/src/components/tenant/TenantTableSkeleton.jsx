const SkeletonRow = () => (
  <tr className="border-b border-gray-100">

    <td className="px-6 py-5">
      <div className="h-5 w-44 animate-pulse rounded bg-gray-200" />
    </td>

    <td className="px-6 py-5">
      <div className="h-5 w-36 animate-pulse rounded bg-gray-200" />
    </td>

    <td className="px-6 py-5">
      <div className="h-5 w-48 animate-pulse rounded bg-gray-200" />
    </td>

    <td className="px-6 py-5">
      <div className="h-5 w-20 animate-pulse rounded bg-gray-200" />
    </td>

    <td className="px-6 py-5">
      <div className="h-5 w-24 animate-pulse rounded bg-gray-200" />
    </td>

    <td className="px-6 py-5">
      <div className="flex gap-3">
        <div className="h-9 w-9 animate-pulse rounded-xl bg-gray-200" />
        <div className="h-9 w-9 animate-pulse rounded-xl bg-gray-200" />
        <div className="h-9 w-9 animate-pulse rounded-xl bg-gray-200" />
      </div>
    </td>

  </tr>
);

const TenantTableSkeleton = () => {
  return (
    <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">

      <table className="w-full">

        <thead className="bg-gray-50">

          <tr>

            <th className="px-6 py-5 text-left">
              <div className="h-5 w-32 animate-pulse rounded bg-gray-200" />
            </th>

            <th className="px-6 py-5 text-left">
              <div className="h-5 w-24 animate-pulse rounded bg-gray-200" />
            </th>

            <th className="px-6 py-5 text-left">
              <div className="h-5 w-28 animate-pulse rounded bg-gray-200" />
            </th>

            <th className="px-6 py-5 text-left">
              <div className="h-5 w-20 animate-pulse rounded bg-gray-200" />
            </th>

            <th className="px-6 py-5 text-left">
              <div className="h-5 w-20 animate-pulse rounded bg-gray-200" />
            </th>

            <th className="px-6 py-5 text-left">
              <div className="h-5 w-24 animate-pulse rounded bg-gray-200" />
            </th>

          </tr>

        </thead>

        <tbody>

          {[1, 2, 3, 4, 5].map((item) => (
            <SkeletonRow key={item} />
          ))}

        </tbody>

      </table>

    </div>
  );
};

export default TenantTableSkeleton;