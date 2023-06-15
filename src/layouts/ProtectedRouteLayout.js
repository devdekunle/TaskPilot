import React, { useEffect } from "react";
import { Formik, Form } from "formik";
import { TextInput } from "../components/forms/formElements";
import SideNav from "../components/SideNav";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

import "../styles/protected-page.css";
import { BsSearch, BsBell } from "react-icons/bs";

const ProtectedRouteLayout = () => {
  const { userData } = useSelector((state) => state?.auth);
  const { first_name: firstName, last_name: lastName } = userData;

  useEffect(() => {}, [userData, firstName, lastName]);

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
          <BsBell className="bell_icon" />

          <div className="user_profile_pic">
            {`${firstName[0]}${lastName[0]}`}
          </div>
          <p className="user_name">{`${firstName} ${lastName}`}</p>
        </div>
      </div>
      <SideNav />
      <Outlet />
    </div>
  );
};

export default ProtectedRouteLayout;
