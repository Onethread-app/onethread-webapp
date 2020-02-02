import React, { useState } from 'react';
import { ActivityEditor, CommentReply } from './ActivityEditor';

import userIcon from './../../../../resources/images/profilePhoto.svg';
import { Icon } from '@blueprintjs/core';
// import taskcreatActivity from './../../../../resources/images/TaskCreatedActivity.svg';
// import prioritySetActivity from './../../../../resources/images/PrioritySetActivity.svg';

export const ActivityView = () => {
    const [showReply, setShowReply] = useState(false)
    return (

        <div className="flex flex-column h-100 pl2">
            <div className="pl3">
                <h1 className="f5 fw7 lh-title black">Activity</h1>
            </div>
            <div className="flex flex-column flex-grow-1 overflow-y-auto pt2 bl b--tigrowLightGray-1 pl3">
                <div className="flex justify-between">
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
                                className="pa2 br3 mt2"
                                style={{
                                    backgroundColor: '#F4FBFB'
                                }}
                            >
                                It is a long established fact that a reader will be distracted by the readable
                                 by users in long term
                                </p>
                        </div>
                    </article>
                    <div>
                        <Icon className="fr mv3 tigrow-lightBlue pointer mr4"
                            icon="comment"
                            onClick={() => setShowReply(true)}
                        />
                    </div>
                </div>

                {showReply &&
                    <CommentReply
                        showReply={showReply}
                        setShowReply={e => setShowReply(!showReply)}
                    />
                }
            </div>
            {/* </div> */}
            <ActivityEditor />
        </div>
    );
}
