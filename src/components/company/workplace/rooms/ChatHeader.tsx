import React from 'react';
import { Button, InputGroup, Icon } from '@blueprintjs/core';

export const ChatHeaderComponent = () => {
  return (
    <>
      <div className="flex mv2">
        <p className="f4 fw7 mv1">General</p>
        <div className="flex ml-auto">
        <InputGroup leftIcon="search"
          placeholder="search in conversations"
          className="ma1"
        />
        <Button className="bp3-minimal ma1 outline-0 grow" style={{ background: "#0fa3a3"}} >
          <Icon icon="cog"  style={{ background: "#0fa3a3", color: "white" }} />
        </Button>
        <Button className="bp3-minimal ma1 outline-0 grow" style={{ background: "#B7B7B7"}} >
          <Icon icon="notifications" style={{ background: "#B7B7B7", color: "white" }} />
        </Button>
        <Button className="bp3-minimal ma1 outline-0 grow" style={{ background: "#F55B7F"}} >
          <Icon icon="new-person"  style={{ background: "#F55B7F", color: "white" }} />
        </Button>
        </div>
      </div>
    </>
  )
}