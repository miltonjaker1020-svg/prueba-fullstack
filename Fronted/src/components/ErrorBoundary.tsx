import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  message: string | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, message: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('Error capturado por el boundary:', error, info.componentStack);
  }

  private handleReload = (): void => {
    window.location.reload();
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="error-boundary" role="alert">
          <h1>Algo salió mal</h1>
          <p>
            Ocurrió un error al renderizar esta parte de la aplicación. No es culpa
            tuya — puedes intentar recargar la página.
          </p>
          {this.state.message && <pre>{this.state.message}</pre>}
          <button type="button" onClick={this.handleReload}>
            Recargar página
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
