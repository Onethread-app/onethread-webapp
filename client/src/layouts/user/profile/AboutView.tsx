import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import { User } from 'stores/user/Reducer';

import editIcon from '../../../resources/images/editIcon.png';

import { AboutEdit } from './AboutEditor';
import { RightSidebar } from 'components/RightSidebar';

interface IAboutViewProps {
  user: User;
}

const AboutViewComponent = (props: IAboutViewProps) => {
  const { t } = useTranslation();
  const [showDialogAbout, setShowDialogAbout] = useState(false);

  return (
    <>
      <div className="cf ">
        <h1 className="f5 lh-copy dib tigrow-lightGray-1 ws-break">
          {t('app.user.Personal-profile.About')}
        </h1>
        <img
          src={editIcon}
          width="38"
          className="br2 pointer fr mv1"
          onClick={() => setShowDialogAbout(true)}
        />
      </div>
      <div>
        <p
          className="ws-break tj black-70 fw6"
          style={{ whiteSpace: 'pre-line' }}
        >
          {props.user.about}
        </p>
      </div>
      {showDialogAbout && (
        <RightSidebar
          onClose={() => setShowDialogAbout(!showDialogAbout)}
        >
          <div>
            <AboutEdit setShowDialog={setShowDialogAbout} />
          </div>
        </RightSidebar>
      )}
    </>
  );
};

const mapStateToProps = (state: any) => {
  return {
    user: state.userReducer.user,
  };
};

export const AboutView = connect(mapStateToProps)(AboutViewComponent);
