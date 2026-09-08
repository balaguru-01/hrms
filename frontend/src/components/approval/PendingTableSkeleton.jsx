const PendingTableSkeleton = () => {
  return (
    <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">

      <div className="border-b border-gray-100 px-6 py-5">
        <div className="h-7 w-64 animate-pulse rounded bg-gray-200"></div>

        <div className="mt-3 h-4 w-96 animate-pulse rounded bg-gray-100"></div>
      </div>

      <div className="divide-y divide-gray-100">

        {[1, 2, 3, 4, 5].map((item) => (
          <div
            key={item}
            className="flex items-center justify-between px-6 py-6"
          >
            <div className="flex items-center gap-4">

              <div className="h-12 w-12 animate-pulse rounded-2xl bg-gray-200"></div>

              <div>

                <div className="h-5 w-44 animate-pulse rounded bg-gray-200"></div>

                <div className="mt-2 h-4 w-28 animate-pulse rounded bg-gray-100"></div>

              </div>

            </div>

            <div className="h-5 w-32 animate-pulse rounded bg-gray-100"></div>

            <div className="h-5 w-36 animate-pulse rounded bg-gray-100"></div>

            <div className="h-8 w-24 animate-pulse rounded-full bg-gray-200"></div>

            <div className="flex gap-3">

              <div className="h-10 w-10 animate-pulse rounded-xl bg-gray-200"></div>

              <div className="h-10 w-10 animate-pulse rounded-xl bg-gray-200"></div>

              <div className="h-10 w-10 animate-pulse rounded-xl bg-gray-200"></div>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
};

export default PendingTableSkeleton;