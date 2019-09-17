import React, { useState } from 'react'
import { Alignment, Button, Popover, PopoverInteractionKind, Position, Navbar, Dialog } from '@blueprintjs/core';
import { CompanySignupForm } from './company/SignupForm';
import { connect } from 'react-redux';
import { logoutAction } from 'actions/AuthActions';
import { withRouter, RouteComponentProps } from 'react-router';
import { History } from 'history';

interface NavbarTopProps {
  logoutAction: (history: History) => void;
}

const NavbarTopComponent = (props: NavbarTopProps & RouteComponentProps) => {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <>
      <Navbar style={{position:'fixed'}} >
        <Navbar.Group align={Alignment.LEFT}>
          <Navbar.Heading>TiGrow</Navbar.Heading>
        </Navbar.Group>

        <Navbar.Group align={Alignment.RIGHT}>
          <Popover
            interactionKind={PopoverInteractionKind.CLICK}
            popoverClassName="bp3-popover-content-sizing"
            position={Position.BOTTOM}
          >
            <Button className="bp3-minimal">Company</Button>
            <div>
              <h5>Company List</h5>
              <p>Currently you have no company</p>
              <Button onClick={() => setShowDialog(!showDialog)} className="" text="Create A Company" />
              <Button className="bp3-popover-dismiss">Dismiss</Button>
            </div>
          </Popover>
          <Button 
            className="bp3-minimal"
            onClick={(e: any) => props.logoutAction(props.history)}
          >
            Logout
          </Button>
        </Navbar.Group>
      </Navbar>
      {showDialog && (
        <Dialog
          icon="briefcase"
          onClose={() => setShowDialog(!showDialog)}
          title="Company Sign Up"
          isOpen
          style={{ background: '#fff' }}
        >
          <div>
            <CompanySignupForm />
          </div>
        </Dialog>
      )}
    </>
  );
}

export const NavbarTop = connect(null, { logoutAction })(withRouter(NavbarTopComponent));