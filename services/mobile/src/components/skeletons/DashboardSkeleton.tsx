/**
 * Dashboard Skeleton Loading Component
 * 
 * Provides a loading placeholder for the dashboard page
 * to improve perceived performance and prevent layout shift.
 */

export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20 dark:bg-gray-950">
      {/* Header Skeleton */}
      <div className="animate-pulse bg-blue-600 px-4 pb-6 pt-8">
        <div className="h-4 w-24 rounded bg-blue-500" />
        <div className="mt-2 h-8 w-48 rounded bg-blue-500" />
        <div className="mt-2 h-3 w-32 rounded bg-blue-500/70" />
      </div>

      {/* Net Worth Card Skeleton */}
      <div className="-mt-4 px-4">
        <div className="animate-pulse rounded-lg bg-white p-6 shadow dark:bg-gray-900">
          <div className="mb-4 flex items-center justify-between">
            <div className="h-4 w-16 rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-6 w-16 rounded-full bg-gray-200 dark:bg-gray-700" />
          </div>
          <div className="h-10 w-40 rounded bg-gray-200 dark:bg-gray-700" />
          
          <div className="mt-4 grid grid-cols-2 gap-4 border-t border-gray-200 pt-4 dark:border-gray-700">
            <div>
              <div className="h-3 w-12 rounded bg-gray-200 dark:bg-gray-700" />
              <div className="mt-2 h-5 w-24 rounded bg-gray-200 dark:bg-gray-700" />
            </div>
            <div>
              <div className="h-3 w-12 rounded bg-gray-200 dark:bg-gray-700" />
              <div className="mt-2 h-5 w-24 rounded bg-gray-200 dark:bg-gray-700" />
            </div>
          </div>
        </div>
      </div>

      {/* Credit Score Skeleton */}
      <div className="mt-6 px-4">
        <div className="animate-pulse rounded-lg bg-white p-4 shadow dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <div>
              <div className="h-4 w-16 rounded bg-gray-200 dark:bg-gray-700" />
              <div className="mt-2 h-7 w-20 rounded bg-gray-200 dark:bg-gray-700" />
            </div>
            <div className="h-16 w-16 rounded-full bg-gray-200 dark:bg-gray-700" />
          </div>
          <div className="mt-3 h-2 rounded-full bg-gray-200 dark:bg-gray-700" />
        </div>
      </div>

      {/* Quick Actions Skeleton */}
      <div className="mt-6 px-4">
        <div className="mb-3 h-6 w-20 rounded bg-gray-200 dark:bg-gray-700" />
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-10 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"
            />
          ))}
        </div>
      </div>

      {/* Insights Skeleton */}
      <div className="mt-6 px-4">
        <div className="mb-3 h-6 w-32 rounded bg-gray-200 dark:bg-gray-700" />
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="animate-pulse rounded-lg bg-gray-100 p-4 dark:bg-gray-800"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="h-5 w-32 rounded bg-gray-200 dark:bg-gray-700" />
                  <div className="mt-2 h-4 w-48 rounded bg-gray-200 dark:bg-gray-700" />
                </div>
                <div className="h-6 w-12 rounded-full bg-gray-200 dark:bg-gray-700" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Transactions Skeleton */}
      <div className="mt-6 px-4 pb-6">
        <div className="mb-3 flex items-center justify-between">
          <div className="h-6 w-20 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-4 w-16 rounded bg-gray-200 dark:bg-gray-700" />
        </div>
        <div className="animate-pulse rounded-lg bg-white shadow dark:bg-gray-900">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="h-5 w-24 rounded bg-gray-200 dark:bg-gray-700" />
                  <div className="mt-2 h-3 w-20 rounded bg-gray-200 dark:bg-gray-700" />
                </div>
                <div className="h-6 w-24 rounded bg-gray-200 dark:bg-gray-700" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
