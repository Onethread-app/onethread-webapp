import * as React from "react";
import { Link } from "react-router-dom";

export const LoginPage = () => (
  <div className="dt fl vh-100 cf">
    <div className="mw9 center ph3-ns v-mid dtc">
      <div className="cf ph2-ns ml6 mr6 shadow-1 pt5 pb5">
        <Link
          to="/signuppage"
          style={{ textDecoration: "none", color: "#0fa3a3" }}
          className="fl w-100 w-50-ns dt grow br bw1"
        >
          <div className="v-mid dtc">
            <div className="w-40 center">
              <img src={require("./../images/individual.png")} />
              <h2>Sign Up As Company</h2>
            </div>
          </div>
        </Link>
        <Link
          to="/signuppage"
          style={{ textDecoration: "none" }}
          className="fl w-100 w-50-ns dt grow"
        >
          <div className="v-mid dtc">
            <div className="w-40 center">
              <img src={require("./../images/company.png")} />
              <h2 style={{ color: "#0fa3a3" }}>Sign Up As Individual</h2>
            </div>
          </div>
        </Link>
      </div>
    </div>
  </div>
);
