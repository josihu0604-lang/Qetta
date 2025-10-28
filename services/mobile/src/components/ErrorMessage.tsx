/**
 * Error Message Component
 * 
 * Displays error messages with retry functionality.
 */

import { Button, Text, Heading } from '@hephaitos/ui';

interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  fullScreen?: boolean;
}

export function ErrorMessage({
  title = '오류가 발생했습니다',
  message,
  onRetry,
  fullScreen = false,
}: ErrorMessageProps) {
  const content = (
    <div className="text-center">
      <div className="mb-4 text-5xl">⚠️</div>
      <Heading level={3} className="mb-2 text-red-600 dark:text-red-400">
        {title}
      </Heading>
      <Text className="mb-6 text-gray-600 dark:text-gray-400">{message}</Text>
      {onRetry && (
        <Button onClick={onRetry} color="primary">
          다시 시도
        </Button>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-gray-950">
        {content}
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-red-50 p-6 dark:bg-red-950/20">
      {content}
    </div>
  );
}
