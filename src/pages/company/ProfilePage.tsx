import React from 'react';
import { Tab, Tabs } from "@blueprintjs/core";
import { InfoDetailsView } from 'components/company/profile/view/InfoDetailsView';
// import { ProductDetailsView } from 'components/company/profile/view/ProductDetailsView';

export const CompanyProfilePage = () => (
  <div className="w-100">
    <h1 className="f4 lh-title tigrow-lightGray-1 ml4-ns ml2 mb0">Company Profile</h1>
    <Tabs
      id="TabsExample"
      className="ml4-ns ml3 mt4 mr2"
    >
      <Tab
        id="company_details"
        title="Company Details"
        panel={<InfoDetailsView />}
        className="outline-0"
      />
      {/* Todo */}
      {/* <Tab
        id="product_details"
        title="Product Details"
        panel={<ProductDetailsView />}
        className="outline-0"
      /> */}
    </Tabs>
  </div>
);
