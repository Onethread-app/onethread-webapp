import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { connect } from 'react-redux';

import { addTaskMember } from 'stores/taskMembers/Action';
import { ITask } from 'stores/task/Reducer';
import { tigrowApi } from 'config';
import { formTokenConfig } from 'stores/UtilsActions';

import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import CheckIcon from '@material-ui/icons/Check';

import { Member, MembersContainer, SubtaskMemberPopoverDiv } from './SubtaskMemberPopover.styles';
import TextAvatar from 'components/avatar/TextAvatar';
import { AlignCenter } from 'components/UtilComponents';
import { StyledButton } from 'components/form-components/Index.styles';

interface ItemEntityProps {
  _id: string;
  name: string;
}

interface ISubtaskMemberPopoverProps {
  subtask: ITask;
  isEditingTask: boolean;
  addTaskMember: ({
    taskId,
    projectId,
    companyId,
    assignmembers,
  }: {
    taskId: string;
    projectId: string;
    companyId: string;
    assignmembers: string[];
  }) => void;
  setMembersPopover: Dispatch<SetStateAction<{ _id: string; open: boolean; }>>;
}

const SubtaskMemberPopover = (props: ISubtaskMemberPopoverProps) => {
  const { subtask } = props;
  const [selectedUsers, setSelectedUsers] = useState<ItemEntityProps[]>([]);
  const [users, setUsers] = useState<ItemEntityProps[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<ItemEntityProps[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const userRequestFactory = async () => {
    const headers = formTokenConfig(subtask.company._id);
    const response = await tigrowApi.get(
      `tasks/${subtask._id}/suggest-member?pid=${subtask.project._id}`,
      headers,
    );
    return response.data.members;
  };

  const handleChange = (e) => {
    setSearchValue(e.target.value);
  }

  const handleClick = (event, user: ItemEntityProps) => {
    event.preventDefault();
    event.stopPropagation();

    if (selectedUsers.find((item) => item._id === user._id)) {
      setSelectedUsers(selectedUsers.filter((item) => item._id !== user._id));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  }

  const handleSubmit = () => {
    if (selectedUsers.length > 0) {
      const payload = {
        taskId: subtask._id,
        companyId: subtask.company._id,
        projectId: subtask.project._id,
        assignmembers: selectedUsers.map((user) => user._id),
      }
      props.addTaskMember(payload);
      setSubmitting(true);
    }
  }

  useEffect(() => {
    const getUsers = async () => {
      const users = await userRequestFactory();
      setUsers(users);
      setFilteredUsers(users);
      setLoading(false);
    }
    getUsers();
  }, []);

  useEffect(() => {
    setFilteredUsers(users.filter(user => user.name.toLowerCase().includes(searchValue.toLowerCase())));
  }, [searchValue, users])

  useEffect(() => {
    if (submitting && props.isEditingTask === false) {
      setSubmitting(false);
      props.setMembersPopover({ _id: subtask._id, open: false });
    }
  }, [submitting, props.isEditingTask])

  return (
    <SubtaskMemberPopoverDiv
      onClick={e => e.stopPropagation()}
    >
      <TextField
        placeholder="Search members"
        id="subtask-members"
        className=''
        InputProps={{
          startAdornment:
            <InputAdornment position="start">
              <SearchIcon fontSize='small' />
            </InputAdornment>,
        }}
        onChange={handleChange}
      />
      <MembersContainer>
        {loading ?
          <span>loading...</span> :
          filteredUsers.map((user) =>
            <Member
              key={user._id}
              onClick={(e) => handleClick(e, user)}
              selected={selectedUsers.find(selectedUser => selectedUser._id === user._id)}
            >
              <AlignCenter>
                <TextAvatar name={user.name} small />
                <span className={`ml2`}>{user.name}</span>
              </AlignCenter>
              {selectedUsers.find(selectedUser => selectedUser._id === user._id) && <CheckIcon fontSize='small' />}
            </Member>
          )
        }
      </MembersContainer>
      {selectedUsers.length > 0 &&
        <StyledButton
          onClick={handleSubmit}
          disabled={loading || selectedUsers.length === 0}
          small={true}
          className='self-start'
        >
          {submitting ? 'Assigning...' : 'Assign'}
        </StyledButton>
      }
    </SubtaskMemberPopoverDiv>
  )
}

const mapStateToProps = (state: any) => ({
  isEditingTask: state.taskMembersReducer.isEditingTask
})

export default connect(mapStateToProps, {
  addTaskMember
})(SubtaskMemberPopover)
