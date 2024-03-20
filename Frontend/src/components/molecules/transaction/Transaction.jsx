import classNames from "classnames";
import "./Transaction.css";
import { falseCheck, trueCheck } from "assets";

export default function Transaction({ date, CRID, CLID, verified }) {
  const base = "tx row container w-100 p-3";
  const classes = classNames(base, {
    "tx-verified": verified,
    "tx-failed": !verified,
  });

  const contentClasses = classNames(
    "col-md-8",
    "col-sm-12",
    "d-flex",
    "flex-column",
    "justify-content-center",
    "align-items-md-start",
    "align-items-sm-center",
  );

  const imgClasses = classNames("col-md-4", "col-sm-12", "tx-img");

  return (
    <div className={classes}>
      <div className={contentClasses}>
        <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>{date}</h1>
        <h2 style={{ fontSize: "20px", fontWeight: "400" }}>{CRID}</h2>
        <h2 style={{ fontSize: "20px", fontWeight: "400" }}>{CLID}</h2>
        <h3
          style={{
            fontSize: "16px",
            fontWeight: "bold",
            color: verified ? "#009A2B" : "#F62525",
          }}
        >
          {verified ? "Verified" : "Declined"}
        </h3>
      </div>
      <div className={imgClasses}>
        {verified ? (
          <img src={trueCheck} alt={"true-check"} />
        ) : (
          <img src={falseCheck} alt={"false-check"} />
        )}
      </div>
    </div>
  );
}
