import classNames from "classnames";
import "./ModalPage.css";
import { useRef } from "react";
import useOutsideClick from "hooks/use-modal-close";

export default function ModalPage({ children, show, handleClose, ...rest }) {
  const pageBase = "modal-page";
  const pageClasses = classNames(pageBase, {
    hidden: !show,
  });

  const ref = useRef();
  useOutsideClick(ref, handleClose);

  const modalBase = "my-modal";
  const modalClasses = classNames(modalBase, rest.className);

  return (
    <div className={pageClasses}>
      <div ref={ref} {...rest} className={modalClasses}>{children}</div>
    </div>
  );
}
