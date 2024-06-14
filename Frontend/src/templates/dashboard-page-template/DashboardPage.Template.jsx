import { useContext, useState } from "react";
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
import ClientConnectRequestForm from "components/organisms/client-connect-request-form/ClientConnectRequestForm";
import { useFetchTransactionsQuery } from "store";
import AuthContext from "store/auth-context";
import Skeleton from "components/molecules/skeleton/Skeleton";
import classNames from "classnames";

export default function DashboardPageTemplate() {
  const [showSession, setShowSession] = useState(false);

  const handleShowSession = () => setShowSession(true);
  const handleCloseSession = () => setShowSession(false);

  const auth = useContext(AuthContext);

  const { data, error, isFetching } = useFetchTransactionsQuery({
    accountId: auth.accountId,
    token: auth.token,
    type: "creditor",
  });

  let content;

  if (isFetching) {
    return <Skeleton />;
  } else if (error) {
    content = <div>Error loading transactions...</div>;
  } else {
    content = data.map((tx) => {
      return (
        <Transaction
          key={tx._id}
          txId={tx._id}
          token={auth.token}
          clientFullName={tx.fullNameOfClient}
          creditorId={tx.creditorAccountId}
          updateDate={tx.updatedAt}
          status={tx.status}
        />
      );
    });
  }

  return (
    <div className="page-template">
      <PageHeader>
        <h1 className="zkredit-title">ZKredit</h1>
        <h2 className="zkp-heading">built on zero knowledge proofs</h2>
      </PageHeader>
      <div className={pageClasses}>
        <div className={leftClasses}>
          <h3>Recently Received Proofs</h3>
          <div className={classNames(txBox, "height-60")}>{content}</div>
        </div>
        <div className={classNames(rightClasses, "justify-content-center")}>
          <div className="client-session-container">
            <button className="w-75" onClick={handleShowSession}>
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
        <ClientConnectRequestForm handleClose={handleCloseSession} />
      </ModalPage>
    </div>
  );
}
