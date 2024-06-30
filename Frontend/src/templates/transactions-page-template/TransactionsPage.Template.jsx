import PageHeader from "components/organisms/page-header/PageHeader";
import "./TransactionsPage.Template.css";
import {
  pageClasses,
  leftClasses,
  rightClasses,
  txBox,
} from "hooks/use-classnames";
import { KeyboardBackspaceIcon } from "assets";
import CachedIcon from "@mui/icons-material/Cached";
import Transaction from "components/molecules/transaction/Transaction";
import useFetchTransactions from "api/useFetchTransactions";
import Skeleton from "components/molecules/skeleton/Skeleton";
import { useEffect, useState } from "react";
import classNames from "classnames";
import TxCard from "components/molecules/transaction-card/TxCard";
import { useSelector } from "react-redux";
import TransactionStateEnum from "utils/TransactionStateEnum";
import { updateTransactionStatus as creditorUpdateStatus } from "../../redux/creditorTransactionSlice";
import { updateTransactionStatus as clientUpdateStatus } from "../../redux/clientTransactionSlice";
import { useDispatch } from "react-redux";

export default function TPTemplate({ isCreditor }) {
  const [currentTx, setCurrentTx] = useState(null);
  const dispatch = useDispatch();

  const handleGoBack = () => {
    window.history.back();
  };

  const user = useSelector((state) => state.user);
  const transactions = useSelector((state) =>
    isCreditor ? state.creditorTransactions : state.clientTransactions
  );

  const renderCard = (txId) => {
    setCurrentTx(transactions.transactions.find((tx) => tx._id === txId));
  };

  const fetchTransactions = useFetchTransactions();
  const loadTx = () => {
    fetchTransactions({
      accountId: user.accountId,
      type: isCreditor ? "creditor" : "client",
    });
  };

  useEffect(() => {
    if (transactions.status === "idle") {
      loadTx();
    }
  }, []);

  useEffect(() => {
    if (currentTx) {
      renderCard(currentTx._id);
    }
  }, [transactions]);

  const renderContent = () => {
    if (transactions.status === "loading") {
      return <Skeleton />;
    }

    if (transactions.error) {
      console.error(transactions.error);
      return <div>Error loading transactions...</div>;
    }

    const sortedTransactions = [...transactions.transactions].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    return sortedTransactions.map((tx) => (
      <Transaction
        key={tx._id}
        txId={tx._id}
        clientFullName={tx.fullNameOfClient}
        isClient={!isCreditor}
        creditorUsername={tx.creditorUsername}
        updateDate={tx.updatedAt}
        status={mapStatusToEnum(tx.status)}
        isButton
        renderCard={renderCard}
      />
    ));
  };

  const mapStatusToEnum = (status) => {
    switch (status) {
      case "Passed" || TransactionStateEnum.PASSED:
        return TransactionStateEnum.PASSED;
      case "Failed" || TransactionStateEnum.FAILED:
        return TransactionStateEnum.FAILED;
      case "Pending_Threshold" || TransactionStateEnum.PENDING_THRESHOLD:
        return TransactionStateEnum.PENDING_THRESHOLD;
      case "Pending_Client_Data" || TransactionStateEnum.PENDING_CLIENT_DATA:
        return TransactionStateEnum.PENDING_CLIENT_DATA;
      case "Pending_Proof" || TransactionStateEnum.PENDING_PROOF:
        return TransactionStateEnum.PENDING_PROOF;
      case "Pending_Verification" || TransactionStateEnum.PENDING_VERIFICATION:
        return TransactionStateEnum.PENDING_VERIFICATION;
      case "Invalid" || TransactionStateEnum.INVALID:
        return TransactionStateEnum.INVALID;
    }
  };
  const setCurrentTxStatus = (status) => {
    if (isCreditor) {
      dispatch(
        creditorUpdateStatus({
          id: currentTx._id,
          status: status,
        })
      );
    } else {
      dispatch(
        clientUpdateStatus({
          id: currentTx._id,
          status: status,
        })
      );
    }
  };

  return (
    <div className="page-template">
      <PageHeader>
        <h1 className="proofs-title">
          {isCreditor ? "Received" : "Sent"} Transactions
        </h1>
        <button onClick={handleGoBack} className="proofs-button-heading">
          <KeyboardBackspaceIcon
            sx={{ fontSize: "42px", fontWeight: "bold" }}
          />
          <h2>Dashboard</h2>
        </button>
      </PageHeader>
      <div className={pageClasses}>
        <div className={leftClasses}>
          <div className={classNames(txBox, "h-100")}>
            {currentTx && (
              <TxCard
                txId={currentTx._id}
                updateDate={currentTx.updatedAt}
                isClient={!isCreditor}
                creditorUsername={currentTx.creditorUsername}
                clientFullName={currentTx.fullNameOfClient}
                transactionState={mapStatusToEnum(currentTx.status)}
                setTransactionState={setCurrentTxStatus}
              />
            )}
          </div>
        </div>
        <div className={rightClasses}>
          <div className="d-flex align-items-center">
            <h3>Transactions List</h3>
            <button className="reload-button ml-2" onClick={loadTx}>
              <CachedIcon />
            </button>
          </div>
          <div className={classNames(txBox, "proofs-container")}>
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
