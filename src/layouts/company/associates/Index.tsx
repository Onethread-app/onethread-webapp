import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { RightSidebar } from 'components/RightSidebar';

import addIcon from '../../../resources/images/addIcon.png';
import { AssociateFormEditor } from './AssociateFormEditor';
import { Card } from '@blueprintjs/core';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { ICompany } from 'stores/company/Reducer';
import { getAllAssociates } from 'stores/associate/Actions';
import moment from 'moment';
import { Loading } from 'components/Loading';
import { Associate } from 'stores/associate/Reducer';
interface AssociatesPageComponentProps {
  company: ICompany;
  associates: Associate[];
  getAllAssociates: () => void;
}

const AssociatesPageComponent = (props: RouteComponentProps & AssociatesPageComponentProps) => {
  const [showAssociateDialog, setShowAssociateDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadAssociates(getAssociates: () => void) {
      setLoading(true);
      await getAssociates();
      setLoading(false);
    }
    loadAssociates(props.getAllAssociates);
  }, []);

  return (
    <>
      <div className=" w-100">
        <h1 className="f3 ph4">My Associates</h1>
        <div className="br3 bg-white pa4-ns pa2 cf flex w-100">
          <div className="overflow-auto w-100">
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 280px))',
                gridTemplateRows: 'repeat(2, 270px)'
              }}>
              {loading ? <Loading /> : props.associates.length > 0 && props.associates.map((associate: Associate) => (
                <Card
                  className="ba b--black-20 br4 pa4 ma2"
                  interactive={true}
                  onClick={async (e) => {
                    e.preventDefault();
                    props.history.push(`/company/${props.company.name}/associate/${associate._id}`);
                  }}
                >
                  {associate.associateCompany.logo ?
                    <img src={`${associate.associateCompany.logo}`} alt="company logo" />
                    :
                    <h1 className="center white f3 bg-green w3 h3 tc pt3 br3">
                      {associate.associateCompany ? associate.associateCompany.name.charAt(0) : 'Demo'}
                    </h1>
                  }
                  <h1 className="tc black f4 mv0">{associate.associateCompany.name}</h1>
                  <h1 className="tc silver f7 mv0">{associate.associateCompany.type}</h1>
                  <h1 className="tc black f7 mt3">Added on {moment(associate.createdAt).format('MMMM Do YYYY')}</h1>
                </Card>
              ))}
            </div>
            <div>
              <img
                onClick={() => setShowAssociateDialog(!showAssociateDialog)}
                src={addIcon}
                className={`fixed pointer ${showAssociateDialog ? 'dn' : 'db'}`}
                style={{
                  bottom: '5rem',
                  right: '7rem',
                  width: '5rem',
                  boxShadow: '0px 6px 6px #00000029',
                  borderRadius: '50%'
                }}
              />
            </div>
          </div>
        </div>
      </div>
      {showAssociateDialog && (
        <RightSidebar
          onClose={() => setShowAssociateDialog(!showAssociateDialog)}
        >
          <AssociateFormEditor
            companyId={props.company._id}
            showDialog={showAssociateDialog}
            setShowDialog={() => setShowAssociateDialog(!showAssociateDialog)}
          />
        </RightSidebar>
      )}
    </>
  );
};

const mapStateToProps = (state: any) => {
  return {
    company: state.companyReducer.currentCompany,
    associates: state.associateReducer.associatesList
  };
};

export const AssociatesPage = connect(mapStateToProps, {
  getAllAssociates
})(withRouter(AssociatesPageComponent));