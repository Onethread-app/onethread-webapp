import React, { useState, useEffect } from 'react';
import { ItemEntityProps, SuggestField } from 'components/fields/SuggestField';
import { tokenConfig } from 'stores/UtilsActions';
import tigrowApi, { server } from 'tigrowApi';
import { Tag, Button } from '@blueprintjs/core';
import { isEqual, isEmpty, lowerCase } from 'lodash';
import { useLiveSearch } from 'components/useLiveSearch';
import { useSelector } from 'react-redux';
interface SkillEditProps {
  addSkillAction: (skillSet: string[]) => void;
  setShowDialog: (val: boolean) => void;
  showDialog: boolean;
}

export const SkillEdit = (props: SkillEditProps) => {

  const userSkills = useSelector((state: any) => state.userReducer.user.skillArea);
  const [skills, setSkills] = useState([] as ItemEntityProps[]);
  const [selectedSkills, setSelectedSkills] = useState([] as ItemEntityProps[]);
  const [username, setUsername] = useState('');

  const addNewSkill = async (newSkill: {}) => {
    try {
      let response;
      const headers = tokenConfig();
      if ((headers as any).headers.Authorization) {
        response = await tigrowApi.post('/skills', newSkill, headers);
        setSelectedSkills([...selectedSkills, response.data.skillInfo]);
      } else {
        // tslint:disable-next-line: no-console
        console.log('no headers');
      }
    } catch (error) {
      if (isEqual(error.message, 'Network Error')) {
        // tslint:disable-next-line: no-console
        console.log('network error');
      } else {
        // tslint:disable-next-line: no-console
        console.log(error.response);
      }
    }
  };

  const userRequestFactory = (userName: string): Promise<any> => {
    const headers = tokenConfig();
    return fetch(`${server}skills/search?name=${userName}`, headers)
      .then((res) => res.json())
      .then((res) => res.data)
      .catch((err) => []);
  };

  let result: any = [];
  result = useLiveSearch(username, userRequestFactory, 800);

  useEffect(() => {
    setSkills(result);
  }, [result]);

  return (
    <div className="ph4 pt6">
      <h1 className="f5 lh-copy">Add your skills</h1>
      <div className="fl w-100 pv2">
        <SuggestField
          onChange={(query: string) => {
            setUsername(query);
          }}
          items={skills}
          selectedItems={selectedSkills}
          setSelectedItems={setSelectedSkills}
          isCreatable={
            isEmpty(skills.filter((item) => (
              username === item.name)))
              &&
              isEmpty(userSkills.filter((item: ItemEntityProps) => (
                lowerCase(username) === item.name
              )))
              ? true : false
          }
          multipleItemSelect={true}
          isCreatableAPI={addNewSkill}
        />
        <div className="fl w-100 mb2">
          {selectedSkills.map((item) => (
            <Tag
              key={item._id}
              className="ma1 pa2"
              interactive={true}
              intent="primary"
              onRemove={(e) => {
                const filteredSkills = selectedSkills.filter((selectedItem) => (
                  item.name !== selectedItem.name
                ));
                setSelectedSkills([
                  ...filteredSkills
                ]);
              }}
              large={true}
            >
              {item.name}
            </Tag>
          ))}
        </div>
        <div className="fl w-100 mt4">
          <div className="flex justify-end">
            <Button className="w4 grow h2 pointer mr3"
              onClick={(e: any) => {
                e.preventDefault();
                props.setShowDialog(false);
              }}
              style={{ background: '#fff', outline: 'none', border: '1px solid #0fa3a3', color: '#0fa3a3' }}
            >
              cancel
            </Button>
            <Button
              type="submit"
              onClick={async (e: any) => {
                e.preventDefault();
                const skillSet: string[] = [];
                selectedSkills.map((selected) => {
                  skillSet.push(selected._id!);
                });
                if (skillSet.length > 0) {
                  await props.addSkillAction(skillSet);
                  props.setShowDialog(!props.showDialog);
                }
              }}
              className="w4 grow h2 pointer"
              style={{ background: '#0fa3a3', outline: 'none', color: 'white' }}
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
