import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError() {
    return {
      hasError: true,
    };
  }

  componentDidCatch(error, info) {
    console.error("ShopMate Error:", error, info);
  }

  handleRefresh = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            padding: "30px",
            background: "#f8fafc",
          }}
        >
          <div
            style={{
              fontSize: "60px",
              marginBottom: "20px",
            }}
          >
            😕
          </div>

          <h1
            style={{
              marginBottom: "10px",
              color: "#111827",
            }}
          >
            Something went wrong
          </h1>

          <p
            style={{
              color: "#6b7280",
              maxWidth: "450px",
              lineHeight: "1.6",
              marginBottom: "25px",
            }}
          >
            We're sorry, but something unexpected happened.
            Please refresh the page and try again.
          </p>

          <button
            type="button"
            onClick={this.handleRefresh}
            style={{
              background: "#2563eb",
              color: "#fff",
              border: "none",
              padding: "12px 22px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "15px",
            }}
          >
            🔄 Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;