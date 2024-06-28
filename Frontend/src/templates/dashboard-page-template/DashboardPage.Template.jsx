import { useState, useEffect } from "react";
import "./DashboardPage.Template.css";
import { CallReceivedIcon, EnhancedEncryptionIcon, LockIcon, LockOpenIcon, SendIcon } from "assets";
import CachedIcon from "@mui/icons-material/Cached";
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
import Skeleton from "components/molecules/skeleton/Skeleton";
import classNames from "classnames";
import { useSelector } from "react-redux";
import useFetchTransactions from "API/useFetchTransactions";

export default function DashboardPageTemplate() {
  const [showSession, setShowSession] = useState(false);

  const user = useSelector((state) => state.user);
  const creditorTransactions = useSelector(
    (state) => state.creditorTransactions
  );
  const clientTransactions = useSelector((state) => state.clientTransactions);
  const fetchTransactions = useFetchTransactions();

  useEffect(() => {
    if (creditorTransactions.status === "idle") {
      fetchTransactions({ accountId: user.accountId, type: "creditor" });
    }
    if (clientTransactions.status === "idle") {
      fetchTransactions({ accountId: user.accountId, type: "client" });
    }
  }, []);

  const handleShowSession = () => setShowSession(true);
  const handleCloseSession = () => setShowSession(false);
  const handleReload = () => {
    fetchTransactions({ accountId: user.accountId, type: "creditor" });
    fetchTransactions({ accountId: user.accountId, type: "client" });
  };

  const renderContent = () => {
    if (
      creditorTransactions.status === "loading" ||
      clientTransactions.status === "loading"
    ) {
      return <Skeleton />;
    }

    if (creditorTransactions.error || clientTransactions.error) {
      console.error(
        `${creditorTransactions.error} ${clientTransactions.error}`
      );
      return <div>Error loading transactions...</div>;
    }

    const transactions = [
      ...creditorTransactions.transactions.map(tx => ({ ...tx, isClient: false })),
      ...clientTransactions.transactions.map(tx => ({ ...tx, isClient: true })),
    ].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    

    return transactions.map((tx) => (
      <Transaction
        key={tx._id}
        txId={tx._id}
        clientFullName={tx.fullNameOfClient}
        isClient={tx.isClient}
        creditorUsername={tx.creditorUsername}
        updateDate={tx.updatedAt}
        status={tx.status}
      />
    ));
  };

  return (
    <div className="page-template">
      <PageHeader>
        <h1 className="zkredit-title">ZKredit</h1>
        <h2 className="zkp-heading">built on zero knowledge proofs</h2>
      </PageHeader>
      <div className={pageClasses}>
        <div className={leftClasses}>
          <div className="d-flex align-items-center">
            <h3>Recent Transactions</h3>
            <button className="reload-button ml-2" onClick={handleReload}>
              <CachedIcon />
            </button>
          </div>
          <div className={classNames(txBox, "height-60")}>
            {renderContent()}
          </div>
        </div>
        <div className={classNames(rightClasses, "justify-content-center")}>
          <div className="dashboard-button new-session">
            <button className="w-100" onClick={handleShowSession}>
              <h2
                className="d-flex justify-content-between align-items-center w-75 mx-auto"
                style={{ fontWeight: "bold", color: "#009A2B" }}
              >
                <EnhancedEncryptionIcon sx={{ fontSize: "56px" }} /> Client Session
              </h2>
            </button>
          </div>
          <div className="dashboard-button sent-proofs">
            <Link to="/sent" className="w-100">
              <h2
                className="d-flex justify-content-between align-items-center w-75 mx-auto"
                style={{ fontWeight: "bold", color: "black" }}
              >
                <SendIcon sx={{ fontSize: "56px" }} /> Sent Proofs
              </h2>
            </Link>
          </div>
          <div className="dashboard-button rcvd-proofs">
            <Link to="/received" className="w-100">
              <h2
                className="d-flex justify-content-between align-items-center w-75 mx-auto"
                style={{ fontWeight: "bold", color: "#8b5eff" }}
              >
                <CallReceivedIcon sx={{ fontSize: "56px" }} /> <div>Received Proofs</div>
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
