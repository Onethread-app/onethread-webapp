import React from 'react';
import { connect } from 'react-redux';
import { Button, Divider } from '@blueprintjs/core';

const ProjectRequestComponent = () => {

  return (
    <main className="">
      <article className="dt w-100 pv4 mt2" >
        <div className="dtc w2 w3-ns v-mid">
          <img src="http://mrmrs.github.io/photos/p/2.jpg" className="ba b--black-10 db br-100 w2 w3-ns h2 h3-ns" />
        </div>
        <div className="dtc v-mid pl3 mw6">
          <h1 className="f5 black mv0">Pratidin</h1>
          <h1 className="f6 f5-ns fw6 lh-title black mt3 mb0">500 pieces silky clothes</h1>
          <h2 className="f6 fw4 mt0 mb0 black-60">it is a long established fact that
          it is a long established fact that
          it is a long established fact that
          it is a long established fact that
          it is a long established fact that
            </h2>
        </div>
        <div className="dtc v-mid">
          <form className="w-100 tr">
            <Button
              className="w4 grow h2 pointer bp3-minimal mr4"
              style={{ border: '1px solid silver', outline: 'none' }}
              type="submit"
            >
              Reject
              </Button>
            <Button
              className="w4 grow h2 pointer"
              style={{ background: '#0fa3a3', outline: 'none', color: 'white', border: 'none' }}
              type="submit"
            >
              Accept
          </Button>
          </form>
        </div>
      </article>
      <Divider />
    </main>
  );
};

const mapStateToProps = (state: any) => {
  return {
    user: state.userReducer.user
  };
};

export const ProjectRequest = connect(mapStateToProps)(ProjectRequestComponent);