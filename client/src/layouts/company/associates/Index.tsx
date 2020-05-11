import React from 'react';
import { Tabs, Tab } from '@blueprintjs/core';
import { AssociateList } from './AssociateList';
import { PendingAssociateList } from './PendingAssociateList';
import { connect } from 'react-redux';
import { User } from 'stores/user/Reducer';
import { NavbarCompany } from 'components/NavbarCompany';

interface AssociatesPageProps {
  user: User;
}

const AssociatesPageComponent = (props: AssociatesPageProps) => {

  return (
    <>
      <NavbarCompany title="My Associates" />
      <div className="ph4 w-100">
        <Tabs id="associatesTab" className="mt5 mt0-ns">
          <Tab
            id="associates"
            title="Associates"
            panel={<AssociateList />}
            className="outline-0"
          />
          <Tab
            id="pending_associates"
            title="Pending Associates"
            panel={<PendingAssociateList />}
            className="outline-0"
          />
        </Tabs>
      </div>
    </>
  );
};

const mapStateToProps = (state: any) => {
  return {
    user: state.userReducer.user,
  };
};

export const AssociatesPage = connect(
  mapStateToProps,
  null,
)(AssociatesPageComponent);
