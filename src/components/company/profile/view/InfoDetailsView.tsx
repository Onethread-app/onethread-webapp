import React, { useState } from 'react';
import { Dialog, EditableText, Divider, Button, Icon } from '@blueprintjs/core';
import { connect } from 'react-redux';
import { ListTitleView } from '../../../ListTitleView';
import { SectionViewWithTitleAndDesciption } from '../../../ListItemView';
import user from '../../../../resources/images/user.png';
import { CompanyInfoForm } from '../editor/CompanyInfoDetailsForm';
import { editCompanyAboutAction } from 'stores/company/Actions';
import { CompanyModel } from 'stores/company/Reducer';
import { permit } from 'stores/UtilsActions';

interface CompanyAboutEditComponentProps {
  setShowDialog: (val: boolean) => void;
  company: CompanyModel
}
interface CompanyAboutEditInternalProps extends CompanyAboutEditComponentProps {
  editInfoAction: (val: string) => void
}

const AboutCompanyEditComponent = (props: CompanyAboutEditInternalProps) => {
  const [aboutInfo, setAboutInfo] = useState(props.company.about);
  return (
    <form className="fl w-100 pa4">
      <h1 className="f5 lh-copy dib tigrow-lightGray-1">About</h1>
      <EditableText
        className="mb4"
        multiline={true}
        minLines={3}
        maxLines={20}
        value={aboutInfo}
        onChange={(e) => setAboutInfo(e)}
      />
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
const AboutCompanyEdit = connect(null, { editInfoAction: editCompanyAboutAction })(AboutCompanyEditComponent)

export const AboutCompanyView = (props: {
  company: CompanyModel
}) => {
  const [showDialogAbout, setShowDialogAbout] = useState(false);
  return (
    <>
      <div className="h-auto br3 ma3 pa3 bg-white cf shadow-4 w-50-m">
        <div className="cf ">
          <h1 className="f5 lh-copy dib tigrow-lightGray-1">About</h1>
          {permit(props.company.role) ?
            <Icon className="fr mv3 tigrow-lightBlue pointer"
              icon="edit"
              onClick={() => setShowDialogAbout(true)}
            /> : ""}
        </div>
        <p style={{wordBreak: 'break-word'}} >{props.company.about}</p>
      </div>
      {showDialogAbout && (
        <Dialog
          icon="briefcase"
          onClose={() => setShowDialogAbout(!showDialogAbout)}
          isOpen
          style={{ background: '#fff' }}
        >
          <div>
            <AboutCompanyEdit company={props.company} setShowDialog={setShowDialogAbout} />
          </div>
        </Dialog>
      )}
    </>
  )
}


const InfoDetailsViewComponent = (props: any) => {
  const [showDialog, setShowDialog] = useState(false)
  return (
    <>
      <div>
        <div className="fl-l flex-m w-25-l w-100-m ph3">
          <div className="h-auto br3 ma3 pa3 bg-white cf tc shadow-4 w-50-m">
            <img src={user}></img>
            <h1 className="f5 lh-copy tigrow-lightGray-1">{props.company.name}</h1>
            <p className=" light-silver" >{props.company.type}</p>
          </div>
          <AboutCompanyView company={props.company} />
        </div>
        <div className="fl-l mh4-m w-70-l w-90-m ">
          <div className="br3 bg-white h-auto pa4 mt3-l mt2-m shadow-4">
            <ListTitleView
              listTitle="Basic Information"
              iconType={permit(props.company.role) ? "edit" : ""}
              onClick={() => setShowDialog(true)}
            />
            {showDialog && (
              <Dialog
                onClose={() => setShowDialog(!showDialog)}
                isOpen
                style={{ background: '#fff' }}
              >
                <div>
                  <CompanyInfoForm setShowDialog={setShowDialog} />
                </div>
              </Dialog>
            )}
            <SectionViewWithTitleAndDesciption
              listTitle="Company Address"
              listDescription={props.company.address}
            />
            <SectionViewWithTitleAndDesciption
              listTitle="Company Mail Address"
              listDescription={props.company.email}
            />

            <SectionViewWithTitleAndDesciption
              listTitle="Legal Owner"
              listDescription={props.company.legalOwnerName}
            />
            <SectionViewWithTitleAndDesciption
              listTitle="Legal owner Mail address"
              listDescription={props.company.legalOwnerMail}
            />
          </div>
        </div>
      </div>
    </>

  )
}

const mapStateToProps = (state: any) => {
  return {
    company: state.companyReducer.currentCompany
  }
}

export const InfoDetailsView = connect(mapStateToProps)(InfoDetailsViewComponent)