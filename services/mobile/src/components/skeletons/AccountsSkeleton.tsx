/**
 * Accounts Page Skeleton Loading Component
 */

export function AccountsSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20 dark:bg-gray-950">
      {/* Header Skeleton */}
      <div className="animate-pulse bg-white px-4 py-6 shadow-sm dark:bg-gray-900">
        <div className="h-8 w-32 rounded bg-gray-200 dark:bg-gray-700" />
        <div className="mt-2 h-4 w-48 rounded bg-gray-200 dark:bg-gray-700" />
      </div>

      {/* Summary Cards Skeleton */}
      <div className="mt-6 grid grid-cols-2 gap-4 px-4">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="animate-pulse rounded-lg bg-gray-100 p-4 dark:bg-gray-800"
          >
            <div className="h-3 w-12 rounded bg-gray-200 dark:bg-gray-700" />
            <div className="mt-2 h-7 w-24 rounded bg-gray-200 dark:bg-gray-700" />
          </div>
        ))}
      </div>

      {/* Quick Actions Skeleton */}
      <div className="mt-6 px-4">
        <div className="grid grid-cols-2 gap-3">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-10 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"
            />
          ))}
        </div>
      </div>

      {/* Account Cards Skeleton */}
      {[1, 2, 3].map((section) => (
        <div key={section} className="mt-6 px-4">
          <div className="mb-3 h-6 w-32 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="animate-pulse rounded-lg bg-white p-4 shadow-sm dark:bg-gray-900"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700" />
                    <div className="flex-1">
                      <div className="h-5 w-24 rounded bg-gray-200 dark:bg-gray-700" />
                      <div className="mt-2 h-4 w-32 rounded bg-gray-200 dark:bg-gray-700" />
                      <div className="mt-2 h-3 w-20 rounded bg-gray-200 dark:bg-gray-700" />
                    </div>
                  </div>
                  <div className="h-6 w-12 rounded-full bg-gray-200 dark:bg-gray-700" />
                </div>
                <div className="my-3 border-t border-gray-200 dark:border-gray-700" />
                <div className="flex items-center justify-between">
                  <div className="h-4 w-12 rounded bg-gray-200 dark:bg-gray-700" />
                  <div className="h-6 w-24 rounded bg-gray-200 dark:bg-gray-700" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
