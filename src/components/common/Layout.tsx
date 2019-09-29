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
          <div className="db">
            <Sidebar />
          </div>
          <div className="fl w-100 pl5 pl11-l pl6-m pr2 bg-tigrow">
            <props.Component />
          </div>
        </div>
      </div>
    </div>
  </div>
);
