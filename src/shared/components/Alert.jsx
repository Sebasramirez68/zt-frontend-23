export function Alert({ tone = 'danger', children }) {
  if (!children) return null;
  return <p className={`alert alert--${tone}`} role="alert">{children}</p>;
}
