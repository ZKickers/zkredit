import { useEffect } from "react";

const useOutsideClick = (ref, handleClose) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target) &&  !event.target.closest('.MuiPickersPopper-root')) {
        handleClose && handleClose();
      }
    };

    document.addEventListener("click", handleClickOutside, true);

    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [ref, handleClose]);
};

export default useOutsideClick;
