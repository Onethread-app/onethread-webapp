import React, { useState, useEffect } from 'react';
import { CompanyModel } from 'stores/company/Reducer';
import { SuggestField, ItemEntityProps } from 'components/fields/SuggestField';
import { connect } from 'react-redux';
import { tokenConfig } from 'stores/UtilsActions';
import { Button, Tag, Toaster, Position } from '@blueprintjs/core';
import { addTeamMembers, getCompanyMembers } from 'stores/company/Actions';
import { useLiveSearch } from 'components/useLiveSearch';
import { server, tigrowApi } from 'config';
import { isEmpty } from 'lodash';

interface TeamMembersViewProps {
  showDialog: boolean;
  setShowDialog: (val: boolean) => void;
}

interface TeamMembersViewInternalProps extends TeamMembersViewProps {
  company: CompanyModel;
  addTeamMembers: (members: Array<{ account: string | undefined, company: string }>,
    pendingTeamMembers: string[], name: string) => void;
  getCompanyMembers: () => void;
}

const AddMemberFormComponent = (props: TeamMembersViewInternalProps) => {

  const [teamMembers, setTeamMembers]: any = useState([] as ItemEntityProps[]);

  const [selectedTeamMember, setSelectedTeamMember] = useState([] as ItemEntityProps[]);

  const [pendingTeamMembers, setPendingTeamMembers] = useState([] as string[]);

  const [email, setEmail] = useState('');

  const userRequestFactory = (_email: string): Promise<any> => {
    const headers = tokenConfig();
    return fetch(`${server}company/${props.company.name}/members/search?email=${_email}`, headers)
      .then(res => res.json())
      .then(res => res.employees.data)
      .catch(err => []);
  };

  let result: any = [];
  result = useLiveSearch(email, userRequestFactory, 800);

  useEffect(() => {
    setTeamMembers(result);
  }, [result]);

  const isEmail = (_email: string) => {
    const regexForEmailValidation = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (email.match(regexForEmailValidation)) {
      return true;
    }
    return false;
  };

  const checkPendingMemberStatus = async (_email: string) => {
    try {
      const headers = tokenConfig();
      if ((headers as any).headers.Authorization) {
        const response = await tigrowApi.get(
          `company/${props.company.name}/members/pending/status?email=${_email}`,
          headers
        );
        return response.data.status;
      } else {
        // tslint:disable-next-line: no-console
        console.log('error in checking of pending member status');
        return false;
      }
    } catch (error) {
      // tslint:disable-next-line: no-console
      console.log(error);
      return false;
    }
  };

  const addNewUser = async (newUser: ItemEntityProps) => {
    const status = await checkPendingMemberStatus(email);
    if (status) {
      setPendingTeamMembers([...pendingTeamMembers, newUser.name!]);
    } else {
      Toaster
        .create({
          position: Position.TOP
        })
        .show({
          message: `${newUser.name!} has already invited.`
        });
    }
  };

  return (
    <div className="pa3">
      <div className=" w-100">
        <h1 className="f5 tigrow-lightBlue">Add members</h1>
        <SuggestField
          onChange={(query: string) => { setEmail(query); }}
          items={teamMembers}
          selectedItems={selectedTeamMember}
          setSelectedItems={setSelectedTeamMember}
          multipleItemSelect={true}
          isCreatable={isEmpty(teamMembers) && isEmail(email) ? true : false}
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
      {pendingTeamMembers.length ?
        <small>Invited Members:</small> : undefined
      }
      <div className="w-100">
        {pendingTeamMembers.map((item, index) => (
          <Tag
            key={index}
            className="ma1 pa2"
            interactive={true}
            onRemove={e => {
              const filteredItems = pendingTeamMembers.filter(selectedItem => (
                item !== selectedItem
              ));
              setPendingTeamMembers([
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
        selectedTeamMember.length + pendingTeamMembers.length > 20 ?
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
          style={selectedTeamMember.length + pendingTeamMembers.length > 0 &&
            selectedTeamMember.length + pendingTeamMembers.length <= 20 ?
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
          disabled={selectedTeamMember.length + pendingTeamMembers.length > 0 &&
            selectedTeamMember.length + pendingTeamMembers.length <= 20 ? false : true}
          onClick={async () => {
            const userIdWithCompany = selectedTeamMember.map(selected => {
              return {
                account: selected._id,
                company: props.company._id
              };
            });
            if (userIdWithCompany || pendingTeamMembers) {
              await props.addTeamMembers(userIdWithCompany, pendingTeamMembers, props.company.name);
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
