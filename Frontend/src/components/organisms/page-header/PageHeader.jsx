import classNames from "classnames";
import "./PageHeader.css";
import { LogoutIcon, AccountCircleIcon } from "assets";
import HeaderLeft from "components/molecules/header-left/HeaderLeft";
import { useState } from "react";
import ModalPage from "pages/modal-page/ModalPage";
import Profile from "../dashboard-profile/Profile";
import { useSelector } from "react-redux";
import useLogout from "hooks/useLogout";

export default function PageHeader({ children }) {
  const rightPartClasses = classNames(
    "col-md-5",
    "col-sm-12",
    "d-flex",
    "flex-column",
    "justify-content-center",
    "align-items-md-end",
    "align-items-sm-center"
  );

  const [showProfile, setShowProfile] = useState(false);

  const handleShowProfile = () => setShowProfile(true);
  const handleCloseProfile = () => setShowProfile(false);

  const user = useSelector((state) => state.user);
  const logout = useLogout();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="row container-fluid mx-auto mt-4">
      <HeaderLeft>{children}</HeaderLeft>
      <div className={rightPartClasses}>
        <h3 className="logged-in-header w-75">
          logged in as
          <span className="username">&nbsp; {user.username}</span>
        </h3>
        <div className="options w-75">
          {/* <button onClick={handleShowProfile} className="opt-profile m-0">
            <AccountCircleIcon sx={{ fontSize: "32px" }} />
            <span>Profile</span>
          </button> */}
          {/* <div className="opt-separator"></div> */}
          <button className="opt-logout m-0" onClick={handleLogout}>
            <LogoutIcon sx={{ fontSize: "32px", transform: "scaleX(-1)" }} />
            <span>Logout</span>
          </button>
        </div>
      </div>
      <ModalPage show={showProfile} handleClose={handleCloseProfile}>
        <Profile />
      </ModalPage>
    </div>
  );
}
