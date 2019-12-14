import React, { useState } from 'react';
import { Dialog, Tag, Button, Intent } from '@blueprintjs/core';
import { SuggestField, ItemEntityProps } from 'components/fields/SuggestField';
import { tokenConfig } from 'stores/UtilsActions';
import { isEmpty, isEqual } from 'lodash';
import tigrowApi from 'tigrowApi';
import { connect } from 'react-redux';
import { addSkillAction, deleteSkillAction } from 'stores/user/Actions';
import { User } from 'stores/user/Reducer';

const skillImage = require('./../../../resources/images/skills.png');

const SkillEdit = (props: {
  addSkillAction: (skillSet: string[]) => void
  setShowDialog: (val: boolean) => void
  showDialog: boolean;
}) => {
  const [skills, setSkills] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([] as ItemEntityProps[]);
  const fetchSkillByQuery = async (userName: string) => {
    try {
      const headers = tokenConfig();
      if ((headers as any).headers.Authorization) {
        if (isEmpty(userName) === false) {
          const response = await tigrowApi.get(`skills/search?name=${userName}`, headers);
          setSkills(response.data.data);
        }
      } else {
        console.log('no headers')
      }
    } catch (error) {
      if (isEqual(error.message, 'Network Error')) {
        console.log('network error')
      }
      else {
        console.log(error.response);
      }
    }
  }

  const addNewSkill = async (newSkill: {}) => {
    try {
      const headers = tokenConfig();
      if ((headers as any).headers.Authorization) {
        const response = await tigrowApi.post('/skills', newSkill, headers);
        setSelectedSkills([...selectedSkills, response.data.skillInfo])
      } else {
        console.log('no headers')
      }
    } catch (error) {
      if (isEqual(error.message, 'Network Error')) {
        console.log('network error')
      }
      else {
        console.log(error.response);
      }
    }
  }

  return (
    <>
      <div className="pa3 ">
        <h1 className="f5 lh-copy">Add your skills</h1>
        <div className="fl w-100 pv2">
          <SuggestField
            onChange={(query: string) => { fetchSkillByQuery(query) }}
            items={skills}
            selectedItems={selectedSkills}
            setSelectedItems={setSelectedSkills}
            isCreatable={true}
            multipleItemSelect={true}
            isCreatableAPI={addNewSkill}
          />
        </div>
        <div className="fl w-100 mb2">
          {selectedSkills.map(item => (
            <Tag
              key={item._id}
              className="ma1 pa2"
              interactive={true}
              intent="primary"
              onRemove={e => {
                const filteredSkills = selectedSkills.filter(selectedItem => (
                  item.name !== selectedItem.name
                ));
                setSelectedSkills([
                  ...filteredSkills
                ])
              }}
              large={true}
            >
              {item.name}
            </Tag>
          ))}
        </div>
        <div className="fl w-100">
          <div className="flex justify-end">
            <Button className="w4 grow h2 pointer mr3"
              onClick={(e: any) => {
                e.preventDefault();
                props.setShowDialog(false);
              }}
              style={{ background: "#fff", outline: "none", border: "1px solid #0fa3a3", color: "#0fa3a3" }}
            >
              cancel
            </Button>
            <Button
              type="submit"
              onClick={async (e: any) => {
                e.preventDefault();
                let skillSet: string[] = [];
                selectedSkills.map(selected => {
                  skillSet.push(selected._id!)
                })
                if (skillSet.length > 0) {
                  props.addSkillAction(skillSet)
                  props.setShowDialog(!props.showDialog);
                }
              }}
              className="w4 grow h2 pointer"
              style={{ background: "#0fa3a3", outline: "none", color: 'white' }}
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

export const SkillViewComponent = (props: {
  user: User
  addSkillAction: (skillSet: string[]) => void;
  deleteSkillAction: (val: string) => void
  setShowDialog: (val: boolean) => void
}
) => {
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
                  onRemove={e => {
                    props.deleteSkillAction(skill._id!)
                  }}
                  intent={Intent.PRIMARY}
                  large={true}
                >
                  {skill.name}</Tag>
              </div>
            )
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
              setShowDialog={(e: any) => setShowDialog(!showDialog)}
              addSkillAction={props.addSkillAction}
            />
          </Dialog>
        )
      }
    </>
  )
}

const mapStateToProps = (state: any) => {
  return {
    user: state.userReducer.user
  }
}

export const SkillView = connect(mapStateToProps, { addSkillAction, deleteSkillAction })(SkillViewComponent)
