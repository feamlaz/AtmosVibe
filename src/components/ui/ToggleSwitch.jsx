export default function ToggleSwitch({ checked, onChange, label }) {
  return (
    <label className="toggle">
      <input
        className="toggle-input"
        type="checkbox"
        checked={checked}
        onChange={onChange}
      />
      <span className="toggle-track" aria-hidden="true">
        <span className="toggle-thumb" />
      </span>
      <span className="toggle-label">{label}</span>
    </label>
  );
}
