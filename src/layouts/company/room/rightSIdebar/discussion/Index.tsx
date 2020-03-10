import React from 'react';
import { connect } from 'react-redux';
import { IRoomReducer } from 'stores/room/Reducer';

interface DiscussionComponentProps {
    discussions?: IRoomReducer['discussions'];
}

const DiscussionComponent = (props: DiscussionComponentProps) => {

    return (
        <div
            className="flex flex-column pb2"
            style={{
                maxHeight: '50%'
            }}
        >
            <h3 className="mv2">Highlighted Discussions</h3>
            <div className="overflow-y-auto flex-grow-1 pr3">
                {props.discussions ?
                    props.discussions.map((d) => (
                        <p className="bg-black-10 br-pill pv1 ph2" key={d._id}>{d.text}</p>
                    )) :
                    <h4 className="mv0 gray">No files.</h4>
                }
            </div>
        </div>
    );
};

const mapStateToProps = (state: any) => {
    return {
        discussions: state.roomReducer.discussions,
    };
};

export const Discussion = connect(mapStateToProps, null)(DiscussionComponent);
