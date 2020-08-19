import React from 'react';
import expiredIcon from '../../../resources/images/expiredIcon.png';
import CloseIcon from '@material-ui/icons/Close';

interface ISubscriptionExpiredText {
  text: string;
  closeModal: () => void;
  setExpireMassage?: () => void;
}
export default function SubscriptionExpiredText(
  props: ISubscriptionExpiredText,
) {
  return (
    <div>
      <div
        onClick={() => {
          props.closeModal();
          props.setExpireMassage && props.setExpireMassage();
        }}
        className="pointer"
        style={{ float: 'right' }}
      >
        <CloseIcon />
      </div>
      <img className="center flex" src={expiredIcon} alt="success" />

      <h1
        style={{
          color: '#393e46',
          textAlign: 'center',
        }}
      >
        {props.text}
      </h1>
      <p
        style={{
          fontSize: '13px',
          color: '#393e46',
          textAlign: 'center',
        }}
      >
        To keep using Tigrow without interruption you need to pay your
        dues.
      </p>
    </div>
  );
}
