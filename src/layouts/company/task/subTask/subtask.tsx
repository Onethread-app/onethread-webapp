import React from 'react';
import { ProgressBar, Checkbox, TextArea, Button } from '@blueprintjs/core';

export const SubTask = () => {
    return (
        <div className="fl w-100">
            <div className="mt3">
                <div className="flex">
                    <h1 className="f6 flex-auto">SubTask</h1>
                    <h1 className="f6 blue">33%</h1>
                </div>
                <ProgressBar
                    stripes={false}
                    intent="primary"
                    value={.5}
                />
                <div className="mt3 mb3">
                    <Checkbox
                        label="Long established fact that a reader will be distracted when looking at its layout."
                    />
                    <Checkbox
                        label="Long established fact that a reader will be distracted when looking at its layout."
                    />
                </div>
                <TextArea
                    className="w-100 h-auto"
                    style={{ resize: 'none' }}
                    growVertically={true}
                    placeholder="add a subtask"
                />
                <div className="mt3">
                    <Button
                        type="submit"
                        text="Add SubTask"
                        className="grow h2 pointer dib"
                        style={{ background: '#0fa3a3', outline: 'none', color: 'white', borderRadius: '0px', boxShadow: 'none' }}
                    />
                    <h1 className="f6 blue fr dim pointer">Cancel</h1>
                </div>
            </div>
        </div>
    );
}
