import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { tigrowApi } from 'config';

import { Form, Field } from 'react-final-form';
import { Icon } from '@blueprintjs/core/lib/esm/components/icon/icon';
import { Button } from '@blueprintjs/core/lib/esm/components/button/buttons';
import { IconNames } from '@blueprintjs/icons';

import {
  addSubTaskMember,
  IPayloadForAddingMember,
} from 'stores/subtask/Actions';
import { tokenConfig } from 'stores/UtilsActions';

import { SubmitError } from 'components/final-form/SubmitError';
import { checkError } from 'components/final-form/utils';
import { SuggestField } from 'components/fields/SuggestField';
import { useLiveSearch } from 'components/useLiveSearch';

interface IAddSubtaskMember {
  setMembersPopover: React.Dispatch<
    React.SetStateAction<{
      _id: string;
      open: boolean;
    }>
  >;
  id: string;
}

interface IAddSubtaskMemberInternalProps extends IAddSubtaskMember {
  projectId: string;
  addSubTaskMember: ({
    _id,
    memberId,
  }: IPayloadForAddingMember) => void;
  addingMember: boolean;
  errorOnAddingMember: string;
}

const AddSubtaskMember = (props: IAddSubtaskMemberInternalProps) => {
  const [username, setUsername] = useState('');
  const [users, setUsers]: any = useState([]);
  const [selectedUser, setSelectedUser]: any = useState([]);

  const onSubmit = async (values: any) => {
    const payload = {
      _id: props.id,
      memberId: values.member,
    };
    await props.addSubTaskMember(payload);

    if (
      props.addingMember === false &&
      props.errorOnAddingMember === ''
    ) {
      props.setMembersPopover({ _id: props.id, open: false });
    }
  };

  const userRequestFactory = async () => {
    const headers = tokenConfig();
    const response = await tigrowApi.get(
      `subtasks/${props.id}/search?pid=${props.projectId}`,
      headers,
    );
    return response.data.data;
  };

  let result: any = [];
  result = useLiveSearch(username, userRequestFactory, 800);

  useEffect(() => {
    setUsers(result);
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
              onClick={(e: any) =>
                props.setMembersPopover({
                  _id: props.id,
                  open: false,
                })
              }
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
                      Assign Member
                    </p>
                  </div>
                  <SuggestField
                    onChange={(query: string) => {
                      setUsername(query);
                    }}
                    items={users}
                    selectedItems={selectedUser}
                    setSelectedItems={(item) => {
                      setSelectedUser(item);
                      input.onChange(item._id);
                    }}
                    multipleItemSelect={false}
                  />
                </div>
              </div>
            )}
          />
          <div className="fr">
            <Button
              className="grow pointer white bp3-minimal w4 mt2"
              style={{
                background: '#34b3e9',
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
    projectId: state.projectReducer.projectDetails._id,
    addingMember: state.taskIndexReducer.subTaskReducer.addingMember,
    errorOnAddingMember:
      state.taskIndexReducer.subTaskReducer.errorOnAddingMember,
  };
};

export default connect(mapStateToProps, { addSubTaskMember })(
  AddSubtaskMember,
);
