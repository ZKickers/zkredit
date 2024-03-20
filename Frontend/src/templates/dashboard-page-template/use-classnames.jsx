import classNames from "classnames";
import "./DashboardPage.Template.css";

const dashboardClasses = classNames(
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
  "p-4"
);

const transactionsClasses = classNames(
  "col-md-7",
  "col-sm-12",
  "d-flex",
  "flex-column",
  "align-items-sm-center",
  "align-items-md-start",
  "h-100"
);

const transactionsBox = classNames(
  "d-flex",
  "flex-column",
  "align-items-center",
  "justify-content-around",
  "p-4",
  "w-100",
  "h-100",
  "rounded border border-black border-2",
  "overflow-auto"
);

const sessions = classNames(
  "col-md-5",
  "col-sm-12",
  "d-flex",
  "flex-column",
  "justify-content-center",
  "align-items-center",
  "h-100",
  "p-4"
);

export { dashboardClasses, transactionsClasses, transactionsBox, sessions };
