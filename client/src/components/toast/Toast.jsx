import React, { useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import './index.scss';

const ToastTextComponent = ({ src, text }) => (
  <>
    {src && <img src={src} alt="icon" />}
    <span>{text}</span>
  </>
);

const Toaster = ({ text, open, type = undefined }) => {
  useEffect(() => {
    if (open) {
      const configuration = {
        position: 'top-right',
        autoClose: 5000,
        draggable: false,
        closeButton: false,
        hideProgressBar: true,
        pauseOnHover: false,
      };

      if (type === 'TOAST_SUCCESS') {
        toast(<ToastTextComponent text={text} />, configuration);
      } else if (type === 'TOAST_FAILURE') {
        toast.error(
          <ToastTextComponent text={text.toString()} />,
          configuration,
        );
      } else {
        // nothing to do right now
      }
    }
  });

  return (
    <div className="common-toaster-container">
      <ToastContainer />
    </div>
  );
};
export default Toaster;
