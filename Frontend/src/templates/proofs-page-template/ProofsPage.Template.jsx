import PageHeader from "components/organisms/page-header/PageHeader";
import "./ProofsPage.Template.css";
import {
  pageClasses,
  leftClasses,
  rightClasses,
  txBox,
} from "hooks/use-classnames";
import { KeyboardBackspaceIcon } from "assets";
import TransactionCard from "components/molecules/transaction-card/TxCard";
import Transaction from "components/molecules/transaction/Transaction";

export default function PPTemplate() {
  const handleGoBack = () => {
    window.history.back();
  };

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
          <div className={txBox}>
            {/**
             * TODO: Handle Dynamic Transaction Fetching
             */}
            <TransactionCard
              date={"MM/DD/YYYY"}
              CRID={"xy2-z5h-32n-11m"}
              CLID={"xy2-z5h-32n-11m"}
              txId={"31532"}
              pendingThreshold
            />
          </div>
        </div>
        <div className={rightClasses}>
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
      </div>
    </div>
  );
}
