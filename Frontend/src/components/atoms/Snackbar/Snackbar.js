import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { hideSnackbar } from '../features/snackbar/snackbarSlice';
import './Snackbar.css';

const Snackbar = () => {
  const dispatch = useDispatch();
  const { isVisible, message } = useSelector((state) => state.snackbar);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        dispatch(hideSnackbar());
      }, 3000); // Hide snackbar after 3 seconds

      // Cleanup the timer when the component unmounts or when isVisible changes
      return () => clearTimeout(timer);
    }
  }, [isVisible, dispatch]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="snackbar">
      <div className="snackbar-content">
        <span className="snackbar-icon">❗</span>
        <div className="snackbar-text">
          <strong>Error</strong>
          <p>{message}</p>
        </div>
      </div>
    </div>
  );
};

export default Snackbar;
