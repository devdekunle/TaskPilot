import React from "react";
import { Formik, Form } from "formik";
import { TextInput } from "../components/forms/formElements";
import SideNav from "../components/SideNav";
import { Outlet } from "react-router-dom";
import "../styles/protected-page.css";
import { BsSearch, BsBell } from 'react-icons/bs';

const ProtectedRouteLayout = () => {
  return (
    <div className="protected-route-container">
      <div className="header">
        <div className="search_bar">
          <BsSearch />
          <Formik
            initialValues={{
              searchKeyword: "",
            }}
            // Handle Login Form Submition
            onSubmit={(values, { setSubmitting }) => {
              setTimeout(() => {
                alert(JSON.stringify(values, null, 2));
                setSubmitting(false);
              }, 400);
            }}
          >
            <Form>
              <TextInput
                name="searchKeyword"
                type="text"
                placeholder="search"
              />
              <button type="submit" className="btn">
                Submit
              </button>
            </Form>
          </Formik>
        </div>
        <div className="extras">
          <BsBell className="bell_icon"/>

          <div className="user_profile_pic">AB</div>
          <p className="user_name">Abraham S. Adekunle</p>
        </div>
      </div>
      <SideNav />
      <Outlet />
    </div>
  );
};

export default ProtectedRouteLayout;
