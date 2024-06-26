import "./Profile.css";
import { useSelector } from "react-redux";


export default function Profile() {
  const user = useSelector((state) => state.user);
  const originalDate = new Date(user.createdAt);
  const formattedDate = `${originalDate.getMonth() + 1}/${originalDate.getDate()}/${originalDate.getFullYear()}`;
  

  return (
    <div className="profile d-flex flex-column w-100">
      <div className="profile-header">
        <div className="profile-header-text">
          <h1 className="fs-1">{user.username}</h1>
          <h2 className="fs-5">
            Joined <span className="fw-bold">ZKredit</span> on{" "}
            <span className="fw-bold">{formattedDate}</span>
          </h2>
        </div>
      </div>
    </div>
  );
}
