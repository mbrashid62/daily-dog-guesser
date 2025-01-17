import { Component, ErrorInfo, ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<
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
    // Update state to show fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // TODO: send this to Sentry or something similar.
    console.error("Error caught by ErrorBoundary:", error);
    console.error("Error details:", errorInfo);
  }

  handleRetry = () => {
    // reset the error boundary state and attempt to render children again
    // TODO: should we refresh the page?
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ textAlign: "left" }}>
          <h1>Something went wrong.</h1>
          <p>
            Sorry about that. Feel free to
            <a
              href="https://github.com/mbrashid62/daily-dog-guesser/issues"
              target="_blank"
              rel="noopener noreferrer"
            >
              {" "}
              create an Issue{" "}
            </a>
            on GitHub.
          </p>
          <button onClick={this.handleRetry} style={{ marginTop: "1rem" }}>
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
