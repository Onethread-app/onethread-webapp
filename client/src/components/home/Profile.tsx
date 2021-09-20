import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';

import UserIcon from 'resources/images/profilePhoto.svg';

interface IProfile {
  firstName: string;
  lastName: string;
  userName: string;
  profileImage: string;
  position: string;
  complete: number;
  teamNumber: number;
}

const Profile = (props: IProfile) => {
  const { t } = useTranslation();
  const history = useHistory();

  return (
    <div className="profile">
      <div className="flex justify-between w-100">
        <div>
          <h3
            className="pointer"
            onClick={() => history.push(`/${props.userName}`)}
          >
            {t('app.user.Personal-profile.My-Profile')}
          </h3>
          <p>
            {Math.round(props.complete)}%{' '}
            {t('app.user.Personal-profile.Completed')}
          </p>
        </div>
      </div>
      <div>
        <img
          src={props.profileImage ? props.profileImage : UserIcon}
          alt={`${props.firstName} ${props.lastName}`}
          style={{
            height: '128px',
            width: '128px',
            borderRadius: '10%',
          }}
        />
      </div>
      <div className="ttc tc">
        <h3>{`${props.firstName} ${props.lastName}`}</h3>
        <p>{props.position}</p>
      </div>
      <div className="team">
        {t('app.user.Personal-profile.Team')} :{' '}
        {('0' + (props.teamNumber + 1)).slice(-2)}
      </div>
    </div>
  );
};

const mapStateToProps = (state: any) => ({
  firstName: state.userReducer.user.firstName,
  lastName: state.userReducer.user.lastName,
  userName: state.userReducer.user.name,
  profileImage: state.userReducer.user.profileImage,
  position: state.userReducer.user.position,
  complete: state.userReducer.user.complete,
  teamNumber: state.userReducer.user.teamNumber,
});

export default connect(mapStateToProps)(Profile);
