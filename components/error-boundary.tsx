"use client";

/**
 * @file error-boundary.tsx
 * @description 에러 바운더리 컴포넌트
 *
 * React 에러 바운더리를 구현하여 예상치 못한 에러를 처리합니다.
 */

import React from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error | null; resetError: () => void }>;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return (
          <FallbackComponent
            error={this.state.error}
            resetError={this.resetError}
          />
        );
      }

      return (
        <DefaultErrorFallback
          error={this.state.error}
          resetError={this.resetError}
        />
      );
    }

    return this.props.children;
  }
}

interface ErrorFallbackProps {
  error: Error | null;
  resetError: () => void;
}

function DefaultErrorFallback({ error, resetError }: ErrorFallbackProps) {
  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-8 py-16">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 border rounded-lg p-8 text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">
          오류가 발생했습니다
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          예상치 못한 오류가 발생했습니다. 페이지를 새로고침하거나 다시 시도해주세요.
        </p>
        {error && process.env.NODE_ENV === "development" && (
          <details className="mb-6 text-left">
            <summary className="cursor-pointer text-sm text-gray-500 dark:text-gray-400 mb-2">
              오류 상세 정보 (개발 모드)
            </summary>
            <pre className="text-xs bg-gray-100 dark:bg-gray-900 p-4 rounded overflow-auto">
              {error.message}
              {error.stack && `\n\n${error.stack}`}
            </pre>
          </details>
        )}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={resetError} variant="outline">
            다시 시도
          </Button>
          <Button
            onClick={() => {
              window.location.href = "/";
            }}
          >
            홈으로 이동
          </Button>
        </div>
      </div>
    </div>
  );
}

