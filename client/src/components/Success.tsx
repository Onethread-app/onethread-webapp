import React from 'react';
// import CheckIcon from '@material-ui/icons/Check';
import successImage from '../resources/images/paymentSuccess.png';
interface ISuccess {
  text: string;
}

export default function Success(props: ISuccess) {
  return (
    <div>
      <img
        className="center"
        style={{
          height: '370px',
          width: '500px',
          textAlign: 'center',
        }}
        src={successImage}
        alt="success"
      />

      <h1
        style={{
          // fontSize: '20px',
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
        Thank you for your payment. An automated payment receipt will
        be sent to your registerd email
      </p>
    </div>
  );
}
