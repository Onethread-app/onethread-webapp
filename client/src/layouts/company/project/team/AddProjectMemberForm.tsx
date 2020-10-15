import React, { useState, useEffect } from 'react';
import {
  SuggestField,
  ItemEntityProps,
} from 'components/fields/SuggestField';
import { connect } from 'react-redux';
import { tokenConfig } from 'stores/UtilsActions';
import { Button, Tag } from '@blueprintjs/core';
import { addProjectTeams } from 'stores/project/Actions';
import { tigrowApi } from 'config';
import { isEmpty, isEqual } from 'lodash';

interface ProjectTeamMembersProps {
  showDialog: boolean;
  setShowDialog: (val: boolean) => void;
}

interface ProjectTeamMembersInternalProps
  extends ProjectTeamMembersProps {
  companyId: string;
  projectId: string;
  // tslint:disable-next-line: max-line-length
  addProjectTeams: (
    data: {
      project: string;
      company: string;
      members: Array<{ account: string; member: string }>;
    },
    selectedTeamMember: any,
  ) => void;
  isLoading: boolean;
}

const AddProjectMemberFormComponent = (
  props: ProjectTeamMembersInternalProps,
) => {
  const [suggestedMembers, setSuggestedMembers]: any = useState([]);
  const [selectedTeamMember, setSelectedTeamMember] = useState(
    [] as ItemEntityProps[],
  );

  const getSuggestionsForRoomMembers = async () => {
    try {
      const headers = tokenConfig();
      if ((headers as any).headers.Authorization) {
        const response = await tigrowApi.get(
          `/teams/${props.companyId}/search?pid=${props.projectId}`,
          headers,
        );
        const formatResponse = response.data.teams.map((e: any) => {
          return {
            ...e.account,
            memberId: e._id,
          };
        });
        setSuggestedMembers(formatResponse);
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

  useEffect(() => {
    if (
      isEmpty(props.projectId) === false &&
      isEmpty(props.companyId) === false
    ) {
      getSuggestionsForRoomMembers();
    }
  }, []);

  return (
    <div className="pa3">
      <div className="w-100">
        <h1 className="f5 tigrow-darkBlue">Add Team Members</h1>
        <SuggestField
          items={suggestedMembers}
          selectedItems={selectedTeamMember}
          setSelectedItems={setSelectedTeamMember}
          multipleItemSelect={true}
        />
      </div>

      <div className="w-100 mb2">
        {selectedTeamMember.map((item) => (
          <Tag
            key={item._id}
            className="ma1 pa2"
            style={{ backgroundColor: '#3b5998', color: 'white' }}
            interactive={true}
            onRemove={(e) => {
              const filteredItems = selectedTeamMember.filter(
                (selectedItem) => item.name !== selectedItem.name,
              );
              setSelectedTeamMember([...filteredItems]);
            }}
            large={true}
          >
            {item.name}
          </Tag>
        ))}
      </div>

      <div className="flex justify-end mt3">
        <Button
          className="grow h2 pointer white bp3-minimal w4 mr3"
          style={{
            background: '#fff',
            outline: 'none',
            border: '1px solid #3b5998',
            color: '#3b5998',
          }}
          onClick={(e: any) => props.setShowDialog(!props.showDialog)}
        >
          Cancel
        </Button>
        <Button
          className="grow h2 pointer white bp3-minimal w4 outline-0"
          style={{ backgroundColor: '#3b5998', color: 'white' }}
          disabled={selectedTeamMember.length === 0}
          onClick={async () => {
            const data = {
              project: props.projectId,
              company: props.companyId,
              members: selectedTeamMember.map((m: any) => {
                return {
                  account: m._id,
                  member: m.memberId,
                };
              }),
            };

            await props.addProjectTeams(
              data,
              selectedTeamMember,
            );

            if (props.setShowDialog && props.isLoading === false) {
              props.setShowDialog(!props.showDialog);
            }
          }}
        >
          Add
        </Button>
      </div>
    </div>
  );
};

const mapStateToProps = (state: any) => {
  return {
    companyId: state.companyReducer.currentCompany._id,
    projectId: state.projectReducer.pid,
    isLoading: state.projectReducer.addTeamMemberLoading,
  };
};

export const AddProjectMemberForm = connect(mapStateToProps, {
  addProjectTeams,
})(AddProjectMemberFormComponent);
