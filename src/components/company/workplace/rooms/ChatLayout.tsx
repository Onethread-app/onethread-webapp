import React, { useState } from "react";
import { Classes, H3, Tab, Tabs, InputGroup, Button, Icon } from "@blueprintjs/core";
import { ListItemViewWithRoundedImage } from 'components/common/ListItemViewWithRoundedImage';
import user from '../../../../resources/images/user.png';

const Chat: React.SFC<{}> = () => (
  <div>
    <div className="relative">
      <div
        className="overflow-y-auto"
        style={{ height: "calc(100vh - 170px)" }}
      >
        <ListItemViewWithRoundedImage
          imageSrc={user}
          listDescription="asdasd asd asd asd ads "
        />
      </div>
      <div className="fixed bottom-1 w-60 br3 shadow-3 dt pa1">
          <div className="dtc w3 v-mid">
              <a className="dim ml2" href="#" title="User">
                <img
                  src={user}
                  className="v-mid w2 br-100"
                  alt="user"
                />
              </a>
          </div>
          <textarea className="bp3-input dtc w-100 ma1" ></textarea>
          <div className="w-15 dtc v-mid pl2">
            <Button className="bp3-button bp3-minimal bp3-large" >
              <Icon icon="media" style={{ color: "#0fa3a3" }} />
            </Button>
            <Button className="bp3-button bp3-minimal bp3-large" >
              <Icon icon="link" style={{ color: "#0fa3a3" }} />
            </Button>
            <Button className="bp3-button bp3-minimal bp3-large" >
              <Icon icon="insert" style={{ color: "#0fa3a3" }} />
            </Button>
          </div>
      </div>
    </div>
  </div>
);

const Task: React.SFC<{}> = () => (
  <div>
    <H3>Example panel: Task</H3>
    <p className={Classes.RUNNING_TEXT}>
      Ember.js is an open-source JavaScript application framework, based on the model-view-controller (MVC)
      pattern. It allows developers to create scalable single-page web applications by incorporating common idioms
      and best practices into the framework. What is your favorite JS framework?
        </p>
    <input className={Classes.INPUT} type="text" />
  </div>
);

export const ChatLayout = () => {

  const [activePanelOnly] = useState(false);
  const [animate] = useState(true);
  // const [navbarTabId, setNavbarTabId] = useState("Home");
  const [vertical] = useState(false);

  return (
    <div className="z-2 ">
      <div className="flex mv2">
        <p className="f4 fw7 mv1">General</p>
        <div className="flex ml-auto">
          <InputGroup leftIcon="search"
            placeholder="search in conversations"
            className="ma1"
          />
          <Button className="bp3-minimal ma1 outline-0 grow" style={{ background: "#0fa3a3" }} >
            <Icon icon="cog" style={{ background: "#0fa3a3", color: "white" }} />
          </Button>
          <Button className="bp3-minimal ma1 outline-0 grow" style={{ background: "#B7B7B7" }} >
            <Icon icon="notifications" style={{ background: "#B7B7B7", color: "white" }} />
          </Button>
          <Button className="bp3-minimal ma1 outline-0 grow" style={{ background: "#F55B7F" }} >
            <Icon icon="new-person" style={{ background: "#F55B7F", color: "white" }} />
          </Button>
        </div>
      </div>
      <Tabs
        animate={animate}
        id="TabsExample"
        key={vertical ? "vertical" : "horizontal"}
        renderActiveTabPanelOnly={activePanelOnly}
        vertical={vertical}
      >
        <Tab id="ch" title="Chat" panel={<Chat />} />
        <Tab id="ta" title="Task" panel={<Task />} panelClassName="task-panel" />
        <Tabs.Expander />
      </Tabs>
    </div>
  );

}
