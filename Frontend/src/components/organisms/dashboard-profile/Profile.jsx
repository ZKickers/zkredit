import "./Profile.css";

export default function Profile() {

  return (
    <div className="profile d-flex flex-column w-100">
      <div className="profile-header">
        <div className="profile-header-text">
          <h1 className="fs-1">zeyadzidan</h1>
          <h2 className="fs-5">
            Joined <span className="fw-bold">ZKredit</span> on{" "}
            <span className="fw-bold">MM/DD/YYYY</span>
          </h2>
        </div>
      </div>
    </div>
  );
}
