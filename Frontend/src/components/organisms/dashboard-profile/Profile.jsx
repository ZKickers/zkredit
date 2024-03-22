import "./Profile.css";
import AuthContext from "store/auth-context";
import { useContext } from "react";

export default function Profile() {
  const auth = useContext(AuthContext);
  const originalDate = new Date(auth.createdAt);
  const formattedDate = `${originalDate.getMonth() + 1}/${originalDate.getDate()}/${originalDate.getFullYear()}`;
  

  return (
    <div className="profile d-flex flex-column w-100">
      <div className="profile-header">
        <div className="profile-header-text">
          <h1 className="fs-1">{auth.username}</h1>
          <h2 className="fs-5">
            Joined <span className="fw-bold">ZKredit</span> on{" "}
            <span className="fw-bold">{formattedDate}</span>
          </h2>
        </div>
      </div>
    </div>
  );
}
