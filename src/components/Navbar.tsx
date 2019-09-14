import React, { useState } from 'react'
import { Alignment, Button, Popover, PopoverInteractionKind, Position, Navbar, Dialog } from '@blueprintjs/core';
import { CompanySignupForm } from './company/SignupForm';

export const NavbarTop = () => {
  // const [showCollapse, setShowCollapse] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  return (
    <>
      <Navbar>
        <Navbar.Group align={Alignment.LEFT}>
          {/* <div className="dn-ns">
            <Button onClick={() => setShowCollapse(!showCollapse)}><div className="bp3-icon-menu" /></Button>
          </div> */}
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
