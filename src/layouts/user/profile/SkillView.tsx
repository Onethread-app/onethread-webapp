import { User } from 'stores/user/Reducer';
import React, { useState } from 'react';
import { ItemEntityProps } from 'components/fields/SuggestField';
import { Tag, Intent, Dialog } from '@blueprintjs/core';
import { SkillEdit } from './SkillEditor';
import { connect } from 'react-redux';
import { addSkillAction, deleteSkillAction } from 'stores/user/Actions';

import skillImage from './../../../resources/images/skills.png';
interface SkillViewComponentProps {
  user: User;
  addSkillAction: (skillSet: string[]) => void;
  deleteSkillAction: (val: string) => void;
}

export const SkillViewComponent = (props: SkillViewComponentProps) => {
  const [showDialog, setShowDialog] = useState(false);
  return (
    <>
      <div className="h-auto br3 ma3 pa3 bg-white cf shadow-4 w-50-m">
        <h1 className="f6 lh-copy">Skills</h1>
        <div className="tc">
          {props.user.skillArea.length > 0 ? props.user.skillArea.map((skill: ItemEntityProps) => {
            return (
              <div className="dib ma1">
                <Tag key={skill._id}
                  className="ma1 pa2"
                  onRemove={(e) => {
                    props.deleteSkillAction(skill._id!);
                  }}
                  intent={Intent.PRIMARY}
                  large={true}
                >
                  {skill.name}</Tag>
              </div>
            );
          }) :
            <div>
              <img src={skillImage}></img>
              <p>No skill has selected</p>
            </div>
          }
          <div>
            <button
              className="br3 grow ph3-l ph2-m pointer pv2 f7 bg-white ba b--lightBlue tigrow-lightBlue outline-0 mt2 mb2"
              onClick={() => setShowDialog(!showDialog)}
            >
              Add Skills
            </button>
          </div>
        </div>
      </div>
      {
        showDialog && (
          <Dialog
            onClose={() => setShowDialog(!showDialog)}
            isOpen={showDialog}
            style={{ background: '#fff' }}
            canOutsideClickClose={false}
          >
            <SkillEdit
              showDialog={showDialog}
              setShowDialog={() => setShowDialog(!showDialog)}
              addSkillAction={props.addSkillAction}
            />
          </Dialog>
        )
      }
    </>
  );
};

const mapStateToProps = (state: any) => {
  return {
    user: state.userReducer.user
  };
};

export const SkillView = connect(mapStateToProps, { addSkillAction, deleteSkillAction })(SkillViewComponent);