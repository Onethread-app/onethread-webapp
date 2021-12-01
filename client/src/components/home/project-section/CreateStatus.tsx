import { Popover, Position } from '@blueprintjs/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { useEffect, useState } from 'react';
import { Color } from 'stores/UtilsActions';

import {
  CreateStatusContainer,
  CustomStatusContainer,
  ProjectHeader,
  Status,
  StatusContainer,
  StyledButton,
  ColorItem,
  ColorContainer,
  SelectColor,
  StatusItem,
  SimpleButton,
  StatusGrid,
  StatusGridContainer,
} from './ProjectSection.styles';

const Colors = (props: {
  setColor: React.Dispatch<React.SetStateAction<string>>;
  setPopoverOpen: React.Dispatch<React.SetStateAction<string>>;
  setStatusList?: React.Dispatch<
    React.SetStateAction<{ name; positionInBoard; color }[]>
  >;
  popoverOpen: string;
}) => {
  const changeColor = (value: string) => {
    props.setColor(value);
    props.setPopoverOpen('');
  };
  const updateStatusColor = (value: string) => {
    props.setStatusList!((statusList) =>
      statusList.map((status) =>
        status.name === props.popoverOpen
          ? { ...status, color: value }
          : status,
      ),
    );
    props.setPopoverOpen('');
  };

  return (
    <ColorContainer>
      {Color.map((color) => (
        <ColorItem
          key={color.code}
          bg={color.value}
          onClick={() => {
            props.popoverOpen === 'x'
              ? changeColor(color.value)
              : updateStatusColor(color.value);
          }}
        />
      ))}
    </ColorContainer>
  );
};

interface Props {
  handleSubmit: (val, statuses) => void;
  statusList: {
    name: string;
    positionInBoard: number;
    color: string;
  }[];
  setStatusList: React.Dispatch<
    React.SetStateAction<
      { name: string; positionInBoard: number; color: string }[]
    >
  >;
  values: any;
  setShowDialog: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreateStatus = (props: Props) => {
  const {
    handleSubmit,
    statusList,
    setStatusList,
    values,
    setShowDialog,
  } = props;
  const [showAddStatus, setShowAddStatus] = useState<boolean>(false);
  const [showStatusInputField, setShowStatusInputField] =
    useState<boolean>(false);
  const [value, setValue] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [color, setColor] = useState<string>('');
  const [popoverOpen, setPopoverOpen] = useState<string>('');
  const [showUpdate, setShowUpdate] = useState<string>('');
  const [updatedValue, setUpdatedValue] = useState<string>('');

  const handleUpdate = (value) => {
    if (statusList.find((status) => status.name === updatedValue)) {
      setError('Status already exists');
      return;
    }
    props.setStatusList!((statusList) =>
      statusList.map((status) =>
        status.name === value
          ? { ...status, name: updatedValue }
          : status,
      ),
    );
    setUpdatedValue('');
  };

  const handleDefaultStatus = () => {
    handleSubmit(values, [
      ...statusList,
      {
        name: 'Not Started',
        positionInBoard: 1,
        color: '#ffa800',
      },
      {
        name: 'On Going',
        positionInBoard: 2,
        color: '#08a0f7',
      },
      {
        name: 'Completed',
        positionInBoard: 3,
        color: '#2eb67d',
      },
    ]);
  };

  const handleStatusSubmit = () => {
    if (value.length < 3) {
      setError('Status name must be at least 3 characters long');
      return;
    }
    if (
      statusList.find(
        (status) => status.name.toLowerCase() === value.toLowerCase(),
      )
    ) {
      setError('Status already exists');
    } else {
      setStatusList([
        ...statusList,
        {
          name: value,
          positionInBoard: statusList.length,
          color: color ? color : '#b1b1b1',
        },
      ]);
      setValue('');
      setColor('');
    }
  };

  useEffect(() => {
    if (value) {
      setError('');
    }
  }, [value]);

  return (
    <CreateStatusContainer>
      <ProjectHeader>{values.name}</ProjectHeader>
      <div>What project statuses do you want to create?</div>
      {!showAddStatus ? (
        <>
          <StatusContainer>
            <Status bg="#FFA800">Not Started</Status>
            <Status bg="#08A0F7">On Going</Status>
            <Status bg="#2EB67D">Completed</Status>
          </StatusContainer>
          <div className="row">
            <StyledButton onClick={handleDefaultStatus} type="button">
              Use default statuses
            </StyledButton>
            <span>Or</span>
            <StyledButton
              type="button"
              onClick={() => setShowAddStatus(true)}
            >
              Customize statuses
            </StyledButton>
          </div>
        </>
      ) : (
        <CustomStatusContainer>
          <StatusGridContainer>
            {statusList.length > 1 &&
              statusList.map((status, i) => (
                <>
                  <StatusGrid
                    key={status.positionInBoard}
                    color={i === 0 ? 'black' : 'white'}
                    bg={i === 0 ? 'white' : status.color}
                    border={
                      i === 0
                        ? '1px solid black'
                        : `1px solid ${status.color}`
                    }
                  >
                    {status.name}
                  </StatusGrid>
                </>
              ))}
          </StatusGridContainer>
          <StyledButton
            type="button"
            onClick={() =>
              setShowStatusInputField(!showStatusInputField)
            }
          >
            + Add new status
          </StyledButton>
          <div className="column">
            {statusList.length > 1 ? (
              <div className="status-container">
                {statusList.map((status, i) =>
                  i !== 0 ? (
                    showUpdate !== status.name ? (
                      <StatusItem key={status.positionInBoard}>
                        <Popover
                          isOpen={popoverOpen === status.name}
                          position={Position.BOTTOM}
                          content={
                            <Colors
                              setColor={setColor}
                              setPopoverOpen={setPopoverOpen}
                              setStatusList={setStatusList}
                              popoverOpen={popoverOpen}
                            />
                          }
                          canEscapeKeyClose={true}
                          target={
                            <SelectColor
                              bg={status.color}
                              translate="translate(-23px,-10px)"
                              onClick={() =>
                                setPopoverOpen(status.name)
                              }
                            />
                          }
                        />
                        <span className="mr-auto">{status.name}</span>{' '}
                        <Popover
                          position={Position.BOTTOM}
                          targetClassName="mt1"
                          content={
                            <div className="flex flex-column pa2">
                              <div
                                className="pointer"
                                onClick={() => {
                                  setUpdatedValue(status.name);
                                  setShowUpdate(status.name);
                                }}
                              >
                                Rename
                              </div>
                              <div
                                className="pointer mt1"
                                onClick={() =>
                                  setStatusList((statusList) =>
                                    statusList.filter(
                                      (s) => s.name !== status.name,
                                    ),
                                  )
                                }
                              >
                                Delete
                              </div>
                            </div>
                          }
                          canEscapeKeyClose={true}
                          target={<MoreVertIcon />}
                        />
                      </StatusItem>
                    ) : (
                      <input
                        type="text"
                        name="status"
                        placeholder="Enter status name"
                        value={updatedValue}
                        onChange={(e) =>
                          setUpdatedValue(
                            e.target.value.replaceAll(/[^a-z]/gi, ''),
                          )
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleUpdate(status.name);
                          }
                        }}
                      />
                    )
                  ) : null,
                )}
              </div>
            ) : null}
            {showStatusInputField ? (
              <div className="column">
                {error ? (
                  <small className="error">{error}</small>
                ) : null}
                <div className="input-div">
                  <Popover
                    isOpen={popoverOpen === 'x'}
                    position={Position.BOTTOM}
                    content={
                      <Colors
                        setColor={setColor}
                        setPopoverOpen={setPopoverOpen}
                        popoverOpen={popoverOpen}
                      />
                    }
                    target={
                      <SelectColor
                        className="color"
                        bg={color}
                        translate="translate(10px,-10px)"
                        onClick={() => setPopoverOpen('x')}
                      />
                    }
                  />
                  <input
                    type="text"
                    name="status"
                    placeholder="Enter status name"
                    value={value}
                    onChange={(e) =>
                      setValue(
                        e.target.value.replaceAll(/[^a-z]/gi, ''),
                      )
                    }
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleStatusSubmit();
                      }
                    }}
                  />
                </div>
              </div>
            ) : null}
          </div>
          <div className="button-container">
            <SimpleButton
              type="button"
              onClick={() => setShowDialog(false)}
            >
              Cancel
            </SimpleButton>
            <StyledButton
              type="button"
              onClick={() => handleSubmit(values, statusList)}
            >
              Create
            </StyledButton>
          </div>
        </CustomStatusContainer>
      )}
    </CreateStatusContainer>
  );
};

export default CreateStatus;
