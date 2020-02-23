import React, { useState, useEffect } from 'react';
import { CompanyModel } from 'stores/company/Reducer';
import { SuggestField, ItemEntityProps } from 'components/fields/SuggestField';
import { connect } from 'react-redux';
import { tokenConfig } from 'stores/UtilsActions';
import { Button, Tag } from '@blueprintjs/core';
import { addTeamMembers, getCompanyMembers } from 'stores/company/Actions';
import { useLiveSearch } from 'components/useLiveSearch';
import { server } from 'config';
import { isEmpty, lowerCase } from 'lodash';

interface TeamMembersViewProps {
  showDialog: boolean;
  setShowDialog: (val: boolean) => void;
}

interface TeamMembersViewInternalProps extends TeamMembersViewProps {
  company: CompanyModel;
  addTeamMembers: (members: Array<{ account: string | undefined, company: string }>,
    newTeamMembers: string[], name: string) => void;
  getCompanyMembers: () => void;
}

const AddMemberFormComponent = (props: TeamMembersViewInternalProps) => {

  const [teamMembers, setTeamMembers]: any = useState([] as ItemEntityProps[]);

  const [selectedTeamMember, setSelectedTeamMember] = useState([] as ItemEntityProps[]);

  const [selectedNewTeamMember, setSelectedNewTeamMember] = useState([] as string[]);

  const [username, setUsername] = useState('');

  // const store = useStore();

  const userRequestFactory = (userName: string): Promise<any> => {
    const headers = tokenConfig();
    return fetch(`${server}company/${props.company.name}/members/search?email=${userName}`, headers)
      .then(res => res.json())
      .then(res => {
        console.log('res.employees.data', res.employees.data);
        return res.employees.data;
      })
      .catch(err => []);
  };

  let result: any = [];
  result = useLiveSearch(username, userRequestFactory, 800);

  useEffect(() => {
    setTeamMembers(result);
  }, [result]);

  const addNewUser = async (newUser: ItemEntityProps) => {
    console.log('newUser', newUser);
    setSelectedNewTeamMember([...selectedNewTeamMember, newUser.name!]);
  };

  return (
    <div className="pa3">
      <div className=" w-100">
        <h1 className="f5 tigrow-lightBlue">Add members</h1>
        <SuggestField
          onChange={(query: string) => {
            setUsername(query);
            // fetchTeamMembersByUsername(query) 
          }}
          items={teamMembers}
          selectedItems={selectedTeamMember}
          setSelectedItems={setSelectedTeamMember}
          multipleItemSelect={true}
          isCreatable={
            isEmpty(teamMembers)
              ? true : false
          }
          isCreatableAPI={addNewUser}
        />
      </div>

      <div className="w-100">
        {selectedTeamMember.map(item => (
          <Tag
            key={item._id}
            className="ma1 pa2"
            interactive={true}
            onRemove={e => {
              const filteredItems = selectedTeamMember.filter(selectedItem => (
                item.name !== selectedItem.name
              ));
              setSelectedTeamMember([
                ...filteredItems
              ]);
            }}
            large={true}
            intent="primary"
          >
            {item.name}
          </Tag>
        ))}
      </div>
      {selectedNewTeamMember.length ?
        <small>Invited Members:</small> : undefined
      }
      <div className="w-100">
        {selectedNewTeamMember.map((item, index) => (
          <Tag
            key={index}
            className="ma1 pa2"
            interactive={true}
            onRemove={e => {
              const filteredItems = selectedNewTeamMember.filter(selectedItem => (
                item !== selectedItem
              ));
              setSelectedNewTeamMember([
                ...filteredItems
              ]);
            }}
            large={true}
            intent="primary"
          >
            {item}
          </Tag>
        ))}
      </div>

      {
        selectedTeamMember.length + selectedNewTeamMember.length > 20 ?
          <small className="red">Could not add more than 20 members at a time.</small>
          : undefined
      }

      <div className="flex justify-end mt4">
        <Button className="grow h2 pointer white bp3-minimal w4 mr3"
          style={{ background: '#fff', outline: 'none', border: '1px solid #0fa3a3', color: '#0fa3a3' }}
          onClick={(e: any) => props.setShowDialog(!props.showDialog)}
        >
          Cancel
          </Button>
        <Button className="grow h2 pointer white bp3-minimal w4"
          style={selectedTeamMember.length + selectedNewTeamMember.length > 0 &&
            selectedTeamMember.length + selectedNewTeamMember.length <= 20 ?
            {
              background: '#0fa3a3',
              outline: 'none',
              color: 'white'
            } : {
              background: '#011b1b2e',
              outline: 'none',
              color: 'white'
            }
          }
          disabled={selectedTeamMember.length + selectedNewTeamMember.length > 0 &&
            selectedTeamMember.length + selectedNewTeamMember.length <= 20 ? false : true}
          onClick={async () => {
            const userIdWithCompany = selectedTeamMember.map(selected => {
              return {
                account: selected._id,
                company: props.company._id
              };
            });
            if (userIdWithCompany || selectedNewTeamMember) {
              await props.addTeamMembers(userIdWithCompany, selectedNewTeamMember, props.company.name);
            }
            await props.getCompanyMembers();
            props.setShowDialog(!props.showDialog);
          }
          }
        >
          Add
          </Button>
      </div>
    </div>
  );
};

const mapStateToProps = (state: any) => {
  return {
    company: state.companyReducer.currentCompany
  };
};

export const AddMemberForm = connect(mapStateToProps, { addTeamMembers, getCompanyMembers })(AddMemberFormComponent);
