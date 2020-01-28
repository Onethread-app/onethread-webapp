import React from 'react';
import { ActivityEditor } from './ActivityEditor';

import userIcon from './../../../../resources/images/profilePhoto.svg';
import taskcreatActivity from './../../../../resources/images/TaskCreatedActivity.svg';
import prioritySetActivity from './../../../../resources/images/PrioritySetActivity.svg';

export const ActivityView = () => {
    return (
        <div className="fl w-100 overflow-y-auto min-h-100 ph2">
            <h1 className="f5 fw7 lh-title black ph4">Activity</h1>
            <div className="ph4 bl b--black-20 pt2">
                <article className="dt pb2 mt2 w-100">
                    <div className="dtc w2">
                        <img
                            src={userIcon}
                            className="ba b--black-10 db br-100 w2 h2" />
                    </div>
                    <div className="dtc v-mid pl3">
                        <h1 className="f6 fw6 lh-title black mv0">Md Saiful Islam </h1>
                        <h1 className="f7 fw6 lh-title silver mv1">UI/Ux Designer</h1>
                        <p
                            className="pa2 br3 mt2 ph4"
                            style={{
                                backgroundColor: '#F4FBFB'
                            }}
                        >
                            It is a long established fact that a reader will be distracted by the readable
                  </p>
                    </div>
                </article>
                <article className="dt pb2 mt2 w-100">
                    <div className="dtc w2">
                        <img
                            src={userIcon}
                            className="ba b--black-10 db br-100 w2 h2" />
                    </div>
                    <div className="dtc v-mid pl3">
                        <h1 className="f6 fw6 lh-title black mv0">Md Saiful Islam </h1>
                        <h1 className="f7 fw6 lh-title silver mv1">UI/Ux Designer</h1>
                        <p
                            className="pa2 br3 mt2 ph4"
                            style={{
                                backgroundColor: '#F4FBFB'
                            }}
                        >
                            It is a long established fact that a reader will be distracted by the readable
                  </p>
                    </div>
                </article>
                <article className="dt pb2 mt2 w-100">
                    <div className="dtc w2">
                        <div className="relative" style={{ width: '32px' }}>
                            <img
                                className="db br-100"
                                style={{ width: '32px', height: '32px' }}
                                src={userIcon}
                            />
                            <div className="absolute br-100"
                                style={{
                                    top: '1rem',
                                    left: '20px',
                                    width: '15px',
                                    height: '15px'
                                }}
                            >
                                <img
                                    src={taskcreatActivity} />
                            </div>
                        </div>
                    </div>
                    <div className="dtc v-mid pl3">
                        <p
                            className="pa2 br3 ph4"
                            style={{
                                backgroundColor: '#DEF2F2'
                            }}
                        >
                            Saif Islam has created the task.
                  </p>
                    </div>
                </article>
                <article className="dt pb2 mt2 w-100">
                    <div className="dtc w2">
                        <div className="relative" style={{ width: '32px' }}>
                            <img
                                className="db br-100"
                                style={{ width: '32px', height: '32px' }}
                                src={userIcon}
                            />
                            <div className="absolute br-100"
                                style={{
                                    top: '1rem',
                                    left: '20px',
                                    width: '15px',
                                    height: '15px'
                                }}
                            >
                                <img
                                    src={prioritySetActivity} />
                            </div>
                        </div>
                    </div>
                    <div className="dtc v-mid pl3">
                        <p
                            className="pa2 br3 ph4"
                            style={{
                                backgroundColor: '#DEF2F2'
                            }}
                        >
                            Saif Islam has set the priority of the task.
                  </p>
                    </div>
                </article>
                <div>
                    <p className="fw7 tc mt2 mb5 pointer"
                        style={{ color: '#0fa3a3' }}
                    >View Previous Activity</p>
                </div>
                <div className="pb2 mt2 w-50 flex fixed" style={{bottom: 0}}>
                    <div className="pt3">
                        <img
                            src={userIcon}
                            className="ba b--black-10 db br-100 w2 h2" />
                    </div>
                    <div className="w-90">
                        <ActivityEditor />
                    </div>
                </div>
            </div>
        </div>
    );
}
