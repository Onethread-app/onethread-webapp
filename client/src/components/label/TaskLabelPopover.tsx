import {
  AllLabelContainer,
  CancelLabelButton,
  CreateLabelButton,
  HiddenCheckbox,
  Label,
  LabelContainer,
  LabelPopoverContainer,
  LabelPopoverHeader,
  StyledSearchInput,
} from './TaskLabel.styles';

import LabelCreateEdit from './LabelCreateEdit';

import { useState } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress/CircularProgress';
import { Classes } from '@blueprintjs/core';

interface TaskLabelPopoverProps {
  suggestedLabels: any;
  suggestLabels: (keyword: any) => Promise<void>;
  selectLabelFromSuggestion: (labelId: any) => Promise<void>;
  createLabel: (body: any) => Promise<void>;
  allLabels: any;
  closePopover: () => void;
}

const TaskLabelPopover = (props: TaskLabelPopoverProps) => {
  const [view, setView] = useState<'default' | 'createedit'>(
    'default',
  );
  const [editLabel, setEditLabel] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [keyword, setKeyword] = useState('');

  const handleSearch = async (e) => {
    setIsLoading(true);
    const keyword = e.target.value;
    setKeyword(keyword);
    if (typeof keyword === 'string' && keyword.length > 2) {
      await props.suggestLabels(keyword);
    }
    setIsLoading(false);
  };

  const labelOnClick = async (label) => {
    await props.selectLabelFromSuggestion(label._id);
  };

  //  const handleEditLabel = (label) => {
  //    setEditLabel(label);
  //    setView('createedit');
  //  };

  const handleCreateLabel = () => {
    setView('createedit');
  };

  const checkSelected = (label) => {
    return props.allLabels.find((l) => l.labelId === label._id)
      ? true
      : false;
  };

  return (
    <LabelPopoverContainer>
      {view === 'default' ? (
        <>
          <LabelPopoverHeader>Labels</LabelPopoverHeader>
          <StyledSearchInput
            placeholder="Search label"
            // onFocus={(e) => e.target.placeholder = "Type at least 3 character"}
            onChange={handleSearch}
          />
          <AllLabelContainer>
            <>
              {isLoading ? (
                <div
                  style={{ textAlign: 'center', paddingBottom: 8 }}
                >
                  <CircularProgress />
                </div>
              ) : (
                <>
                  {keyword.length > 2 &&
                    props.suggestedLabels.map((label) => (
                      <LabelContainer
                        key={label._id}
                        label={`Toggle Select`}
                      >
                        <Label color={label.color}>
                          <HiddenCheckbox
                            type="checkbox"
                            id={`${label._id}`}
                            onChange={() => labelOnClick(label)}
                            checked={checkSelected(label)}
                          />
                          <label htmlFor={`${label._id}`}>
                            {label.name}
                          </label>
                        </Label>
                      </LabelContainer>
                    ))}

                  {keyword.length > 2 &&
                    props.suggestedLabels.length === 0 && (
                      <div
                        style={{
                          textAlign: 'center',
                          paddingTop: 5,
                        }}
                      >
                        <p> No label found</p>
                      </div>
                    )}
                </>
              )}
            </>
          </AllLabelContainer>
          <div style={{ display: 'flex' }}>
            <CreateLabelButton onClick={handleCreateLabel}>
              Create New Label
            </CreateLabelButton>

            <CancelLabelButton className={Classes.POPOVER_DISMISS}>
              Cancel
            </CancelLabelButton>
          </div>
        </>
      ) : (
        <LabelCreateEdit
          setView={setView}
          label={editLabel}
          setEditLabel={setEditLabel}
          createLabel={props.createLabel}
          closePopover={props.closePopover}
        />
      )}
    </LabelPopoverContainer>
  );
};

export default TaskLabelPopover;
