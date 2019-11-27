import React, { useState } from 'react';
import { Dialog, EditableText, Divider, Button, Icon, Spinner } from '@blueprintjs/core';
import { connect } from 'react-redux';
import { ListTitleView } from '../../../ListTitleView';
import { SectionViewWithTitleAndDesciption } from '../../../ListItemView';
import user from '../../../../resources/images/user.png';
import { CompanyInfoForm } from '../editor/CompanyInfoDetailsForm';
import { editCompanyAboutAction, companyLogoUploadAction } from 'stores/company/Actions';
import { CompanyModel } from 'stores/company/Reducer';
import { permit } from 'stores/UtilsActions';
import { isEmpty } from 'lodash';

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
        <pre className="ws-break" style={{whiteSpace: 'pre-line'}}>{props.company.about}</pre>
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
  const [showDialogPicture, setShowDialogPicture] = useState(false);
  const [imageSelected, setImageSelected] = useState({}) as any;
  const [imageName, setImageName] = useState({}) as any;
  const [logoLoading, setLogoLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  const imageChangeHandler = (event: any) => {
    if (event.target.files) {
      if (event.target.files[0]) {
        if (event.target.files[0].size / 1024 / 1024 > 1) {
          setImageName("");
          setImageError(true);
          return false;
        } else {
          const data = new FormData();
          data.append('file', event.target.files[0], event.target.files[0].name);
          setImageName(event.target.files[0]);
          setImageSelected(data);
          setImageError(false);
          return data;
        }
      }
    }
    return false
  }
  return (
    <>
      <div>
        <div className="fl-l flex-m w-25-l w-100-m ph3">
          <div className="h-auto br3 ma3 pa3 bg-white cf tc shadow-4 w-50-m">
            <div className="cf flex relative center" style={{ width: '112px' }}>
              <img className="db br-100 ba b--black-10" style={{ width: '112px', height: '112px' }} src={props.company.logo ? props.company.logo.imageSource : user} />
              {permit(props.company.role) ?
                <div className="absolute bg-tigrowLightBlue br-100 pointer"
                  onClick={() => setShowDialogPicture(true)}
                  style={{ top: '4.5rem', right: '3px', width: '33px', height: '33px', paddingTop: '7px' }}
                >
                  <Icon className="white" icon="camera" iconSize={20} ></Icon>
                </div>
                : ""}
            </div>
            <h1 className="f5 lh-copy tigrow-lightGray-1 ws-break">{props.company.name}</h1>
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

      {showDialogPicture && (
        <Dialog
          icon="briefcase"
          onClose={() => setShowDialogPicture(!showDialogPicture)}
          isOpen
          style={{ background: '#fff' }}
          canOutsideClickClose={false}
        >
          <div className="pa3 cf">
            <h1 className="f5 tigrow-lightBlue">Upload Photo</h1>
            <label className="bp3-file-input .modifier bp3-fill">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => imageChangeHandler(e)}
              />
              <span className="bp3-file-upload-input">
                {imageName.name ? imageName.name : <p>choose your file...</p>}
              </span>
            </label>
            {imageError &&
              <small style={{ color: 'red' }}>Image size can't be greater than 1 MB</small>}
            <div className="flex justify-end mt3">
              <Button className="w4 grow h2 pointer mr3"
                style={{ background: "#fff", outline: "none", border: "1px solid #0fa3a3", color: "#0fa3a3" }}
                onClick={(e: any) => {
                  e.preventDefault();
                  setShowDialogPicture(false);
                  setImageName({});
                  setLogoLoading(false);
                  setImageError(false);
                }}
              >
                cancel
              </Button>
              <Button
                type="submit"
                className="w4 grow h2 pointer"
                style={imageName && isEmpty(imageName.name) === false ?
                  {
                    background: "#0fa3a3",
                    outline: "none",
                    color: 'white'
                  } : {
                    background: '#011b1b2e',
                    outline: "none",
                    color: 'white'
                  }
                }
                onClick={async (e: any) => {
                  e.preventDefault();
                  setLogoLoading(true);
                  const response = await props.companyLogoUploadAction(imageSelected);
                  if (response) {
                    setShowDialogPicture(false);
                    setImageName({});
                  }
                  setLogoLoading(false);
                }}
                disabled={logoLoading === true || isEmpty(imageName.name) ? true : false}
              >
                {logoLoading ? <Spinner size={15} /> : 'Save'}
              </Button>
            </div>
          </div>
        </Dialog>
      )}
    </>

  )
}

const mapStateToProps = (state: any) => {
  return {
    company: state.companyReducer.currentCompany,
  }
}

export const InfoDetailsView = connect(mapStateToProps, { companyLogoUploadAction })(InfoDetailsViewComponent)