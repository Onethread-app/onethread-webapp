import React, { useState } from "react";

import { Classes, H3, Tab, Tabs } from "@blueprintjs/core";

export const ChatLayout = () => {

  const [activePanelOnly] = useState(false);
  const [animate] = useState(true);
  // const [navbarTabId, setNavbarTabId] = useState("Home");
  const [vertical] = useState(false);

  return (
    <div>

      {/* 1st */}
      {/* <Navbar>
        <Navbar.Group>
          <Navbar.Heading>
            Current page: <strong>{navbarTabId}</strong>
          </Navbar.Heading>
        </Navbar.Group>
        <Navbar.Group align={Alignment.RIGHT}>
          <Tabs
            animate={animate}
            id="navbar"
            large={true}
            onChange={(e) => {
              console.log(e);
              setNavbarTabId(e.toString());
            }}
            selectedTabId={navbarTabId}
          >
            <Tab id="Home" title="Home" />
            <Tab id="Files" title="Files" />
            <Tab id="Builds" title="Builds" />
          </Tabs>
        </Navbar.Group>
      </Navbar> */}

      {/* 2nd */}
      <Tabs
        animate={animate}
        id="TabsExample"
        key={vertical ? "vertical" : "horizontal"}
        renderActiveTabPanelOnly={activePanelOnly}
        vertical={vertical}
      >
        <Tab id="tm" title="Timeline" panel={<Timeline />} />
        <Tab id="ch" title="Chat" panel={<Chat />} />
        <Tab id="ta" title="Task" panel={<Task />} panelClassName="task-panel" />
        <Tabs.Expander />
      </Tabs>
    </div>
  );

}

const Timeline: React.SFC<{}> = () => (
  <div>
    <H3>Example panel: Timeline</H3>
    <p className={Classes.RUNNING_TEXT}>
      Lots of people use React as the V in MVC. Since React makes no assumptions about the rest of your technology
      stack, it's easy to try it out on a small feature in an existing project.
        </p>
  </div>
);

const Chat: React.SFC<{}> = () => (
  <div>
    <H3>Example panel: Chat</H3>
    <p className={Classes.RUNNING_TEXT}>
      HTML is great for declaring static documents, but it falters when we try to use it for declaring dynamic
      views in web-applications. AngularJS lets you extend HTML vocabulary for your application. The resulting
      environment is extraordinarily expressive, readable, and quick to develop.
        </p>
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
