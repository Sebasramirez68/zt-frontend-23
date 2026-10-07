export function Button({ variant = 'primary', loading = false, disabled = false, children, ...props }) {
  return (
    <button className={`btn btn--${variant}`} disabled={loading || disabled} aria-busy={loading} {...props}>
      {children}
    </button>
  );
}
