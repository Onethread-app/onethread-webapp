import React from 'react';
import { connect } from 'react-redux';

import { BreadCrumbs } from 'components/fields/Breadcrumbs';
import { SubTaskView } from './subTask/SubtaskView';
import { ActivityView } from './activity/ActivityView';
import { ITask, TaskBoard } from 'stores/board/Reducer';
import { ICompany } from 'stores/company/Reducer';
import { TaskDetails } from './taskDetails';
import { IProject } from 'stores/project/Reducer';

interface TaskInternalProps {
    currentTask: ITask;
    currentBoard?: TaskBoard;
    company: ICompany;
    currentProject?: IProject;
}

const TaskPageComponent = (props: TaskInternalProps) => {
    return ( 
        <div className="cf ph3">
            <BreadCrumbs
                items={[
                    { text: `Board`,
                     href: `/company/${props.company.name}/project/${props.currentProject!._id}/board`
                     },
                    { text: `${props.currentBoard!.name}`,
                     href: `/company/${props.company.name}/board/${props.currentBoard!._id}` 
                    },
                    {
                        text: `${props.currentTask!.name}`,
                        href: `/company/${props.company.name}/board/${props.currentBoard!._id}/task/${props.currentTask._id}`
                    }
                ]}
            />
            <div className="cf flex h-100 flex-column flex-row-l">
                <div className="w-100 w-50-l pa2">
                    {/* <h1 className="fw6 lh-title black">{props.currentTask.name}</h1> */}
                    <TaskDetails />
                    <SubTaskView />
                </div>
                <div className="w-100 w-50-l ph2" style={{
                    height: 'calc(100vh - 100px)'}}>
                    <ActivityView />
                </div>
            </div>
        </div>
    );
};

const mapStateToProps = (state: any) => {
    return {
        currentTask: state.boardIndexReducer.boardReducer.currentTask,
        currentBoard: state.boardIndexReducer.boardReducer.currentBoard,
        company: state.companyReducer.currentCompany,
        currentProject: state.projectReducer.projectDetails,
        
    };
};

export const TaskPage = connect(mapStateToProps, null)(TaskPageComponent);
