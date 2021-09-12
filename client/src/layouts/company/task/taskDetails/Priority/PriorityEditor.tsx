import React, { useState } from 'react';
import { Form, Field } from 'react-final-form';
import { SubmitError } from 'components/final-form/SubmitError';
import { Icon, Button } from '@blueprintjs/core';
import { isEqual } from 'lodash';
import { IconNames } from '@blueprintjs/icons';
import { priorityColor } from 'stores/UtilsActions';
import { connect } from 'react-redux';
import { updateTask } from 'stores/task/Actions';
import { ITask } from 'stores/task/Reducer';
import { useTranslation } from 'react-i18next';

interface IPriorityEditorProps {
  setPriorityPopover: (val: boolean) => void;
  updateTask: (task: ITask) => any;
  colorCode: Number;
  updatingTask: boolean;
}

export const PriorityEditorComponent = (
  props: IPriorityEditorProps,
) => {
  const onSubmit = async (values: any) => {
    const response = await props.updateTask(values);
    if (response && !props.updatingTask) {
      props.setPriorityPopover(false);
    }
  };

  const [labelColor, setLabelColor] = useState(props.colorCode);

  const { t } = useTranslation();

  return (
    <div>
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
          <form onSubmit={handleSubmit}>
            <div className="flex justify-end">
              <Icon
                icon={IconNames.CROSS}
                iconSize={20}
                className="grow pointer"
                onClick={(e: any) => props.setPriorityPopover(false)}
              />
            </div>
            <div>
              <SubmitError errorMessage={submitError} />
            </div>
            <div className="ph2 pt2 w-100">
              <Field<string>
                name="priority"
                render={({ input, meta }) => (
                  <div className="mb3">
                    <h3 className="f5 mt0">
                      {t(
                        'app.project.Project-boards.Choose-Priority',
                      )}
                    </h3>
                    {/* <h3 className="f5 mt0">Choose Priority</h3> */}
                    <div className="mt4">
                      {priorityColor.map((color) => (
                        <div className="pr2" key={color.code}>
                          <div
                            className="flex mv2 pointer"
                            onClick={(e) => {
                              e.preventDefault();
                              input.onChange(color.code);
                              setLabelColor(color.code);
                            }}
                          >
                            <div
                              className="br-100"
                              style={{
                                height: '25px',
                                width: '25px',
                                background: color.value,
                              }}
                            >
                              {' '}
                            </div>
                            <div
                              className="flex pl3 w-80 justify-between ml3"
                              style={{ background: color.container }}
                            >
                              <div className="pt1">{color.name}</div>
                              <div>
                                <Icon
                                  className="br2 pt1 pr1"
                                  style={{
                                    color: isEqual(
                                      color.code,
                                      labelColor,
                                    )
                                      ? '#53A634'
                                      : '',
                                  }}
                                  icon={
                                    isEqual(
                                      color.code,
                                      labelColor,
                                    ) === true
                                      ? 'tick'
                                      : 'blank'
                                  }
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
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
                  Submit
                </Button>
              </div>
            </div>
          </form>
        )}
      />
    </div>
  );
};

const mapStateToProps = (state: any) => {
  return {
    colorCode:
      state.taskIndexReducer.taskReducer.currentTask.priority,
    updatingTask: state.taskIndexReducer.taskReducer.updatingTask,
  };
};

export const PriorityEditor = connect(mapStateToProps, {
  updateTask,
})(PriorityEditorComponent);
