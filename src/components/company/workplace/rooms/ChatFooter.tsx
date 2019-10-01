import React from 'react';
import { Button, Icon } from '@blueprintjs/core';
import user from '../../../../resources/images/user.png';

export const ChatFooterComponent =() => {
  return(
    <>
    <div className="fixed bottom-1 w-60 br3 shadow-3">
      <nav className="bp3-navbar br3 ">
        <div className="bp3-navbar-group bp3-align-left">
        <div className="bp3-navbar-heading">
            <a className="dim" href="#" title="User">
              <img src={user} className="v-mid w2 br-100" alt="user" />
            </a>
         </div>
        </div>
        <input className="bp3-input bp3-minimal w-60 mv2"  
        type="text" 
        placeholder="Write your message" 
        dir="auto" 
        />
        <div className="bp3-navbar-group bp3-align-right">
          <Button className="bp3-button bp3-minimal bp3-large" >
          <Icon icon="media" style={{color:"#0fa3a3"}} />
          </Button>
          <Button className="bp3-button bp3-minimal bp3-large" >
          <Icon icon="link" style={{color:"#0fa3a3"}} />
          </Button>
          <Button className="bp3-button bp3-minimal bp3-large" >
          <Icon icon="insert" style={{color:"#0fa3a3"}} />
          </Button>
        </div>
        </nav>
    </div>
    </>
  )
}