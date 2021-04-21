import React, { useState } from 'react';
import {
  SuggestField,
  ItemEntityProps,
} from 'components/fields/SuggestField';
import { Tag, Button } from '@blueprintjs/core';
import { connect } from 'react-redux';
import { tokenConfig } from 'stores/UtilsActions';
import { isEmpty, isEqual } from 'lodash';
import { TaskBoard } from 'stores/board/Reducer';
import { addTeamMembersIntoBoard } from 'stores/board/Actions';
import { tigrowApi } from 'config';
import { IProject } from 'stores/project/Reducer';

interface AddTeamMemberFormProps {
  setShowAddMemberFormDialog?: (val: boolean) => void;
  currentBoard: TaskBoard;
}

interface AddTeamMemberFormInternalProps
  extends AddTeamMemberFormProps {
  project?: IProject;
  addTeamMembersIntoBoard: (
    memberId: Array<string | undefined>,
    name: string | undefined,
  ) => void;
}

const AddTeamMemberFormComponent = (
  props: AddTeamMemberFormInternalProps,
) => {
  const [teamMembers, setTeamMembers]: any = useState([]);
  const [loading, setLoading] = useState(false);
  // TODO Should comes from redux store
  const [selectedItems, setSelectedItems] = useState(
    [] as ItemEntityProps[],
  );

  // const store = useStore();

  const fetchTeamMembersByUsername = async (userName: string) => {
    try {
      const headers = tokenConfig();
      if ((headers as any).headers.Authorization) {
        if (isEmpty(userName) === false) {
          const response = await tigrowApi.get(
            `/boards/${
              props.currentBoard._id
            }/suggest-member?pid=${props.project!._id}`,
            headers,
          );
          setTeamMembers(response.data);
        }
      } else {
      }
    } catch (error) {
      if (isEqual(error.message, 'Network Error')) {
      } else {
        // tslint:disable-next-line: no-console
        console.log(error.response);
      }
    }
  };

  return (
    <div className="pa3 bg-white cf">
      <div className="fl w-100 pv2">
        <SuggestField
          onChange={(query: string) => {
            fetchTeamMembersByUsername(query);
          }}
          items={teamMembers}
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
          multipleItemSelect={true}
          isCreatable={false}
        />
      </div>
      <div className="fl w-100 mb2">
        {selectedItems.map((item) => (
          <Tag
            key={item._id}
            className="ma1 pa2"
            interactive={true}
            intent="primary"
            onRemove={(e) => {
              const filteredItems = selectedItems.filter(
                (selectedItem) => item.name !== selectedItem.name,
              );
              setSelectedItems([...filteredItems]);
            }}
            large={true}
          >
            {item.name}
          </Tag>
        ))}
      </div>
      <div className="fl w-100">
        <div className="flex justify-end">
        <Button
            type="submit"
            onClick={async (e: any) => {
              e.preventDefault();
              setLoading(true);
              const userIds = selectedItems.map(
                (selected) => selected._id,
              );
              if (userIds) {
                await props.addTeamMembersIntoBoard(
                  userIds,
                  props.currentBoard._id,
                );
              }
              setLoading(false);
              if (props.setShowAddMemberFormDialog) {
                props.setShowAddMemberFormDialog(false);
              }
            }}
            className="w4 grow h2 pointer mr3"
            loading={loading}
            style={
              selectedItems.length < 1 === false
                ? {
                    background: '#3F61C5',
                    outline: 'none',
                    color: 'white',
                  }
                : {
                    background: '#011b1b2e',
                    outline: 'none',
                    color: 'white',
                  }
            }
            disabled={selectedItems.length < 1}
          >
            Add
          </Button>
          <Button
            className="w4 grow h2 pointer"
            onClick={(e: any) => {
              e.preventDefault();
              if (props.setShowAddMemberFormDialog) {
                props.setShowAddMemberFormDialog(false);
              }
            }}
            style={{
              background: '#fff',
              outline: 'none',
              border: '2px solid #3F61C5',
              color: '#3F61C5',
            }}
          >
            cancel
          </Button>
       
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: any) => {
  return {
    project: state.projectReducer.projectDetails,
  };
};

export const AddTeamMemberForm = connect(mapStateToProps, {
  addTeamMembersIntoBoard,
})(AddTeamMemberFormComponent);
