import type { ChangeEvent } from "react";

type ToggleProps = {
  id: string;
  label?: string;
  isOn?: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

export const Toggle = ({ id, label, isOn = false, onChange }: ToggleProps) => {
  return (
    <div className="toggle-container">
      <label htmlFor={id}>{label}</label>

      <span className="toggle">
        <input type="checkbox" id={id} checked={isOn} onChange={onChange} />
        <label htmlFor={id}>{label}</label>
      </span>
    </div>
  );
};
