import "./DashboardPage.Template.css";
import DashboardHeader from "components/organisms/dashboard-header/DashboardHeader";
import ModalPage from "pages/modal-page/ModalPage";
import { useState } from "react";
import Profile from "components/organisms/dashboard-profile/Profile";
import {
  dashboardClasses,
  transactionsBox,
  transactionsClasses,
  sessions,
} from "./use-classnames";
import { LockIcon, LockOpenIcon } from "assets";
import Link from "components/atoms/navigation/Link";
import Transaction from "components/molecules/transaction/Transaction";

export default function DashboardPageTemplate() {
  const [showProfile, setShowProfile] = useState(false);

  const handleShowProfile = () => setShowProfile(true);
  const handleCloseProfile = () => setShowProfile(false);

  const [showSession, setShowSession] = useState(false);

  const handleShowSession = () => setShowSession(true);
  const handleCloseSession = () => setShowSession(false);

  return (
    <div className="dashboard-page-template">
      <DashboardHeader showProfile={handleShowProfile} />
      <div className={dashboardClasses}>
        <div className={transactionsClasses}>
          <h3>Recent Transactions</h3>
          <div className={transactionsBox}>
            <Transaction date="MM/DD/YYYY" CRID="85962662313" CLID="85962662313" verified={true} />
            <Transaction date="MM/DD/YYYY" CRID="85962662313" CLID="85962662313" />
            <Transaction date="MM/DD/YYYY" CRID="85962662313" CLID="85962662313" verified={true} />
          </div>
        </div>
        <div className={sessions}>
          <div className="client-session-container">
            <button
              className="w-75"
              style={{ whiteSpace: "nowrap" }}
              onClick={handleShowSession}
            >
              <h2
                className="d-flex justify-content-between align-items-center w-100"
                style={{ fontWeight: "bold", color: "#009A2B" }}
              >
                <LockIcon sx={{ fontSize: "56px" }} /> New Client Session
              </h2>
            </button>
          </div>
          <div className="creditor-proofs-container">
            <Link to="/landing" className="w-100">
              <h2
                className="d-flex justify-content-evenly align-items-center w-100"
                style={{ fontWeight: "bold", color: "#FFB800" }}
              >
                <LockOpenIcon sx={{ fontSize: "56px" }} /> Browse Received
                Proofs
              </h2>
            </Link>
          </div>
        </div>
      </div>
      <ModalPage show={showProfile} handleClose={handleCloseProfile}>
        <Profile />
      </ModalPage>
      <ModalPage show={showSession} handleClose={handleCloseSession}>
        {/**
         * TODO: Use the client session modal content here
         */}
      </ModalPage>
    </div>
  );
}
