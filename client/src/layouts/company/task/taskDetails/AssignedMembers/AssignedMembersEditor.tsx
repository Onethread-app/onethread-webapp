import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash';
import { tigrowApi } from 'config';

import { Form, Field } from 'react-final-form';
import { IconNames } from '@blueprintjs/icons';
import { Icon } from '@blueprintjs/core/lib/esm/components/icon/icon';
import { Tag } from '@blueprintjs/core/lib/esm/components/tag/tag';
import { Button } from '@blueprintjs/core/lib/esm/components/button/buttons';

import { ITask } from 'stores/task/Reducer';
import { IProject } from 'stores/project/Reducer';
import {
  addTaskMember,
  addTaskMemberSuccess,
  addTaskMemberFailure,
} from 'stores/taskMembers/Action';
import { tokenConfig } from 'stores/UtilsActions';

import { SubmitError } from 'components/final-form/SubmitError';
import { checkError } from 'components/final-form/utils';
import { SuggestField } from 'components/fields/SuggestField';
import { useLiveSearch } from 'components/useLiveSearch';

interface IMembersFormProps {
  setMembersPopover: (val: boolean) => void;
  project?: IProject;
  currentTask?: ITask;
  addTaskMember: (members: string[]) => any;
  isEditingTask: boolean;
}

interface ICompanyTeamMembers {
  _id: string;
  name: string;
}
export const AssignedMembersEditorComponent = (
  props: IMembersFormProps,
) => {
  const { t } = useTranslation();
  const [teamMembers, setTeamMembers]: any = useState([]);
  const [selectedTeamMember, setSelectedTeamMember] = useState(
    [] as ICompanyTeamMembers[],
  );
  const [username, setUsername] = useState('');

  const onSubmit = async (values: any) => {
    const response = await props.addTaskMember(values.member);
    if (props.isEditingTask === false) {
      props.setMembersPopover(false);
      return true;
    }
    return { [response.fieldName]: response.message };
  };

  const userRequestFactory = async (userName: string) => {
    const headers = tokenConfig();
    const response = await tigrowApi.get(
      `tasks/${props.currentTask!._id}/suggest-member?pid=${
        props.project!._id
      }`,
      headers,
    );
    return response.data.members;
  };

  let result: any = [];
  result = useLiveSearch(username, userRequestFactory, 800);

  useEffect(() => {
    setTeamMembers(result);
  }, [result]);

  return (
    <Form
      onSubmit={onSubmit}
      render={({
        handleSubmit,
        form,
        submitting,
        pristine,
        values,
        submitError,
        hasValidationErrors,
        ...rest
      }) => (
        <form className="fl w-100 ph2 pt2" onSubmit={handleSubmit}>
          <div className="flex justify-end">
            <Icon
              icon={IconNames.CROSS}
              iconSize={20}
              className="grow pointer"
              onClick={(e: any) => props.setMembersPopover(false)}
            />
          </div>
          <div>
            <SubmitError errorMessage={submitError} />
          </div>
          <Field<string>
            name="member"
            render={({ input, meta }) => (
              <div className={` ${checkError(meta) ? 'mb3' : 'mb4'}`}>
                <div className="fl w-100 pb2">
                  <div className="mb1">
                    <p className="fw5" style={{ fontSize: '.8rem' }}>
                      {t('app.project.Project-boards.Assign-Members')}
                    </p>
                  </div>
                  <SuggestField
                    onChange={(query: string) => {
                      setUsername(query);
                    }}
                    items={teamMembers}
                    selectedItems={selectedTeamMember}
                    setSelectedItems={(item) => {
                      setSelectedTeamMember(item);
                      input.onChange(
                        item.map(
                          (member: ICompanyTeamMembers) => member._id,
                        ),
                      );
                    }}
                    multipleItemSelect={true}
                  />
                </div>
                {selectedTeamMember.length > 0 && (
                  <div className="w-100">
                    <div
                      className="overflow-auto br2"
                      style={{
                        border: '1px solid #707070',
                        maxHeight: '120px',
                        background: '#707070',
                      }}
                    >
                      {selectedTeamMember.map((item) => (
                        <div key={item._id}>
                          <Tag
                            key={item._id}
                            className="pa1"
                            interactive={true}
                            style={{ background: '#707070' }}
                            onRemove={(e) => {
                              const filteredItems =
                                selectedTeamMember.filter(
                                  (selectedItem) =>
                                    item.name !== selectedItem.name,
                                );
                              setSelectedTeamMember([
                                ...filteredItems,
                              ]);
                              input.onChange(
                                isEmpty(filteredItems)
                                  ? undefined
                                  : filteredItems.map(
                                      (member: ICompanyTeamMembers) =>
                                        member._id,
                                    ),
                              );
                            }}
                            large={true}
                            intent="primary"
                          >
                            {item.name}
                          </Tag>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          />
          <div className="fr">
            <Button
              className="grow pointer white bp3-minimal w4 mt2"
              style={{
                background: '#08A0F7',
                outline: 'none',
                color: 'white',
              }}
              loading={submitting}
              type="submit"
              disabled={submitting || pristine}
            >
              Assign
            </Button>
          </div>
        </form>
      )}
    />
  );
};

const mapStateToProps = (state: any) => {
  return {
    project: state.projectReducer.projectDetails,
    currentTask: state.taskIndexReducer.taskReducer.currentTask,
    isEditingTask: state.taskMembersReducer.isEditingTask,
  };
};

export const AssignedMembersEditor = connect(mapStateToProps, {
  addTaskMember,
  addTaskMemberSuccess,
  addTaskMemberFailure,
})(AssignedMembersEditorComponent);
