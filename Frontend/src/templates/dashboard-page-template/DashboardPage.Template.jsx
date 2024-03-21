import { useState } from "react";
import "./DashboardPage.Template.css";
import { LockIcon, LockOpenIcon } from "assets";
import ModalPage from "pages/modal-page/ModalPage";
import Link from "components/atoms/navigation/Link";
import PageHeader from "components/organisms/page-header/PageHeader";
import Transaction from "components/molecules/transaction/Transaction";
import {
  pageClasses,
  leftClasses,
  txBox,
  rightClasses,
} from "hooks/use-classnames";

export default function DashboardPageTemplate() {
  const [showSession, setShowSession] = useState(false);

  const handleShowSession = () => setShowSession(true);
  const handleCloseSession = () => setShowSession(false);

  return (
    <div className="page-template">
      <PageHeader>
        <h1 className="zkredit-title">ZKredit</h1>
        <h2 className="zkp-heading">built on zero knowledge proofs</h2>
      </PageHeader>
      <div className={pageClasses}>
        <div className={leftClasses}>
          <h3>Recently Received Proofs</h3>
          <div className={txBox}>
            <Transaction
              date="MM/DD/YYYY"
              CRID="85962662313"
              CLID="85962662313"
              verified
            />
            <Transaction
              date="MM/DD/YYYY"
              CRID="85962662313"
              CLID="85962662313"
              declined
            />
            <Transaction
              date="MM/DD/YYYY"
              CRID="85962662313"
              CLID="85962662313"
              pendingThreshold
            />
          </div>
        </div>
        <div className={rightClasses}>
          <div className="client-session-container">
            <button
              className="w-75"
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
            <Link to="/proofs" className="w-75">
              <h2
                className="d-flex justify-content-between align-items-center w-100"
                style={{ fontWeight: "bold", color: "#0000CD" }}
              >
                <LockOpenIcon sx={{ fontSize: "56px" }} /> Browse Received
                Proofs
              </h2>
            </Link>
          </div>
        </div>
      </div>
      <ModalPage show={showSession} handleClose={handleCloseSession}>
        {/**
         * TODO: Use the client session modal content here
         */}
      </ModalPage>
    </div>
  );
}
