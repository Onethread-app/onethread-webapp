import React, { useState } from 'react';
import { Form, Field } from 'react-final-form';
import { SubmitError } from 'components/final-form/SubmitError';
import { Icon, Button } from '@blueprintjs/core';
import { isEqual } from 'lodash';
import { IconNames } from '@blueprintjs/icons';
import { priorityColor } from 'stores/UtilsActions';
import { connect } from 'react-redux';
import { updateTask } from 'stores/board/Actions';
import { ITask } from 'stores/board/Reducer';

interface IPriorityEditorProps {
    setPriorityPopover: (val: boolean) => void;
    updateTask: (task: ITask) => void;
}

export const PriorityEditorComponent = (props: IPriorityEditorProps) => {
    const onSubmit = async (values: any) => {
        await props.updateTask(values);
        await props.setPriorityPopover(false);
    }

    const [labelColor, setLabelColor] = useState(null as any);

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
                        <form
                            onSubmit={handleSubmit}
                        >
                            <SubmitError errorMessage={submitError} />
                            <div className="flex justify-end">
                                <Icon
                                    icon={IconNames.CROSS}
                                    iconSize={20}
                                    className="grow pointer"
                                    onClick={(e: any) => props.setPriorityPopover(false)}
                                />
                            </div>
                            <div className="ph2 pt2 w-100">
                                <Field<string>
                                    name="priority"
                                    render={({ input, meta }) =>
                                        <div className="mb3">
                                            <h3 className="f5 mt0">Choose Priority</h3>
                                            <div className="mt4">
                                                {priorityColor.map((color) => (
                                                    <div className="pr2" key={color.code}>
                                                        <div className="flex mv2 pointer"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                input.onChange(color.code);
                                                                setLabelColor(color.code);
                                                            }}
                                                        >
                                                            <div
                                                                className="br-100"
                                                                style={{
                                                                    height: '25px', width: '25px',
                                                                    background: color.value
                                                                }}
                                                            > </div>
                                                            <div
                                                                className="flex pl3 w-80 justify-between ml3"
                                                                style={{ background: color.container }}
                                                            >
                                                                <div className="pt1">
                                                                    {color.name}
                                                                </div>
                                                                <div>
                                                                    <Icon
                                                                        className="br2 pt1"
                                                                        style={{
                                                                            color: isEqual(color.code, labelColor) ?
                                                                                '#53A634' : ''
                                                                        }}
                                                                        icon={isEqual(color.code, labelColor) === true ? 'tick' : 'blank'}

                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>

                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    }
                                />
                                <div className="fr">
                                    <Button
                                        className="grow pointer white bp3-minimal w4 mt2"
                                        style={{
                                            background: '#0FA3A3',
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
}


export const PriorityEditor = connect(null, { updateTask })(PriorityEditorComponent);
