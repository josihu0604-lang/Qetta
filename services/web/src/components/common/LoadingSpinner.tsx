/**
 * Loading Spinner component
 * Full-page loading indicator
 */
export function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-zinc-200 border-t-primary-600 mb-4" />
        <p className="text-zinc-600">로딩 중...</p>
      </div>
    </div>
  );
}

/**
 * Inline Loading Spinner
 * Small spinner for buttons or inline use
 */
export function InlineSpinner({ className = '' }: { className?: string }) {
  return (
    <div
      className={`inline-block animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent ${className}`}
    />
  );
}
