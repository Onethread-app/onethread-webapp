import React from 'react';
// import CheckIcon from '@material-ui/icons/Check';
import successImage from '../resources/images/paymentSuccess.png';
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 1d9824de... Bugfix/controller (#259)
import { connect } from 'react-redux';
import { tokenConfig } from 'stores/UtilsActions';
import { tigrowApi } from 'config';
// import Button from '@material-ui/core/Button';

// import { createBrowserHistory } from 'history';
// const History = createBrowserHistory();

<<<<<<< HEAD
interface ISuccess {
  text: string;
  subscriptionId: string;
  companyId: string;
  userName: string;
}
function _Success(props: ISuccess) {
  const headers = tokenConfig();

  React.useEffect(() => {
    async function successCall() {
      let search = window.location.search;
      let params = new URLSearchParams(search);
      // const currency = params.get('currency');
      const amount = params.get('amount');
      const status = params.get('status');
      // const invoice = params.get('invoice');
      // const pan_id = params.get('pan_id');
      const transaction_id = params.get('transaction_id');
      // const username = params.get('username');
      // const currency = params.get('currency');

      await tigrowApi.post(
        `payments/${props.companyId}`,
        {
          amount: amount,
          currency: 'bdt',
          reference: transaction_id,
          company: props.companyId,
          gateway: 'portWallet',
          subscription: props.subscriptionId,
          status: status,
        },
        headers,
      );
    }
    successCall();
  }, []);
  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    >
=======
=======
>>>>>>> 1d9824de... Bugfix/controller (#259)
interface ISuccess {
  text: string;
  subscriptionId: string;
  companyId: string;
  userName: string;
}
function _Success(props: ISuccess) {
  const headers = tokenConfig();

  React.useEffect(() => {
    async function successCall() {
      let search = window.location.search;
      let params = new URLSearchParams(search);
      // const currency = params.get('currency');
      const amount = params.get('amount');
      const status = params.get('status');
      // const invoice = params.get('invoice');
      // const pan_id = params.get('pan_id');
      const transaction_id = params.get('transaction_id');
      // const username = params.get('username');
      // const currency = params.get('currency');

      await tigrowApi.post(
        `payments/${props.companyId}`,
        {
          amount: amount,
          currency: 'bdt',
          reference: transaction_id,
          company: props.companyId,
          gateway: 'portWallet',
          subscription: props.subscriptionId,
          status: status,
        },
        headers,
      );
    }
    successCall();
  }, []);
  return (
<<<<<<< HEAD
    <div>
>>>>>>> cdf1363f... Feature/tig 224 (#231)
=======
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    >
>>>>>>> 1d9824de... Bugfix/controller (#259)
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
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 1d9824de... Bugfix/controller (#259)

      {/* <Button
        style={{ marginTop: '10px' }}
        onClick={() => History.push(`/${props.userName}`)}
      >
        Back To Home
      </Button> */}
<<<<<<< HEAD
    </div>
  );
}

const mapStateToProps = (state: any) => ({
  subscriptionId: state.subscriptionReducer.subscriptionId,
  companyId: state.companyReducer.currentCompany._id,
  userName: state.userReducer.user.name,
});

const Success = connect(mapStateToProps, {})(_Success);

export default Success;
=======
    </div>
  );
}
>>>>>>> cdf1363f... Feature/tig 224 (#231)
=======
    </div>
  );
}

const mapStateToProps = (state: any) => ({
  subscriptionId: state.subscriptionReducer.subscriptionId,
  companyId: state.companyReducer.currentCompany._id,
  userName: state.userReducer.user.name,
});

const Success = connect(mapStateToProps, {})(_Success);

export default Success;
>>>>>>> 1d9824de... Bugfix/controller (#259)
