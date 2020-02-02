import * as React from 'react';
import { CompanyModel } from 'stores/company/Reducer';
import { useState } from 'react';
import { EditableText, Divider, Button } from '@blueprintjs/core';
import { connect } from 'react-redux';
import { editCompanyAboutAction } from 'stores/company/Actions';

interface CompanyAboutEditComponentProps {
  setShowDialog: (val: boolean) => void;
  company: CompanyModel
}
interface CompanyAboutEditInternalProps extends CompanyAboutEditComponentProps {
  editInfoAction: (val: string) => void
}

const CompanyAboutEditorComponent = (props: CompanyAboutEditInternalProps) => {
  const [aboutInfo, setAboutInfo] = useState(props.company.about);
  const [aboutInfoError, setAboutInfoError] = useState('');

  return (
    <form className="fl w-100 pa4">
      <h1 className="f5 lh-copy dib tigrow-lightGray-1">About</h1>
      <EditableText
        className="mb4"
        multiline={true}
        minLines={3}
        maxLines={20}
        value={aboutInfo}
        onChange={(e) => {
          setAboutInfo(e);
          if (aboutInfo && aboutInfo.length > 2000) {
            setAboutInfoError('About must be less than or equal 2000 character.');
          } else {
            setAboutInfoError('');
          }
        }}
      />
      {aboutInfoError ? <small style={{ color: 'red' }}>{aboutInfoError}</small> : ''}
      <Divider />
      <div className="flex justify-end mt3">
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
          className="w4 grow h2 pointer"
          style={{ background: "#0fa3a3", outline: "none", color: 'white' }}
          onClick={(e: any) => {
            e.preventDefault();
            props.editInfoAction(aboutInfo);
            props.setShowDialog(false);
          }}
        >
          Save
        </Button>
      </div>
    </form>
  )
}
export const CompanyAboutEditor = connect(null, { editInfoAction: editCompanyAboutAction })(CompanyAboutEditorComponent)