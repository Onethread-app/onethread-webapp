import React from "react";
import { Tabs, Tab } from "@blueprintjs/core";
import { MyProject } from "./MyProjects";
import { PendingProjectRequest } from "./request/Index";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

const _ProjectPage = (props: any) => (
  <div className="ph5">
    <h3 className="f3">Projects</h3>
    <Tabs id="TabsExample">
      <Tab
        id="MyProjects"
        title="My Projects"
        panel={<MyProject />}
        className="outline-0 mt4"
      />
      {props.companyRole !== "employee" && (
        <Tab
          id="PendingProject"
          title="Pending Projects"
          panel={<PendingProjectRequest />}
          className="outline-0 mt4"
        />
      )}
    </Tabs>
  </div>
);
const mapStateToProps = (state: any) => {
  return {
    companyRole: state.companyReducer.currentCompany.role,
    PendingProjects: state.projectReducer.pendingProjects,
  };
};

export const ProjectPage = connect(
  mapStateToProps,
  {}
)(withRouter(_ProjectPage));
