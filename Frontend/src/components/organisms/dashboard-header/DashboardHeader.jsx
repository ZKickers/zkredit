import classNames from "classnames";
import "./DashboardHeader.css";
import { LogoutIcon, AccountCircleIcon } from "assets";

export default function DashboardHeader({ showProfile }) {
  const leftPartClasses = classNames(
    "col-md-7",
    "col-sm-12",
    "d-flex",
    "flex-column",
    "align-items-md-start",
    "justify-content-sm-center",
    "align-items-sm-center"
  );
  const rightPartClasses = classNames(
    "col-md-5",
    "col-sm-12",
    "d-flex",
    "flex-column",
    "justify-content-center",
    "align-items-md-end",
    "align-items-sm-center"
  );

  return (
    <div className="row container-fluid mx-auto mt-4">
      <div className={leftPartClasses}>
        <h1 className="zkredit-title">ZKredit</h1>
        <h2 className="zkp-heading">built on zero knowledge proofs</h2>
      </div>
      <div className={rightPartClasses}>
        <h3 className="logged-in-header w-75">
          logged in as
          {/**
           * TODO: HANDLE DYNAMIC USERNAME FETCHING
           */}
          <span className="dashboard-username">&nbsp; zeyadzidan</span>
        </h3>
        <div className="dashboard-options w-75">
          <button onClick={showProfile} className="opt-profile m-0">
            <AccountCircleIcon sx={{ fontSize: "32px" }} />
            <span>Profile</span>
          </button>
          <div className="opt-separator"></div>
          <button className="opt-logout m-0">
            <LogoutIcon sx={{ fontSize: "32px", transform: "scaleX(-1)" }} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}
