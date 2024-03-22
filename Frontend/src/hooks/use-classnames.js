import classNames from "classnames";
import "./fill-height.css";

const pageClasses = classNames(
  "row",
  "fill-height",
  "container-fluid",
  "mx-auto",
  "d-flex",
  "flex-md-row",
  "flex-sm-column",
  "justify-content-md-between",
  "justify-content-sm-start",
  "align-items-md-start",
  "align-items-sm-center",
  "p-4",
);

const leftClasses = classNames(
  "col-md-7",
  "col-sm-12",
  "d-flex",
  "flex-column",
  "align-items-sm-center",
  "align-items-md-start",
  "h-100"
);

const txBox = classNames(
  "d-flex",
  "flex-column",
  "align-items-center",
  "p-4",
  "w-100",
  "rounded border border-black border-2",
  "overflow-auto"
);

const rightClasses = classNames(
  "col-md-5",
  "col-sm-12",
  "d-flex",
  "flex-column",
  "align-items-center",
  "h-100",
  "p-5",
);

export { pageClasses, leftClasses, txBox, rightClasses };
