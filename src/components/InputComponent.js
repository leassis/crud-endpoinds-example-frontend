import React from "react";

const Input = ({ label, name, value, required=false, handle }) => {
  return (
    <div className="form-group row mb-2">
      <label htmlFor={name} className="col-sm-2 col-form-label">
        {label}
      </label>
      <div className="col-sm-10">
        <input
          type="text"
          placeholder={`place ${name}`}
          name={name}
          className="form-control"
          value={value}
          required={required}
          onChange={handle}
        />
      </div>
    </div>
  );
};

export default Input;
