import "./Profile.css";
import AuthContext from "store/auth-context";
import { useContext } from "react";

export default function Profile() {
  const auth = useContext(AuthContext);

  return (
    <div className="profile d-flex flex-column w-100">
      <div className="profile-header">
        <div className="profile-header-text">
          <h1 className="fs-1">{auth.username}</h1>
          <h2 className="fs-5">
            Joined <span className="fw-bold">ZKredit</span> on{" "}
            <span className="fw-bold">MM/DD/YYYY</span>
          </h2>
        </div>
      </div>
    </div>
  );
}
