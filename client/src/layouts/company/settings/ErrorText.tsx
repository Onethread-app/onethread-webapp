import CloseIcon from '@material-ui/icons/Close';

import expiredIcon from '../../../resources/images/expiredIcon.png';

interface IErrorText {
  text: string;
  subtext: string;
  closeModal: () => void;
  setExpireMassage?: () => void;
}
export default function ErrorText(props: IErrorText) {
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
        {props.subtext}
      </p>
    </div>
  );
}
