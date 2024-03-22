import PageHeader from "components/organisms/page-header/PageHeader";
import "./ProofsPage.Template.css";
import {
  pageClasses,
  leftClasses,
  rightClasses,
  txBox,
} from "hooks/use-classnames";
import { KeyboardBackspaceIcon } from "assets";
import Transaction from "components/molecules/transaction/Transaction";
import { useFetchTransactionsQuery } from "store/apis/txApi";
import Skeleton from "components/molecules/skeleton/Skeleton";
import { useContext, useState } from "react";
import AuthContext from "store/auth-context";
import classNames from "classnames";
import TxCard from "components/molecules/transaction-card/TxCard";

export default function PPTemplate() {
  const [txCard, setTxCard] = useState();

  const handleGoBack = () => {
    window.history.back();
  };

  const auth = useContext(AuthContext);

  const renderCard = (props) => setTxCard(<TxCard {...props} />);

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
          isButton
          renderCard={renderCard}
        />
      );
    });
  }

  return (
    <div className="page-template">
      <PageHeader>
        <h1 className="proofs-title">Received Proofs</h1>
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
          <div className={classNames(txBox, "proofs-container")}>{content}</div>
        </div>
      </div>
    </div>
  );
}
