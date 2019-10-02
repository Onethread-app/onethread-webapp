import React, { useState } from 'react';
import { Tab, Tabs } from "@blueprintjs/core";
import { InfoDetailsView } from 'components/company/profile/view/InfoDetailsView';
import { ProductDetailsView } from 'components/company/profile/view/ProductDetailsView';
import { CompanyTeamMembersView } from 'components/company/profile/view/TeamMembersView';

export const CompanyProfilePage = () => {
  const handleChange = (id: any) => {
    setsSelctedTab(id);
  }

  const [selectedTab, setsSelctedTab] = useState("company_details")
  return (
    <>
      <div className="cf w-100" style={{height:"calc(100vh - 52px)"}} >
        <h1 className="f4 lh-title tigrow-lightGray-1 ml4-ns ml2 mb0">Company Profile</h1>
        <Tabs
          id="TabsExample"
          onChange={(id) => handleChange(id)}
          selectedTabId={selectedTab}
          className="ml4-ns ml3 mt4 mr2"
        >
          <Tab
            id="company_details"
            title="Company Details"
            panel={<InfoDetailsView />}
            className="outline-0"
          />
          <Tab
            id="product_details"
            title="Product Details"
            panel={<ProductDetailsView/>} 
            className="outline-0"
             />
          <Tab 
            id="team_members"   
            title="Team Members" 
            panel={<CompanyTeamMembersView/> } 
            className="outline-0"
          />
        </Tabs>
      </div>
    </>
  )
}
