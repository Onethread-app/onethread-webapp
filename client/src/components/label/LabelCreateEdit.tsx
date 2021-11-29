import { Icon } from '@blueprintjs/core/lib/esm/components/icon/icon';
import CircularProgress from '@material-ui/core/CircularProgress/CircularProgress';
import SelectColor from 'components/color/SelectColor';
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useState,
} from 'react';
import { connect } from 'react-redux';
import {
  CreateEditLabelButton,
  CreateEditLabelButtonContainer,
  CreateEditLabelContainer,
  CreateEditLabelHeader,
  CreateEditLabelInput,
} from './TaskLabel.styles';

interface ILabelCreateEdit {
  setView: Dispatch<SetStateAction<'default' | 'createedit'>>;
  setEditLabel: Dispatch<any>;
  label?: {
    _id: string;
    color: string;
    description: string;
    name: string;
  };
  currentTask: any;
  createLabel: any;
  closePopover: () => void;
}

const LabelCreateEdit = (props: ILabelCreateEdit) => {
  const { label } = props;
  const labelCreation = label ? false : true;
  const [labelColor, setLabelColor] = useState<string>(
    label ? label.color : '',
  );
  const [labelName, setLabelName] = useState<string>(
    label ? label.name : '',
  );
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleLabelNameChange = (
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    setLabelName(e.target.value);
  };

  const handleGoBack = () => {
    props.setView('default');
    props.setEditLabel(null);
    props.closePopover();
  };

  const submitLabel = async (e) => {
    setIsLoading(true);
    setMessage('');
    if (!labelName) {
      setMessage('Name is required');
    } else if (labelName.length <= 2) {
      setMessage('Name must be at least 2 characters');
    } else if (!labelColor) {
      setMessage('Color is required');
    } else {
      const body = {
        name: labelName,
        color: labelColor,
        task: props.currentTask._id,
      };
      try {
        await props.createLabel(body);
        handleGoBack();
      } catch (err: any) {
        if (
          err &&
          err.response &&
          err.response.data &&
          err.response.data.errors &&
          err.response.data.errors.length > 0
        ) {
          setMessage(err.response.data.errors[0].message);
        }
      }
    }
    setIsLoading(false);
  };

  return (
    <CreateEditLabelContainer>
      <CreateEditLabelHeader>
        <Icon
          icon="chevron-left"
          onClick={handleGoBack}
          className="pointer silver"
        />
        <div>{!labelCreation ? 'Edit Label' : 'Create Label'}</div>
        <Icon icon="cross" className="o-0" />
      </CreateEditLabelHeader>
      {isLoading ? (
        <div style={{ textAlign: 'center', paddingBottom: 8 }}>
          <CircularProgress />
        </div>
      ) : (
        <>
          {message.length > 0 && (
            <div style={{ textAlign: 'center', color: 'red' }}>
              <p>{message}</p>
            </div>
          )}
          <label htmlFor="labelName" className="b f5 mb1">
            Name
          </label>
          <CreateEditLabelInput
            value={labelName}
            onChange={handleLabelNameChange}
            name="labelName"
            id="labelName"
            autoFocus
            required
          />
          <label className="b f5 mb1">Color</label>
          <SelectColor
            labelColor={labelColor}
            setLabelColor={setLabelColor}
          />
        </>
      )}

      <CreateEditLabelButtonContainer>
        <CreateEditLabelButton type="cancel" onClick={handleGoBack}>
          Cancel
        </CreateEditLabelButton>
        {!labelCreation ? (
          <CreateEditLabelButton>Edit</CreateEditLabelButton>
        ) : (
          <CreateEditLabelButton
            onClick={(e) => submitLabel(e)}
            disabled={isLoading ? true : false}
          >
            Create
          </CreateEditLabelButton>
        )}
      </CreateEditLabelButtonContainer>
    </CreateEditLabelContainer>
  );
};

const mapStateToProps = (state: any) => {
  return {
    currentTask: state.taskIndexReducer.taskReducer.currentTask,
  };
};

export default connect(mapStateToProps, {})(LabelCreateEdit);
