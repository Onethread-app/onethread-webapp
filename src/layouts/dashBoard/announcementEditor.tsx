import React from 'react';
import { connect } from 'react-redux';
import { TextArea, Button } from '@blueprintjs/core';

interface AnnouncementEditorProps {
  setShowDialog: (val: boolean) => void;
}

const AnnouncementEditorComponent = (props: AnnouncementEditorProps) => {

  return (
    <>
      <div className="bg-white pa4">
        <h1 className="f5">Company Announcement</h1>
        <TextArea
          className="mt1"
          id="jobDescription"
          style={{
            resize: 'none',
            minHeight: '50px',
            maxHeight: '150px'
          }}
          fill={true}
          growVertically={true}
          value=""
          placeholder="Write Something ..."
        />
        <Button
          type="submit"
          onClick={async (e: any) => {
            e.preventDefault();
          }}
          className="w4 grow h2 pointer fr mv2"
          style={{ background: '#3F61C5', outline: 'none', color: 'white' }}
        >
          Post
            </Button>
      </div>
    </>
  );
};

const mapStateToProps = (state: any) => {
  return {
    user: state.userReducer.user
  };
};

export const AnnouncementEditor = connect(mapStateToProps)(AnnouncementEditorComponent);