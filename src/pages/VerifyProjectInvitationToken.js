import "../styles/form/token-verification.css";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
import { FaSpinner } from "react-icons/fa";
// import jwtDecode from "jwt-decode";

const VerifyProjectInvitationToken = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);

  // Verify Token
  const verifyToken = async () => {
    const token = searchParams.get("token");
    // const decodedToken = jwtDecode(token);
    // console.log(decodedToken);
    try {
      const response = await axios.get(
        `http://127.0.0.1:5000/auth/verify_invite/${token}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      if (response.status >= 200 && response.status < 300) {
        toast.success("Successful");
        navigate("/user/projects");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="token_verification">
      <Formik onSubmit={verifyToken}>
        {({ isSubmitting }) => (
          <Form>
            <div className="project-invitation">
              <p>You were invited to a project, Kindly select an action!</p>
              <div className="btns">
                <button type="submit" className="btn" disabled={isSubmitting}>
                  {isSubmitting ? <FaSpinner className="spinner" /> : "Accept"}
                </button>
                <Link to="/user" replace>
                  <button
                    type="reset"
                    className="btn"
                    onClick={() => {
                      toast.success("Declined Invitation");
                    }}
                  >
                    Decline
                  </button>
                </Link>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default VerifyProjectInvitationToken;
