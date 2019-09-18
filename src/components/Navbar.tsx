import React, { useState } from 'react'
import { Button, Popover, Position, Dialog } from '@blueprintjs/core';
import { CompanySignupForm } from './company/SignupForm';
import { connect } from 'react-redux';
import { logoutAction } from 'actions/AuthActions';
import { withRouter, RouteComponentProps } from 'react-router';
import { History } from 'history';
import user from '../resources/images/user.png';
import logo from '../resources/images/tigrowLogo.png';
interface NavbarTopProps {
  logoutAction: (history: History) => void;
}

const NavbarTopComponent = (props: NavbarTopProps & RouteComponentProps) => {
  const [showDialog, setShowDialog] = useState(false);
  return (
    <>
      <nav
        className="db w-100 border-box pa2 ph5-l bg-white fixed ba b--tigrowLightGray-1 z-max"
      >
        <div className="db dtc-l v-mid  w-100 w-25-l tc tl-l mb2 mb0-l" title="Home">
          <img src={logo} className="dib w-20" alt="Site Name" />
        </div>
        <div className="db dtc-l v-mid w-100 w-75-l tc tr-l">
          <Popover
            popoverClassName="bp3-popover-content-sizing"
            position={Position.BOTTOM}
          >
            <Button className="bp3-minimal  dim dark-gray f6 f5-l dib mr3 mr4-l">My Company</Button>
            <div>
              <main className="mw6 center">
                <article className="dt w-100 pb2 mt2" >
                  <div className="dtc w1 w2-ns v-mid">
                    <img src="http://mrmrs.github.io/photos/p/2.jpg" className="ba b--black-10 db w1 w2-ns h1 h2-ns br3" />
                  </div>
                  <div className="dtc v-mid pl3">
                    <h1 className="f7 f6-ns fw4 lh-title black mv0">Young Gatchell </h1>
                    <h2 className="f6 fw3 mt0 mb0 black-60">@yg</h2>
                  </div>
                </article>
                <article className="dt w-100 pb2 mt2" >
                  <div className="dtc w1 w2-ns v-mid">
                    <img src="http://mrmrs.github.io/photos/p/3.jpg" className="ba b--black-10 db w1 w2-ns h1 h2-ns br3" />
                  </div>
                  <div className="dtc v-mid pl3">
                    <h1 className="f7 f6-ns fw4 lh-title black mv0">Arnoldo Degraff</h1>
                    <h2 className="f6 fw3 mt0 mb0 black-60">@99xx88randomhandle</h2>
                  </div>
                </article>
                <article className=" dt w-100  pb2 mt2"  >
                  <div className="dtc w1 w2-ns v-mid">
                    <img src="http://mrmrs.github.io/photos/p/4.jpg" className="ba b--black-10 db w1 w2-ns h1 h2-ns br3" />
                  </div>
                  <div className="dtc v-mid pl3">
                    <h1 className="f7 f6-ns fw4 lh-title black mv0">Deirdre Lachance</h1>
                    <h2 className="f6 fw3 mt0 mb0 black-60">@favfavfav</h2>
                  </div>
                </article>
              </main>
              <button onClick={() => setShowDialog(!showDialog)}
                className="b--none w-100 br3 grow h2 ph5 pointer pv2 white outline-0 bg-tigrowLightBlue ma2"
              >Create Company</button>
            </div>
          </Popover>
          <button className="bp3-button bp3-minimal dim dark-gray bp3-icon-chat f6 f5-l dib mr3 mr4-l" ></button>
          <button className="bp3-button bp3-minimal dim dark-gray bp3-icon-notifications f6 f5-l dib mr3 mr4-l" ></button>
          <Popover
            popoverClassName="bp3-popover-content-sizing"
            position={Position.BOTTOM}
          >
            <a className="dim mid-gray f6 f5-l  v-mid " href="#" title="User">
              <img src={user} className="dib w2 h2 br-100" alt="user" />
            </a>
            <Button
              className="bp3-minimal dim dark-gray f6 f5-l dib mr3 mr4-l"
              onClick={(e: any) => props.logoutAction(props.history)}
            >
              Logout
          </Button>
          </Popover>
        </div>
      </nav>
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

