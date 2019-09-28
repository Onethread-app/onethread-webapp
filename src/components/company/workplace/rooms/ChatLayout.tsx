import React, { useState } from "react";

import { Classes, H3, Tab, Tabs } from "@blueprintjs/core";

export const ChatLayout = () => {

  const [activePanelOnly] = useState(false);
  const [animate] = useState(true);
  // const [navbarTabId, setNavbarTabId] = useState("Home");
  const [vertical] = useState(false);

  return (
    <div className="z-2">
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
