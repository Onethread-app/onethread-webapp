import React, { useState } from 'react';
import { connect } from 'react-redux';
import { TextArea, Button } from '@blueprintjs/core';
import { ICompany } from 'stores/company/Reducer';
import { addAnnouncement } from 'stores/company/Actions';
import { isEmpty } from 'lodash';

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
        <div className="flex justify-end mv2">
          <Button className="w4 grow h2 pointer mr3"
            style={{ background: "#fff", outline: "none", border: "1px solid #0fa3a3", color: "#0fa3a3" }}
            onClick={(e: any) => {
              e.preventDefault();
              props.setShowDialog(false);
            }}
          >
            cancel
        </Button>
          <Button
            type="submit"
            onClick={async (e: any) => {
              e.preventDefault();
              if (!isEmpty(inputValues)) {
                await props.addAnnouncement(inputValues);
              }
              props.setShowDialog(false);
            }}
            className="w4 grow h2 pointer fr"
            style={{ background: '#3F61C5', outline: 'none', color: 'white' }}
          >
            Post
            </Button>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state: any) => {
  return {
    company: state.companyReducer.currentCompany
  };
};

export const AnnouncementEditor = connect(mapStateToProps, { addAnnouncement })(AnnouncementEditorComponent);