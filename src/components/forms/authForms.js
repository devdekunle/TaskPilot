// Handle authentications... Login and Signup

import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { TextInput } from "./formElements";
import "../../styles/form/forms.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const Login = ({ onClick }) => {
  return (
    <>
      <Formik
        initialValues={{
          email: "",
          password: "",
        }}
        // Handle Form Validation
        validationSchema={Yup.object({
          email: Yup.string()
            .email("Invalid email address")
            .required("Required"),
          password: Yup.string().required("Password is required"),
        })}
      
      >
        <Form className="form-container">
          <div className="login-form">
            <h1 className="heading">Login</h1>

            <TextInput
              label="Email Address"
              name="email"
              type="email"
              placeholder="jane@formik.com"
            />

            <TextInput
              label="Password"
              name="password"
              type="password"
              placeholder="********"
            />

            <button type="submit" className="btn">
              Submit
            </button>
          </div>
          <div className="show-login-form">
            Don't have an account? <span onClick={onClick}>Sign up!</span>
          </div>
          <div className="show-login-form forgot-pwd">
            Forgot Password? Click{" "}
            <span onClick={onClick}>Forgot Password</span>
          </div>
        </Form>
      </Formik>
    </>
  );
};

export const Signup = ({ onClick }) => {
  return (
    <>
      <Formik
        initialValues={{
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          confirmPassword: "",
        }}
        // Handle Form Validation
        validationSchema={Yup.object({
          firstName: Yup.string()
            .max(15, "Must be 15 characters or less")
            .required("Required"),
          lastName: Yup.string()
            .max(20, "Must be 20 characters or less")
            .required("Required"),
          email: Yup.string()
            .email("Invalid email address")
            .required("Required"),
          password: Yup.string()
            .min(8, "Password must be at least 8 characters")
            .required("Password is required"),
          confirmPassword: Yup.string()
            .oneOf([Yup.ref("password"), null], "Passwords must match")
            .required("Confirm Password is required"),
        })}
        // Handle Form Submition
        onSubmit={(values, { setSubmitting }) => {
          let value = { ...values, friend: "Olamide" };
          setTimeout(() => {
            alert(JSON.stringify(value, null, 2));
            setSubmitting(false);
          }, 400);

          toast.success('Signup successful')
        }}
      >
        <Form className="form-container">
          <div className="signup-form">
            <h1 className="heading"> Sign Up!</h1>
            <TextInput
              label="First Name"
              name="firstName"
              type="text"
              placeholder="Jane"
            />

            <TextInput
              label="Last Name"
              name="lastName"
              type="text"
              placeholder="Doe"
            />

            <TextInput
              label="Email Address"
              name="email"
              type="email"
              placeholder="jane@formik.com"
            />

            <TextInput
              label="Password"
              name="password"
              type="password"
              placeholder="********"
            />

            <TextInput
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              placeholder="********"
            />

            <button type="submit" className="btn">
              Submit
            </button>
          </div>

          <div className="show-login-form">
            Aleady have an account? <span onClick={onClick}>Login</span>
          </div>
        </Form>
      </Formik>
    </>
  );
};
