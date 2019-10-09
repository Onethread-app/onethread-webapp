import * as React from 'react';
import { Icon, Divider, Dialog, Button, Intent, Tag } from '@blueprintjs/core';
import skill from '../resources/images/skills.png';
import user from '../resources/images/user.png';
import { connect } from 'react-redux';
import { SuggestField, ItemEntityProps } from 'components/common/field/SuggestField';
import { useState } from 'react';
import { ListTitleView } from 'components/ListTitleView';
import { SectionViewWithTitleAndDesciption } from 'components/ListItemView';
import { BasicInfoForm } from 'components/company/profile/editor/BasicInfoDetailsForm';
import { User } from 'stores/user/Reducer';

const skills = [
  { id: '1', name: 'Programing C' },
  { id: '2', name: 'Java' },
  { id: '3', name: 'Dotnet' },
  { id: '4', name: 'Javascript' },
  { id: '5', name: 'React' },
]

const EducationInfoDetailsView = () => {
  return (
    <div className="br3 bg-white h-auto pa4 mt3">
      <ListTitleView
        listTitle="Educational Information"
        iconType="edit"
        onClick={() => { return true }}
      />
      <SectionViewWithTitleAndDesciption
        listTitle="School"
        listDescription="Julian Martha"
      />
      <SectionViewWithTitleAndDesciption
        listTitle="College"
        listDescription="No secondary email has set"
      />
      <SectionViewWithTitleAndDesciption
        listTitle="University"
        listDescription="A+"
      />
    </div>
  )
}

const BasicInfoDetailsView = (props: {
  user: User
}) => {
  const [showDialog, setShowDialog] = useState(false)
  return (
    <>
      <div className="br3 bg-white h-auto pa4 mt3">
        <ListTitleView
          listTitle="Basic Information"
          iconType="edit"
          onClick={() => setShowDialog(true)}
        />
        {showDialog && (
          <Dialog
            icon="briefcase"
            onClose={() => setShowDialog(!showDialog)}
            title="Company Sign Up"
            isOpen
            style={{ background: '#fff' }}
          >
            <div>
              <BasicInfoForm />
            </div>
          </Dialog>
        )}
        <SectionViewWithTitleAndDesciption
          listTitle="Email"
          listDescription={props.user.email}
        />
        {/* <SectionViewWithTitleAndDesciption
          listTitle="Secondary Email"
          listDescription={props.user.secondaryEmail}
        /> */}
        <SectionViewWithTitleAndDesciption
          listTitle="Contact Number"
          listDescription={props.user.contactNo}
        />
        {/* <SectionViewWithTitleAndDesciption
          listTitle="Address"
          listDescription={props.user.address}
        /> */}
        <SectionViewWithTitleAndDesciption
          listTitle="Gender"
          listDescription="Male"
        />
        <SectionViewWithTitleAndDesciption
          listTitle="Birthdate"
          listDescription="13th September, 2019"
        />
        {/* <SectionViewWithTitleAndDesciption
          listTitle="Blood Group"
          listDescription={props.user.bloodGroup}
        /> */}
      </div>
    </>

  )
}

interface LandingPageProps {
  user: User,
}

export const LandingPageComponent = (props: LandingPageProps) => {

  const [showDialog, setShowDialog] = useState(false);
  // TODO Should comes from redux store
  const [selectedItems, setSelectedItems] = useState([] as ItemEntityProps[]);

  return (
    <>
      <div className="cf w-100">
        <h1 className="f5 lh-title tigrow-lightGray-1 ml3 tigrow-lightGray-1 mb0">Profile</h1>
        <div>
          <div className="fl w-25-ns pa2 ">
            <div className="h-auto br3 ma2 pa3 bg-white cf tc">
              <img src={user}></img>
              <h1 className="f6 lh-copy tigrow-lightGray-1">Julian Martha</h1>
              <p className="tigrow-lightGray-1">Software Developer</p>
            </div>
            <div className="h-auto br3 ma2 pa3 bg-white cf">
              <h1 className="f6 lh-copy tigrow-lightGray-1">About</h1>
              <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                 Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
                 when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
            </div>
            <div className="h-auto br3 ma2 pa3 bg-white cf">
              <h1 className="f6 lh-copy">Skills</h1>
              <div className="tc">
                <img src={skill}></img>
                <p>No skill has selected</p>
                <button
                  className="br3 grow ph4 pointer pv2 f7 bg-white ba b--lightBlue tigrow-lightBlue outline-0"
                  onClick={() => setShowDialog(!showDialog)}
                >
                  Add Skills
                </button>
              </div>
            </div>
          </div>
          <div className="fl w-75-ns">
            <BasicInfoDetailsView user={props.user} />
            <EducationInfoDetailsView />
            <div className="br3 bg-white h-auto pa4 mt3">
              <div className="cf ">
                <h1 className="f5 lh-copy dib">Experience</h1>
                <Icon className="fr mv3 tigrow-lightBlue" icon="add" />
              </div>
              <Divider />
              <div className="br3 bg-white h-auto">
                <img src={skill}></img>
                <p>No experience has added</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showDialog && (
        <Dialog
          onClose={() => setShowDialog(!showDialog)}
          title="Add skills"
          isOpen={showDialog}
          style={{ background: '#fff' }}
          canOutsideClickClose={false}
        >
          <div className="bp3-card">
            <div className="fl w-100 pv2">
              <SuggestField
                items={skills}
                selectedItems={selectedItems}
                setSelectedItems={setSelectedItems}
              />
            </div>
            <div className="fl w-100 mb2">
              {selectedItems.map(item => (
                <Tag
                  key={item.id}
                  className="ma1 pa2"
                  interactive={true}
                  onRemove={e => {
                    const filteredItems = selectedItems.filter(selectedItem => (
                      item.name !== selectedItem.name
                    ));
                    setSelectedItems([
                      ...filteredItems
                    ])
                  }}
                  large={true}
                >
                  {item.name}
                </Tag>
              ))}
            </div>
            <div className="fl w-100">
              <Button
                text="Save"
                intent={Intent.SUCCESS}
                fill={true}
              />
            </div>
          </div>
        </Dialog>
      )}
    </>
  )
}

const mapStateToProps = (state: any) => {
  return {
    user: state.userReducer.user,
  }
}

export const LandingPage = connect(mapStateToProps, null)(LandingPageComponent)