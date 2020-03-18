import React from 'react';
import { BasicInfoDetailsView } from 'layouts/company/profile/BasicInformationView';
import { CompanyCoverPhoto } from './CompanyCoverPhoto';
import { Tabs, Tab } from '@blueprintjs/core';
import { AdvancedInfo } from './AdvancedInfoView';

export const CompanyProfilePage = () => (
  <div className='w-100 pa4'>
    <CompanyCoverPhoto />
    <Tabs id='TabsExample' className='mt7 ph5'>
      <Tab
        id='basic_info'
        title='Basic Information'
        panel={<BasicInfoDetailsView />}
        className='outline-0'
      />
      <Tab
        id='advance_info'
        title='Advanced Information'
        panel={<AdvancedInfo />}
        className='outline-0'
      />
    </Tabs>
  </div>
);
