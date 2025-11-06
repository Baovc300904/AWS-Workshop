import { Component, ReactNode, ErrorInfo } from 'react';
import './ErrorBoundary.css';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="error-boundary-container">
          <div className="error-boundary-icon">⚠️</div>
          <h1 className="error-boundary-title">
            Đã xảy ra lỗi
          </h1>
          <p className="error-boundary-message">
            {this.state.error?.message || 'Có lỗi không xác định xảy ra'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="error-boundary-button"
          >
            🔄 Tải lại trang
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
