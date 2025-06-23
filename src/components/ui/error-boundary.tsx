import React from 'react';
import { Button } from './button';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    console.error('ErrorBoundary capturou um erro:', error);
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary detalhes do erro:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[400px] flex items-center justify-center">
          <div className="text-center space-y-4 max-w-md">
            <h2 className="text-xl font-bold text-red-600">Oops! Algo deu errado</h2>
            <p className="text-gray-600">
              Ocorreu um erro inesperado. Isso pode ser um problema temporário.
            </p>
            <div className="space-y-2">
              <Button 
                onClick={() => window.location.reload()}
                variant="outline"
                className="mr-2"
              >
                Recarregar Página
              </Button>
              <Button 
                onClick={() => {
                  this.setState({ hasError: false });
                  window.history.back();
                }}
                variant="secondary"
              >
                Voltar
              </Button>
            </div>
            {this.state.error && (
              <details className="text-xs text-gray-400 mt-4">
                <summary className="cursor-pointer">Detalhes técnicos</summary>
                <pre className="mt-2 text-left">{this.state.error.message}</pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}