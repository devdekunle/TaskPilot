import React, { useEffect } from "react";
import { Formik, Form } from "formik";
import axios from "axios";
import * as Yup from "yup";
import { TextInput } from "./formElements";
import "../../styles/form/forms.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "../Modal";
import { useDispatch, useSelector } from "react-redux";
import { openModal } from "../../store/slices/modalSlice";
import { loginUser } from "../../store/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { Rings } from "react-loader-spinner";

export const Login = ({ onClick }) => {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const {
    error: loginError,
    isAuthenticated: user,
    loading,
  } = useSelector((state) => state.auth);

  // handle user login/auth
  const handleSumbit = (values, { resetForm, setSubmitting }) => {
    dispatch(loginUser(values));
    if (user) {
      toast.success("Login Successful");
      resetForm();
    } else {
      if (loginError) {
        toast.error("Login Failed");
      }
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (user) {
      navigate("/user");
    }
  }, [loginError, user, loading, navigate]);

  return (
    <>
      <Formik
        initialValues={{
          email_address: "",
          password: "",
        }}
        // Handle Form Validation
        validationSchema={Yup.object({
          email_address: Yup.string()
            .email("Invalid email address")
            .required("Required"),
          password: Yup.string().required("Password is required"),
        })}
        onSubmit={handleSumbit}
      >
        {({ isSubmitting }) => (
          <Form className="form-container">
            <div className="login-form">
              <h1 className="heading">Login</h1>

              <TextInput
                name="email_address"
                type="email"
                placeholder="email address"
              />

              <TextInput
                name="password"
                type="password"
                placeholder="password"
              />

              <button type="submit" className="btn" disabled={isSubmitting}>
                {isSubmitting ? (
                  <Rings
                    height="30"
                    width="80"
                    radius="9"
                    color="blue"
                    ariaLabel="loading"
                    wrapperStyle
                    wrapperClass
                  />
                ) : (
                  "Submit"
                )}
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
        )}
      </Formik>
    </>
  );
};

// REGISTER FORM
export const Signup = ({ onClick }) => {
  //handle modal logic
  const dispatch = useDispatch();
  // handle user Registration
  const handleUserRegistration = async (
    values,
    { setSubmitting, resetForm }
  ) => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/auth/register",
        values,
        {
          // withCredentials:true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      toast.success(response.data.message);
      // Reset form
      resetForm();
      // dispatch a modal action
      dispatch(openModal());
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status < 500
      )
        toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <>
      <Modal
        modalContent={
          <h3 className="confimation_mail">
            A confirmation token has been sent to your e-mail address{" "}
            <small>kindly click the token to finish your registration...</small>
          </h3>
        }
      />
      ;
      <Formik
        initialValues={{
          first_name: "",
          last_name: "",
          email_address: "",
          password: "",
          confirmPassword: "",
        }}
        // Handle Form Validation
        validationSchema={Yup.object({
          first_name: Yup.string()
            .max(15, "Must be 15 characters or less")
            .required("Required"),
          last_name: Yup.string()
            .max(20, "Must be 20 characters or less")
            .required("Required"),
          email_address: Yup.string()
            .email("Invalid email address")
            .required("Required"),
          password: Yup.string()
            .min(8, "Password must be at least 8 characters")
            .required("Password is required"),
          confirmPassword: Yup.string()
            .oneOf([Yup.ref("password"), null], "Passwords must match")
            .required("Confirm Password is required"),
        })}
        onSubmit={handleUserRegistration}
      >
        {({ isSubmitting }) => (
          <Form className="form-container">
            <div className="signup-form">
              <h1 className="heading"> Sign Up!</h1>
              <TextInput
                label="First Name"
                name="first_name"
                type="text"
                placeholder="Jane"
              />

              <TextInput
                label="Last Name"
                name="last_name"
                type="text"
                placeholder="Doe"
              />

              <TextInput
                label="Email Address"
                name="email_address"
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

              <button type="submit" className="btn" disabled={isSubmitting}>
                {isSubmitting ? (
                  <Rings
                    height="30"
                    width="80"
                    radius="9"
                    color="blue"
                    ariaLabel="loading"
                    wrapperStyle
                    wrapperClass
                  />
                ) : (
                  "Register"
                )}
              </button>
            </div>

            <div className="show-login-form">
              Aleady have an account? <span onClick={onClick}>Login</span>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};
