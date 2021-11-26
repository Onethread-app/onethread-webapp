import { Link } from 'react-router-dom';

interface IProps {
  setShowContactDialog: React.Dispatch<React.SetStateAction<boolean>>;
  setShowNoSubscription: React.Dispatch<
    React.SetStateAction<boolean>
  >;
}

const NoSubscriptionDialog = (props: IProps) => {
  return (
    <div className="pa2 ma3 flex flex-column">
      <div>
        The company subscription is over. Please renew the company
        subscription.
      </div>
      <Link
        to="#"
        onClick={() => {
          props.setShowNoSubscription(false);
          props.setShowContactDialog(true);
        }}
        className="mt4 ml-auto"
      >
        <small>Contact us</small>
      </Link>
    </div>
  );
};

export default NoSubscriptionDialog;
