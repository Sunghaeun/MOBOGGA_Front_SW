import React from "react";

export const Radio = ({ children, value, name, defaultChecked, disabled }) => (
  <label>
    <input
      type="radio"
      value={value}
      name={name}
      defaultChecked={defaultChecked}
      disabled={disabled}
      className="gender-input"
    />
    {children}
  </label>
);
