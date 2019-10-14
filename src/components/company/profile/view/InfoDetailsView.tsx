import React, { useState } from 'react';
import { Dialog } from '@blueprintjs/core';
import { connect } from 'react-redux';
import { ListTitleView } from '../../../ListTitleView';
import { SectionViewWithTitleAndDesciption } from '../../../ListItemView';
import user from '../../../../resources/images/user.png';

const InfoDetailsViewComponent = (props: any) => {
  const [showDialog, setShowDialog] = useState(false)
  return (
    <>
      <div>
        <div className="fl w-25-ns pa2 ">
          <div className="h-auto br3 ma2 pa3 bg-white cf tc">
            <img src={user}></img>
            <h1 className="f5 lh-copy tigrow-lightGray-1">Julian Martha</h1>
            <p className=" light-silver" >Software Developer</p>
          </div>
          <div className="h-auto br3 ma2 pa3 bg-white cf">
            <h1 className="f6 lh-copy tigrow-lightGray-1">About</h1>
            <p className="tigrow-lightGray-2">Lorem Ipsum is simply dummy text of the printing and typesetting industry.
               Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
                 when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
          </div>
        </div>
        <div className="fl w-75-ns">
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