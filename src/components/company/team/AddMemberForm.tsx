import React, { useState, useEffect } from 'react'
import { CompanyModel } from 'stores/company/Reducer';
import { SuggestField, ItemEntityProps } from 'components/common/field/SuggestField';
import { useStore, connect } from 'react-redux';
import { tokenConfig } from 'stores/UtilsActions';
import tigrowApi, { server } from 'tigrowApi';
import { isEqual, isEmpty } from 'lodash';
import { Button, Tag } from '@blueprintjs/core';
import { addTeamMembers, getCompanyMembers } from 'stores/company/Actions';
import useLiveSearch from 'components/common/observer/useLiveSearch';

interface TeamMembersViewProps {
  showDialog: boolean;
  setShowDialog: (val: boolean) => void;
}

interface TeamMembersViewInternalProps extends TeamMembersViewProps {
  company: CompanyModel;
  addTeamMembers: (members: { account: string | undefined, company: string }[], name: string) => void;
  getCompanyMembers: () => void;
}

const AddMemberFormComponent = (props: TeamMembersViewInternalProps) => {

  const [teamMembers, setTeamMembers]: any = useState([]);

  const [selectedTeamMember, setSelectedTeamMember] = useState([] as ItemEntityProps[]);
  const [username, setUsername] = useState('');

  const store = useStore();

  const fetchTeamMembersByUsername = async (userName: string) => {
    try {
      const headers = tokenConfig(store.getState);
      if ((headers as any).headers.Authorization) {
        if (isEmpty(userName) === false) {
          const response = await tigrowApi.get(`company/${props.company.name}/members/search?name=${userName}`, headers);
          setTeamMembers(response.data.employees.data);
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

  const userRequestFactory = (userName: string): Promise<any> => {
    const headers = tokenConfig(store.getState);
    return fetch(`${server}company/${props.company.name}/members/search?name=${userName}`, headers)
      .then(res => res.json())
      .catch(err => []);
  }

  let result: any = [];
  result = useLiveSearch(username, userRequestFactory, 800);

  useEffect(() => {
    setTeamMembers(result)
  }, [result])


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
              ])
            }}
            large={true}
            intent="primary"
          >
            {item.name}
          </Tag>
        ))}
      </div>

      <div className="flex justify-end mt4">
        <Button className="grow h2 pointer white bp3-minimal w4 mr3"
          style={{ background: "#fff", outline: "none", border: "1px solid #0fa3a3", color: "#0fa3a3" }}
          onClick={(e: any) => props.setShowDialog(!props.showDialog)}
        >
          Cancel
          </Button>
        <Button className="grow h2 pointer white bp3-minimal w4"
          style={selectedTeamMember.length < 1 === false ?
            {
              background: "#0fa3a3",
              outline: "none",
              color: 'white'
            } : {
              background: '#011b1b2e',
              outline: "none",
              color: 'white'
            }
          }
          disabled={selectedTeamMember.length < 1}
          onClick={async () => {
            const userIdWithCompany = selectedTeamMember.map(selected => {
              return {
                account: selected._id,
                company: props.company._id
              }
            })
            if (userIdWithCompany) {
              await props.addTeamMembers(userIdWithCompany, props.company.name);
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
  )
}

const mapStateToProps = (state: any) => {
  return {
    company: state.companyReducer.currentCompany
  }
}

export const AddMemberForm = connect(mapStateToProps, { addTeamMembers, getCompanyMembers })(AddMemberFormComponent)
