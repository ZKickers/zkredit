import classNames from "classnames";
import "./TxCard.css";
import { CloseIcon, LockIcon, LockOpenIcon } from "assets";
import { useContext, useState } from "react";
import {
  renderThresholdField,
  renderValidationButton,
  contentContainer,
  iconClasses,
} from "./TxCardComps";
import AuthContext from "store/auth-context";

export default function TxCard(props) {
  const {
    date,
    CRID,
    CLID,
    verified,
    declined,
    pendingThreshold,
    pendingVerification,
    txId
  } = props;

  const auth = useContext(AuthContext);

  const token = auth.token;

  const pending = pendingThreshold || pendingVerification;

  const statusText = classNames({
    Verified: verified,
    Declined: declined,
    "Pending Threshold": pendingThreshold,
    "Pending Verification": pendingVerification,
  });

  const color = classNames({
    "#009A2B": verified,
    "#F62525": declined,
    "#FFB800": pending,
  });

  const iconStyle = { color: "white", fontSize: "160px" };

  const renderStatusIcon = () => {
    if (verified) return <LockIcon sx={iconStyle} />;
    else if (declined) return <CloseIcon sx={iconStyle} />;
    else if (pending) return <LockOpenIcon sx={iconStyle} />;
  };

  const [threshold, setThreshold] = useState(0);

  return (
    <div className="row container-fluid h-100 p-4">
      <div className={contentContainer}>
        <div className="w-100" style={{ height: "fit-content" }}>
          <h1 style={{ color: color, fontSize: "36px", fontWeight: "bold" }}>
            Session ID: {CRID}
          </h1>
          <h2 style={{ fontSize: "24px", fontWeight: "400" }}>
            Date: <span className="fw-bold">{date}</span>
          </h2>
          <h2 style={{ fontSize: "20px", fontWeight: "400" }}>
            Client ID: <span className="fw-bold">{CLID}</span>
          </h2>
          <h3
            style={{
              fontSize: "18px",
              fontWeight: "bold",
              textTransform: "capitalize",
            }}
          >
            Status: <span style={{ color: color }}>{statusText}</span>
          </h3>
          {pendingThreshold &&
            renderThresholdField({ token, threshold, txId, setThreshold, color })}
          {pendingVerification && renderValidationButton(color)}
        </div>
      </div>
      <div className={iconClasses}>
        <div className="rounded-circle p-4" style={{ backgroundColor: color }}>
          {renderStatusIcon()}
        </div>
      </div>
    </div>
  );
}
