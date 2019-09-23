import * as React from 'react';
import { NavbarTop } from 'components/Navbar';
import { Sidebar } from 'components/Sidebar';
import { Icon, Divider, Dialog, Button, Intent, Tag } from '@blueprintjs/core';
import skill from '../resources/images/skills.png';
import user from '../resources/images/user.png';
import { SuggestField, ItemEntityProps } from 'components/common/SuggestField';
import { BasicInfoList } from 'components/company/BasicInfoList';
import { EduInfoList } from 'components/company/EduInfoList';
import { useState } from 'react';

const skills = [
  { id: '1', name: 'Programing C' },
  { id: '2', name: 'Java' },
  { id: '3', name: 'Dotnet' },
  { id: '4', name: 'Javascript' },
  { id: '5', name: 'React' },
]

export const LandingPage = () => {

  const [showDialog, setShowDialog] = useState(false);
  // Should comes from redux store
  const [selectedItems, setSelectedItems] = useState([] as ItemEntityProps[]);

  return (
    <>
      <div className="bg-near-white ">
        <NavbarTop />
        <div className="w-100 cf ">
          <div className="fl bg-white w-10 pv6 vh-100 fixed">
            <Sidebar />
          </div>
          <div className="fl w-80 mt6 ml7">
            <div className="cf">
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
                  <BasicInfoList />
                  <EduInfoList />
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
