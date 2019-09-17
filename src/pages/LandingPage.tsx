import React from 'react';
import { NavbarTop } from 'components/Navbar';
import { Sidebar } from 'components/Sidebar';

export const LandingPage = () => {
  return (
    <div className="bg-near-white vh-100">
      <NavbarTop />
      <div className="w-100 cf ">
        <div className="fl w-25-ns w-15-l pa2 bg-light-blue">
          <Sidebar/>
        </div>
        <div className="fl w-75-ns w-85-l  pa2 bg-light-yellow">
          <p>asdfasdfasdf asdf asdf asdf sadf asd fasdf asdfasd fasdfasdf asdfasdf asdfasdf </p>
        </div>
      </div>
    </div >
  )
}
