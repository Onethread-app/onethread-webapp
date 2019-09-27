import * as React from 'react';
import { NavbarTop } from 'components/Navbar';
import { Sidebar } from 'components/Sidebar';

interface LayoutProps {
  Component: React.ComponentClass | React.StatelessComponent;
}

export const Layout = (props: LayoutProps) => (
  <div className="cf">
    <div className="fl w-100">
      <NavbarTop />
      <div className="fl w-100" style={{ marginTop: '50px' }}>
        <div className="flex w-100">
          <div className="dn db-ns">
            <Sidebar />
          </div>
          <div className="fl w-100 pl0 pl7-ns pr2 bg-tigrow">
            <props.Component />
          </div>
        </div>
      </div>
    </div>
  </div>
);
