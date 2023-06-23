import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaSpinner } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../styles/form/token-verification.css";
import { toast } from "react-toastify";
import { BASE_URL } from "../api/api";

const TokenVerification = () => {
  const [errorMsg, setErrorMsg] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get("token");

    if (token) {
      verifyToken(token);
    }
  }, [location.search]);

  // Verify Token
  const verifyToken = async (token) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/auth/verify_email/${token}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status >= 200 && response.status < 300) {
        toast.success("Registration Successful, Login to begin!");
        navigate("/auth");
      }
    } catch (error) {
      toast.error(error.message);
      setErrorMsg(true);
    }
  };

  return (
    <>
      <div className="token_verification">
        {!errorMsg ? (
          <p>
            <FaSpinner className="spinner token_spinner" />
            Kindly wait for a few seconds <br />
            verifying your registration token... <br />
          </p>
        ) : (
          <div>
            Something went wrong with your token verification <br />
            Kindly try to re-register...
            <Link to={"/auth"}>
              <button className="btn">Go to Registration</button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default TokenVerification;
