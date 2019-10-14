import React, { useState } from 'react';
import { ListTitleView } from '../../../ListTitleView';
import { Dialog} from '@blueprintjs/core';
import { SectionViewWithTitleAndDesciption } from '../../../ListItemView';
import { connect } from 'react-redux';

const ProductDetailsViewComponent = (props: any) => {
  const [showDialog, setShowDialog] = useState(false)
  return (
    <>
      <div className="br3 bg-white h-auto pa4 mt3 cf">
        <ListTitleView
          listTitle="Product Details"
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
          listTitle="Product Type"
          listDescription={props.company.address}
        />
        <SectionViewWithTitleAndDesciption
          listTitle="Product Sub Categories"
          listDescription={props.company.email}
        />

        <SectionViewWithTitleAndDesciption
          listTitle="Product Name"
          listDescription={props.company.legalOwnerName}
        />
      </div>
    </>
  )
}

const mapStateToProps = (state: any) => {
  return {
    company: state.companyReducer.currentCompany
  }
}

export const ProductDetailsView = connect(mapStateToProps)(ProductDetailsViewComponent)