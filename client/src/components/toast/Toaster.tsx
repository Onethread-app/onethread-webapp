import { Link } from 'react-router-dom';
import { toast, TypeOptions } from 'react-toastify';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import WarningOutlinedIcon from '@material-ui/icons/WarningOutlined';
import 'react-toastify/dist/ReactToastify.css';
import './Toaster.scss';

interface IProps {
  message: string;
  type: TypeOptions;
  style?: {};
}

export const toaster = (props: IProps) => {
  const { message, type, style } = props;
  if (!message) return;
  switch (type) {
    case 'success': {
      toast(
        ({ toastProps, closeToast, data }) => (
          <div className="flex items-center">
            <CheckCircleOutlineIcon className="success" />
            <div className="mt2 mb2">{message}</div>
          </div>
        ),
        {
          position: 'top-center',
          icon: false,
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: false,
          pauseOnHover: false,
          draggable: true,
          bodyClassName: 'toast-body',
          className:
            'toast-success-container toast-success-container-after',
          ...style,
          type,
          theme: 'light',
        },
      );
      break;
    }
    case 'error': {
      toast(
        ({ toastProps, closeToast, data }) => (
          <div className="flex items-center">
            <ErrorOutlineIcon className="error" />
            <div className="mt2 mb2">{message}</div>
          </div>
        ),
        {
          position: 'top-center',
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: false,
          pauseOnHover: false,
          draggable: true,
          icon: false,
          bodyClassName: 'toast-body',
          className:
            'toast-error-container toast-error-container-after',
          ...style,
          type,
          theme: 'light',
        },
      );
      break;
    }
    case 'info': {
      toast(
        ({ toastProps, closeToast, data }) => (
          <div className="flex items-center">
            <InfoOutlinedIcon className="info" />
            <div className="mt2 mb2">{message}</div>
          </div>
        ),
        {
          position: 'top-center',
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: false,
          pauseOnHover: false,
          draggable: true,
          icon: false,
          bodyClassName: 'toast-body',
          className:
            'toast-info-container toast-info-container-after',
          ...style,
          type,
          theme: 'light',
        },
      );
      break;
    }
    case 'warning': {
      toast(
        ({ toastProps, closeToast, data }) => (
          <div className="flex items-center">
            <WarningOutlinedIcon className="warning" />
            <div className="mt2 mb2">{message}</div>
          </div>
        ),
        {
          position: 'top-center',
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: false,
          pauseOnHover: false,
          draggable: true,
          icon: false,
          bodyClassName: 'toast-body',
          className:
            'toast-warning-container toast-warning-container-after',
          ...style,
          type,
          theme: 'light',
        },
      );
      break;
    }
    default: {
      toast(
        ({ toastProps, closeToast, data }) => (
          <div className="flex items-center">
            <InfoOutlinedIcon className="info" />
            <div className="mt2 mb2">{message}</div>
          </div>
        ),
        {
          position: 'top-center',
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: false,
          pauseOnHover: false,
          draggable: true,
          bodyClassName: 'toast-body',
          className:
            'toast-info-container toast-info-container-after',
          ...style,
          type,
          theme: 'light',
        },
      );
      break;
    }
  }
};

export const AnnouncementToaster = (company: {
  name: string;
  uniqueName: string;
}) => {
  toast(
    ({ toastProps, closeToast, data }) => (
      <div className="flex items-center">
        <CheckCircleOutlineIcon className="success" />
        <div className="flex flex-column">
          <div>
            The announcement has been created in {company.name}
          </div>
          <Link
            to={{
              pathname: `/company/${company.uniqueName}`,
              state: {
                tab: 'announcement',
              },
            }}
            className="mt2 green"
          >
            Check it out!
          </Link>
        </div>
      </div>
    ),
    {
      position: 'top-center',
      icon: false,
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: false,
      pauseOnHover: false,
      draggable: true,
      bodyClassName: 'toast-body',
      className:
        'toast-success-container toast-success-container-after',
      theme: 'light',
    },
  );
};

export const successToaster = (message: string, style = {}) => {
  toaster({
    message,
    type: 'success',
    style,
  });
};

export const errorToaster = (message: string, style = {}) => {
  toaster({
    message,
    type: 'error',
    style,
  });
};

export const infoToaster = (message: string, style = {}) => {
  toaster({
    message,
    type: 'info',
    style,
  });
};

export const warningToaster = (message: string, style = {}) => {
  toaster({
    message,
    type: 'warning',
    style,
  });
};
