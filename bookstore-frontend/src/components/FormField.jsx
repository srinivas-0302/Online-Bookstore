export default function FormField({ label, name, error, as = "input", ...inputProps }) {
  const Control = as;   // "input" or "textarea"

  return (
    <div className="form-field">
      <label htmlFor={name}>{label}</label>
      <Control id={name} name={name} {...inputProps} />
      {error && <p className="field-error">{error}</p>}
    </div>
  );
}