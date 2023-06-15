import React from "react";
import { useField } from "formik";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export const TextInput = ({ label, as, ...props }) => {
  // useField() returns [formik.getFieldProps(), formik.getFieldMeta()]
  // which we can spread on <input>. We can use field meta to show an error
  // message if the field is invalid and it has been touched (i.e. visited)
  const [field, meta] = useField(props);

  if (as === "textarea") {
    return (
      <>
        <label htmlFor={props.id || props.name}>{label}</label>
        <textarea className="text-input" {...field} {...props} />
        {meta.touched && meta.error ? (
          <div className="form-error">{meta.error}</div>
        ) : null}
      </>
    );
  }

  return (
    <>
      <label htmlFor={props.id || props.name}>{label}</label>
      <input className="text-input" {...field} {...props} />
      {meta.touched && meta.error ? (
        <div className="form-error">{meta.error}</div>
      ) : null}
    </>
  );
};

export const Checkbox = ({ children, onChange, className, ...props }) => {
  const [field, meta] = useField({ ...props, type: "checkbox" });
  return (
    <div>
      <label className={className}>
        <input type="checkbox" {...field} {...props} onChange={onChange} />
        <span>{children}</span>
      </label>
      {meta.touched && meta.error ? (
        <div className="error">{meta.error}</div>
      ) : null}
    </div>
  );
};

export const Select = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <div>
      <label htmlFor={props.id || props.name}>{label}</label>
      <select {...field} {...props} />
      {meta.touched && meta.error ? (
        <div className="error">{meta.error}</div>
      ) : null}
    </div>
  );
};

export const Radio = ({ children, ...props }) => {
  const [field, meta] = useField({ ...props, type: "radio" });
  return (
    <div className="radio-btn">
      <label className="radio-input">
        {children}
        <input type="radio" {...field} {...props} />
      </label>
      {meta.touched && meta.error ? (
        <div className="error">{meta.error}</div>
      ) : null}
    </div>
  );
};

export const QuillTextArea = ({ label, ...props }) => {
  const [field, meta, helpers] = useField(props.name);

  const handleQuillChange = (value) => {
    helpers.setValue(value); // Update the form field value
  };

  return (
    <div>
      <label htmlFor={props.name}>{label}</label>
      <ReactQuill
        value={field.value}
        onChange={handleQuillChange}
        placeholder="Kindly Enter Task Description"
      />

      {meta.touched && meta.error && <div>{meta.error.toString()}</div>}
    </div>
  );
};
