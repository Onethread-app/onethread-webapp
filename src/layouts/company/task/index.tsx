import React from 'react';
import { connect } from 'react-redux';

import { BreadCrumbs } from 'components/fields/Breadcrumbs';
import { SubTask } from './subTask/subtask';
import { Activity } from './activity/activity';
import { ITask, TaskBoard } from 'stores/board/Reducer';
import { CompanyModel } from 'stores/company/Reducer';
import { TaskDetails } from './taskDetails/taskdetails';

interface TaskInternalProps {
    currentTask: ITask;
    currentBoard?: TaskBoard;
    company: CompanyModel;
}

const TaskPageComponent = (props: TaskInternalProps) => {

    return (
        <div className="cf pa3">
            <BreadCrumbs
                items={[
                    { text: `Board`, href: `/company/${props.company.name}/board` },
                    { text: `${props.currentBoard!.name}`, href: `/company/${props.company.name}/board/${props.currentBoard!._id}` },
                    {
                        text: `${props.currentTask!.name}`,
                        href: `/company/${props.company.name}/board/${props.currentBoard!._id}/task/${props.currentTask._id}`
                    }
                ]}
            />
            <div className="cf">
                <div className="fl w-100 w-50-l pa2">
                    <h1 className="fw6 lh-title black">{props.currentTask.name}</h1>
                    <TaskDetails />
                    <SubTask />
                </div>
                <div className="fl w-100 w-50-l pa2">
                    <Activity />
                </div>
            </div>
        </div>
    );
};

const mapStateToProps = (state: any) => {
    return {
        currentTask: state.boardReducer.currentTask,
        currentBoard: state.boardReducer.currentBoard,
        company: state.companyReducer.currentCompany
    };
};

export const TaskPage = connect(mapStateToProps, null)(TaskPageComponent);
