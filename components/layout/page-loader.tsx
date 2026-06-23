type PageLoaderProps = {
  label?: string;
};

export function PageLoader({ label = "Loading" }: PageLoaderProps) {
  return (
    <div
      className="page-loader-overlay"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="page-loader" aria-hidden />
      <p className="page-loader-text">{label}</p>
    </div>
  );
}
