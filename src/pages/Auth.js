import React, { useState } from "react";
import { Login, Signup } from "../components/forms/authForms";
import { motion } from "framer-motion";
import "../styles/auth.css";

// And now we can use these
export const Auth = () => {
  const [form, setForm] = useState(true);

  const handleToggleForm = () => setForm(!form);

  return (
    <motion.div
      className="auth"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5 }}
    >
      {form ? (
        <Login onClick={handleToggleForm} />
      ) : (
        <Signup onClick={handleToggleForm} />
      )}
    </motion.div>
  );
};
