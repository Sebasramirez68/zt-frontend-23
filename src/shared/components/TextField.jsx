import { useId } from 'react';

export function TextField({ label, ...inputProps }) {
  const id = useId();
  return (
    <div className="field">
      <label className="field__label" htmlFor={id}>{label}</label>
      <input className="field__input" id={id} {...inputProps} />
    </div>
  );
}
