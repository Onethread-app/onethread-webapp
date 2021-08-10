import { User } from 'stores/user/Reducer';
import React, { useState } from 'react';
import { ItemEntityProps } from 'components/fields/SuggestField';
import { SkillEdit } from './SkillEditor';
import { connect } from 'react-redux';
import {
  addSkillAction,
  deleteSkillAction,
} from 'stores/user/Actions';

import skillImage from './../../../resources/images/skills.png';
import { RightSidebar } from 'components/RightSidebar';
import { useTranslation } from 'react-i18next';
interface SkillViewComponentProps {
  user: User;
  addSkillAction: (skillSet: string[]) => void;
  deleteSkillAction: (val: string) => void;
}

export const SkillViewComponent = (
  props: SkillViewComponentProps,
) => {
  const [showDialog, setShowDialog] = useState(false);
  const { t } = useTranslation();

  return (
    <>
      <h1 className="f5 lh-copy">
        {t('app.user.Personal-profile.Skills')}
      </h1>
      {/* <h1 className="f5 lh-copy">Skills</h1> */}
      <div className="dib">
        {props.user.skillArea && props.user.skillArea.length > 0 ? (
          props.user.skillArea.map((skill: ItemEntityProps) => {
            return (
              <div className="mv1 fl">
                <span
                  className="bp3-tag ma1 pv2 ph3 ws-break"
                  style={{
                    backgroundColor: '#34b3e9',
                    color: 'white',
                    fontSize: '15px',
                  }}
                >
                  {skill.name}
                  <span
                    className="bp3-tag-remove bp3-icon-delete mh2 w1 h1"
                    style={{
                      backgroundColor: 'white',
                      color: '#34b3e9',
                      borderRadius: '30px',
                      paddingTop: '1px',
                    }}
                    onClick={(e: any) => {
                      props.deleteSkillAction(skill._id!);
                    }}
                  ></span>
                </span>
              </div>
            );
          })
        ) : (
          <div>
            <img src={skillImage}></img>
            <p>No skill has selected</p>
          </div>
        )}
      </div>
      <div className="tc">
        <button
          className="br3 grow ph3-l ph2-m pointer pv2 bg-white ba b--lightBlue tigrow-lightBlue outline-0 mt3 mb2 bw1 fw7"
          onClick={() => setShowDialog(!showDialog)}
        >
          {t('app.user.Personal-profile.Add-skills')}
          {/* Add Skills */}
        </button>
      </div>
      {showDialog && (
        <RightSidebar onClose={() => setShowDialog(!showDialog)}>
          <SkillEdit
            showDialog={showDialog}
            setShowDialog={() => setShowDialog(!showDialog)}
            addSkillAction={props.addSkillAction}
          />
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

export const SkillView = connect(mapStateToProps, {
  addSkillAction,
  deleteSkillAction,
})(SkillViewComponent);
