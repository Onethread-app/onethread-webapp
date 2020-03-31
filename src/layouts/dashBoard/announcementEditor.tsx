import React, { useState } from 'react';
import { connect } from 'react-redux';
import { TextArea, Button } from '@blueprintjs/core';
import { ICompany } from 'stores/company/Reducer';
import { addAnnouncement } from 'stores/company/Actions';

interface AnnouncementEditorProps {
  setShowDialog: (val: boolean) => void;
  company: ICompany;
  addAnnouncement: (val: any) => void;
}

const AnnouncementEditorComponent = (props: AnnouncementEditorProps) => {

  const [inputValues, setInputValues] = useState('');

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
          value={inputValues}
          placeholder="Write Something ..."
          onChange={(event) => {
            setInputValues(event.target.value);
          }
          }
        />
        <Button
          type="submit"
          onClick={async (e: any) => {
            e.preventDefault();
            await props.addAnnouncement(inputValues);
            props.setShowDialog(false);
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
    company: state.companyReducer.currentCompany
  };
};

export const AnnouncementEditor = connect(mapStateToProps, {addAnnouncement})(AnnouncementEditorComponent);