import React from 'react';
import { Divider } from '@blueprintjs/core';
import { ICompany } from 'stores/company/Reducer';

export const AssociateBasicInfoView = (props: {
  company: ICompany
}) => (
    <div className="bg-white br3 w-90">
      <div className="flex">
        <h1 className="f6 fw6 w-60">Company Name</h1>
        <h1 className="f6 fw6">{props.company.name}</h1>
      </div>
      <Divider />
      <div className="flex">
        <h1 className="f6 fw6 w-60">Company Type</h1>
        <h1 className="f6 fw6">{props.company.type}</h1>

      </div>
      <Divider />
      <div className="flex ">
        <h1 className="f6 fw6 w-60">Company Address</h1>
        <h1 className="f6 fw6">{props.company.address}</h1>

      </div>
      <Divider />
      <div className="flex">
        <h1 className="f6 fw6 w-60">Company Mail Address</h1>
        <h1 className="f6 fw6">{props.company.email}</h1>
      </div>
      <Divider />
      <div className="flex">
        <h1 className="f6 fw6 w-60">Legal Owner</h1>
        <h1 className="f6 fw6">{props.company.legalOwnerName}</h1>
      </div>
      <Divider />
      <div className="flex">
        <h1 className="f6 fw6 w-60">Legal Owner Mail Address</h1>
        <h1 className="f6 fw6">{props.company.legalOwnerMail}</h1>
      </div>
      <Divider />
    </div>
  );