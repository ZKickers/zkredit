import classNames from "classnames";

const { TextField } = require("@mui/material");
const { DataThresholdingIcon } = require("assets");
const {
  default: SubmitButton,
} = require("components/atoms/submit-button/SubmitButton");

const renderThresholdField = (props) => {
  const { threshold, setThreshold, color } = props;

  return (
    <div className="mt-4">
      <TextField
        type="number"
        fullWidth
        label="Threshold"
        onChange={(e) => setThreshold(e.target.value)}
        InputLabelProps={{
          style: {
            color: color,
            fontWeight: "bold",
            fontSize: "1.5rem",
          },
        }}
        InputProps={{
          style: {
            borderRadius: "14px",
            fontWeight: "bold",
            fontSize: "2rem",
          },
          min: 0,
          inputMode: "numeric",
          pattern: "[0-9]",
          startAdornment: (
            <DataThresholdingIcon
              sx={{ paddingRight: "10px", color: color, fontSize: "3rem" }}
            />
          ),
          endAdornment: (
            <SubmitButton
              onClick={() => handleThresholdSubmit(threshold)}
              style={{
                backgroundColor: color,
                margin: "10px 0 10px 10px",
                borderRadius: "10px",
              }}
            >
              Submit
            </SubmitButton>
          ),
        }}
      />
    </div>
  );
};

const handleThresholdSubmit = (threshold) => {
  // TODO: SEND THE THRESHOLD TO THE BACKEND
  console.log(threshold);
};

const renderValidationButton = (color) => {
  return (
    <SubmitButton
    className="mt-4"
      onClick={() => handleValidationClicked()}
      style={{
        backgroundColor: color,
        width: "100%",
        height: "75px",
        fontSize: "24px",
        borderRadius: "10px",
      }}
    >
      Begin Proof Validation
    </SubmitButton>
  );
};

const handleValidationClicked = () => {
  // TODO: SEND THE REQUEST TO THE BACKEND
  console.log("Validation requested");
};

const contentContainer = classNames(
  "col-md-8",
  "col-sm-12",
  "d-flex",
  "flex-column",
  "justify-content-center",
  "align-items-md-start",
  "align-items-sm-center",
  "p-5"
);

const iconClasses = classNames(
  "col-md-4",
  "col-sm-12",
  "d-flex",
  "justify-content-md-center",
  "justify-content-sm-center",
  "align-items-center",
  "p-5"
);

export {
  renderThresholdField,
  renderValidationButton,
  contentContainer,
  iconClasses,
};
