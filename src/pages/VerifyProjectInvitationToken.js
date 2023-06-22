import "../styles/form/token-verification.css";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useLocation, useNavigate } from "react-router-dom";

const VerifyProjectInvitationToken = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);

  // Verify Token
  const verifyToken = async () => {
    const token = searchParams.get("token");
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
      <div className="project-invitation">
        <p>You were invited to a project, Kindly select an action!</p>
        <div className="btns">
          <button type="submit" className="btn" onClick={verifyToken}>
            Accept
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
    </div>
  );
};

export default VerifyProjectInvitationToken;
