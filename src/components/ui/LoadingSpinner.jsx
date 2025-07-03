export default function LoadingSpinner() {
  return (
    <div className="d-flex justify-content-center align-items-center py-5"> {/* Flexbox to center spinner and text */}
      <div className="spinner-border text-primary me-2" role="status"> {/* Bootstrap spinner */}
        <span className="visually-hidden">Loading...</span> {/* Screen reader text */}
      </div>
      <span className="text-muted">Loading...</span> {/* Optional: text next to spinner */}
    </div>
  );
}