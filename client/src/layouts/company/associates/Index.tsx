import React from 'react';
import { Tabs, Tab } from '@blueprintjs/core';
import { AssociateList } from './AssociateList';
import { PendingAssociateList } from './PendingAssociateList';
<<<<<<< HEAD
<<<<<<< HEAD
import { connect } from 'react-redux';
import { User } from 'stores/user/Reducer';
import { NavbarCompany } from 'components/NavbarCompany';
=======
import user from './../../../resources/images/profilePhoto.svg';
import { connect } from 'react-redux';
import { User } from 'stores/user/Reducer';
import { MobileView } from 'react-device-detect';
import { MobileListView } from '../MobileListView';
>>>>>>> b9e80fb9... mobile responsive for project preface
=======
import { connect } from 'react-redux';
import { User } from 'stores/user/Reducer';
import { NavbarCompany } from 'components/NavbarCompany';
>>>>>>> a51ad486... Feature/mobile responsive (#148)

interface AssociatesPageProps {
  user: User;
}

const AssociatesPageComponent = (props: AssociatesPageProps) => {
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
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
=======

=======
>>>>>>> d06346b0... code style issue fixed
  const [showDialog, setShowDialog] = useState(false);
=======
>>>>>>> a51ad486... Feature/mobile responsive (#148)

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
<<<<<<< HEAD
        </Navbar>
      </MobileView>
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
      {showDialog && (
        <Drawer
          onClose={() => setShowDialog(!showDialog)}
          isOpen={showDialog}
          canOutsideClickClose={false}
          style={{ width: '70%' }}
        >
          <div>
            <MobileListView
              showDialog={showDialog}
              setShowDialog={setShowDialog}
            />
          </div>
        </Drawer>
      )}
    </div>
>>>>>>> b9e80fb9... mobile responsive for project preface
=======
          <Tab
            id="pending_associates"
            title="Pending Associates"
            panel={<PendingAssociateList />}
            className="outline-0"
          />
        </Tabs>
      </div>
    </>
>>>>>>> a51ad486... Feature/mobile responsive (#148)
  );
};

const mapStateToProps = (state: any) => {
  return {
<<<<<<< HEAD
<<<<<<< HEAD
    user: state.userReducer.user,
  };
};

export const AssociatesPage = connect(
  mapStateToProps,
  null,
)(AssociatesPageComponent);
=======
    user: state.userReducer.user
  };
};

export const AssociatesPage = connect(mapStateToProps, null)(AssociatesPageComponent);
>>>>>>> b9e80fb9... mobile responsive for project preface
=======
    user: state.userReducer.user,
  };
};

export const AssociatesPage = connect(
  mapStateToProps,
  null,
)(AssociatesPageComponent);
>>>>>>> d06346b0... code style issue fixed
