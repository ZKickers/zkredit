import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { hideSuccessSnackbar } from 'features/snackbar/successSnackbarSlice';
import './Snackbar.css';

const SuccessSnackbar = () => {
  const dispatch = useDispatch();
  const { isVisible, message } = useSelector((state) => state.successSnackbar);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        dispatch(hideSuccessSnackbar());
      }, 3000); // Hide snackbar after 3 seconds

      return () => clearTimeout(timer);
    }
  }, [isVisible, dispatch]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="snackbar success">
      <div className="snackbar-content">
        <span className="snackbar-icon">✅</span>
        <div className="snackbar-text">
          <strong>Success</strong>
          <p>{message}</p>
        </div>
      </div>
    </div>
  );
};

export default SuccessSnackbar;
