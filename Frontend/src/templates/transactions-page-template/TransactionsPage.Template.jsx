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
import useFetchTransactions from "API/useFetchTransactions";
import Skeleton from "components/molecules/skeleton/Skeleton";
import { useEffect, useState } from "react";
import classNames from "classnames";
import TxCard from "components/molecules/transaction-card/TxCard";
import { useSelector } from "react-redux";

export default function TPTemplate({ isCreditor }) {
  const [txCard, setTxCard] = useState();

  const handleGoBack = () => {
    window.history.back();
  };

  const user = useSelector((state) => state.user);
  const transactions = useSelector((state) =>
    isCreditor ? state.creditorTransactions : state.clientTransactions
  );

  const renderCard = (props) => setTxCard(<TxCard {...props} />);

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

  const renderContent = () => {
    if (transactions.status === "loading") {
      return <Skeleton />;
    }

    if (transactions.error) {
      console.error(transactions.error);
      return <div>Error loading transactions...</div>;
    }

    return transactions.transactions.map((tx) => (
      <Transaction
        key={tx._id}
        txId={tx._id}
        clientFullName={tx.fullNameOfClient}
        creditorId={tx.creditorAccountId}
        creditorUsername={tx.creditorUsername}
        updateDate={tx.updatedAt}
        status={tx.status}
        isButton
        renderCard={renderCard}
      />
    ));
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
          <div className={classNames(txBox, "h-100")}>{txCard}</div>
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
