import React, { useState } from 'react';
import { Icon, Button, Drawer } from '@blueprintjs/core';
import tigrowMini from './../../resources/LandingImages/TiGrow-mini-logo.svg';
import { NavLink } from 'react-router-dom';
import { NavbarSoftwareList } from './NavbarSoftwareList';
import { NavbarResourcesList } from './NavbarResourcesList';
import { NavbarPartnersList } from './NavbarPartnersList';
import { NavbarAboutList } from './NavbarAboutList';

interface NavbarListProps {
  setShowDialog: (val: boolean) => void;
}

export const NavbarListView = (
  props: NavbarListProps
) => {
  const [showSoftwareDrawer, setShowSoftwareDrawer] = useState(false);
  const [showResourcesDrawer, setShowResourcesDrawer] = useState(false);
  const [showPartnersDrawer, setShowPartnersDrawer] = useState(false);
  const [showAboutDrawer, setShowAboutDrawer] = useState(false);

  return (
    <>
      <div>
        <div
          className="top-0 z-2 flex justify-between items-center ph4 w-100"
          style={{
            height: '70px',
            position: 'sticky',
            backgroundColor: '#F0FBFF'
          }}
        >
          <img className="mr1" style={{ width: '50px' }} src={tigrowMini} />
          <Icon
            icon="cross"
            iconSize={35}
            className="blue"
            onClick={() => props.setShowDialog(false)}
          />
        </div>
        <div className="w-100 ph2">
          <article
            onClick={() => {
              setShowSoftwareDrawer(true);
            }}
            className="flex bb b--light-silver items-center pv3 ph4"
          >
            <h1 className="fw6 f4 mr2">Software</h1>
            <Icon icon="caret-right" />
          </article>
          <article className="flex bb b--light-silver items-center pv3 ph4">
            <h1 className="fw6 f4 mr2">Pricing</h1>
          </article>
          <article
            className="flex bb b--light-silver items-center pv3 ph4"
            onClick={() => {
              setShowResourcesDrawer(true);
            }}
          >
            <h1 className="fw6 f4 mr2">Resources</h1>
            <Icon icon="caret-right" />
          </article>
          <article
            onClick={() => {
              setShowPartnersDrawer(true);
            }}
            className="flex bb b--light-silver items-center pv3 ph4"
          >
            <h1 className="fw6 f4 mr2">Partners</h1>
            <Icon icon="caret-right" />
          </article>
          <article
            onClick={() => {
              setShowAboutDrawer(true);
            }}
            className="flex items-center pv3 ph4"
          >
            <h1 className="fw6 f4 mr2">About</h1>
            <Icon icon="caret-right" />
          </article>
        </div>
        <div className="tc">
          <NavLink to="/signin">
            <Button
              className="bp3-minimal outline-0 f5 fw6 w-90 f5 fw6 mt6 pa3"
              style={{
                border: 'solid 2px #4B6BC8',
                color: '#4B6BC8'
              }}
            >SIGN IN
          </Button>
          </NavLink>
          <NavLink to="/signup">
            <Button
              className="bp3-minimal outline-0 f5 fw6 w-90 f5 fw6 pa3 mt3"
              style={{
                border: 'solid 2px #4B6BC8',
                color: 'white',
                backgroundColor: '#4B6BC8'
              }}
            >GET TIGROW FREE
      </Button>
          </NavLink>

        </div>
      </div>
      {showSoftwareDrawer && (
        <Drawer
          onClose={() => setShowSoftwareDrawer(!showSoftwareDrawer)}
          isOpen={showSoftwareDrawer}
          canOutsideClickClose={false}
          style={{ width: '100%' }}
        >
          <div>
            <NavbarSoftwareList
              setShowSoftwareDrawer={setShowSoftwareDrawer}
            />
          </div>
        </Drawer>
      )}
      {showResourcesDrawer && (
        <Drawer
          onClose={() => setShowResourcesDrawer(!showResourcesDrawer)}
          isOpen={showResourcesDrawer}
          canOutsideClickClose={false}
          style={{ width: '100%' }}
        >
          <div>
            <NavbarResourcesList
              setShowResourcesDrawer={setShowResourcesDrawer}
            />
          </div>
        </Drawer>
      )}
      {showPartnersDrawer && (
        <Drawer
          onClose={() => setShowPartnersDrawer(!showPartnersDrawer)}
          isOpen={showPartnersDrawer}
          canOutsideClickClose={false}
          style={{ width: '100%' }}
        >
          <div>
            <NavbarPartnersList
              setShowPartnersDrawer={setShowPartnersDrawer}
            />
          </div>
        </Drawer>
      )}
      {showAboutDrawer && (
        <Drawer
          onClose={() => setShowAboutDrawer(!showAboutDrawer)}
          isOpen={showAboutDrawer}
          canOutsideClickClose={false}
          style={{ width: '100%' }}
        >
          <div>
            <NavbarAboutList
              setShowAboutDrawer={setShowAboutDrawer}
            />
          </div>
        </Drawer>
      )}
    </>
  );
};
