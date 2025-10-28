/**
 * Error Boundary Component
 * 
 * Catches React errors and displays fallback UI.
 */

'use client';

import { Component, ReactNode } from 'react';
import { ErrorMessage } from './ErrorMessage';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error Boundary caught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorMessage
          title="앱 오류"
          message={
            this.state.error?.message ||
            '예상치 못한 오류가 발생했습니다. 페이지를 새로고침해주세요.'
          }
          onRetry={() => {
            this.setState({ hasError: false, error: undefined });
            window.location.reload();
          }}
          fullScreen
        />
      );
    }

    return this.props.children;
  }
}
