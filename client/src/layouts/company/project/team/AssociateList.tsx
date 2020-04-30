import React, { useState, useEffect } from 'react';
import { Loading } from 'components/Loading';
import { Card } from '@blueprintjs/core';
<<<<<<< HEAD
import { getProjectAssociates } from 'stores/project/Actions';
=======
import moment from 'moment';
import { getProjectAssociates } from 'stores/associate/Actions';
>>>>>>> c885f026... add associates in the project (#19)
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { ICompany } from 'stores/company/Reducer';
import { Associate } from 'stores/associate/Reducer';
import {
  CustomView,
  MobileOnlyView,
  isMobileOnly,
} from 'react-device-detect';

interface AssociatesPageComponentProps {
  company: ICompany;
  associates: Associate[];
  getProjectAssociates: () => void;
}

export const AssociateListComponent = (
  props: RouteComponentProps & AssociatesPageComponentProps,
) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadAssociates(getAssociates: () => void) {
      setLoading(true);
      await getAssociates();
      setLoading(false);
    }
    loadAssociates(props.getProjectAssociates);
  }, []);

  return (
    <div>
      <div className="br3 bg-white cf flex w-100">
        <div className="overflow-auto w-100">
          <CustomView condition={!isMobileOnly}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'repeat(auto-fit, minmax(200px, 280px))',
                gridTemplateRows: 'repeat(2, 270px)',
              }}
            >
              {loading ? (
                <Loading />
              ) : props.associates.length > 0 ? (
                props.associates.map((associate: Associate) => (
<<<<<<< HEAD

                  associate.hasOwnProperty('associateCompany') ? (
                    <>
                    <Card className="ba b--black-20 br4 pa4 ma2">
                      <h1 className="center white f3 bg-green w3 h3 tc pt3 br3">
                        {associate.associateCompany
                          ? associate.associateCompany.name.charAt(0)
                          : 'Demo'}
                      </h1>
                      <h1 className="tc black f4 mv0">
                        {associate.associateCompany.name}
                      </h1>
                      <h1 className="tc silver f7 mv0">
                        {associate.associateCompany.type}
                      </h1>
                    </Card>
                  </>
                  ) : 
                (
                  <>
                  <Card className="ba b--black-20 br4 pa4 ma2">
                    <h1 className="center white f3 bg-green w3 h3 tc pt3 br3">
                      {associate.company
                        ? associate.company.name.charAt(0)
                        : 'Demo'}
                    </h1>
                    <h1 className="tc black f4 mv0">
                      {associate.company.name}
                    </h1>
                    <h1 className="tc silver f7 mv0">
                      {associate.company.type}
                    </h1>
                  </Card>
                </>

                )
                  
                ))
              ) : (
                <p>No associates available</p>
              )}
=======
                  <Card
                    className="ba b--black-20 br4 pa4 ma2"
                    interactive={true}
                    onClick={async (e) => {
                      e.preventDefault();
                      props.history.push(
                        `/company/${props.company.name}/associate/${associate._id}`,
                      );
                    }}
                  >
                    {associate.associateCompany.logo ? (
                      <img
                        src={`${associate.associateCompany.logo}`}
                        alt="company logo"
                      />
                    ) : (
                        <h1 className="center white f3 bg-green w3 h3 tc pt3 br3">
                          {associate.associateCompany
                            ? associate.associateCompany.name.charAt(0)
                            : 'Demo'}
                        </h1>
                      )}
                    <h1 className="tc black f4 mv0">
                      {associate.associateCompany.name}
                    </h1>
                    <h1 className="tc silver f7 mv0">
                      {associate.associateCompany.type}
                    </h1>
                    <h1 className="tc black f7 mt3">
                      Added on{' '}
                      {moment(associate.createdAt).format(
                        'MMMM Do YYYY',
                      )}
                    </h1>
                  </Card>
                ))
              ) : (
<<<<<<< HEAD
<<<<<<< HEAD
                    <p>No associates available</p>
                  )}
>>>>>>> c885f026... add associates in the project (#19)
=======
                <p>No associates available</p>
              )}
>>>>>>> d06346b0... code style issue fixed
=======
                    <p>No associates available</p>
                  )}
>>>>>>> f4601c6e... add associates in the project (#19)
            </div>
          </CustomView>
          <MobileOnlyView>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'repeat(auto-fit, minmax(160px, 170px))',
                gridTemplateRows: 'repeat(2, 170px)',
              }}
            >
              {loading ? (
                <Loading />
              ) : props.associates.length > 0 ? (
                props.associates.map((associate: Associate) => (
<<<<<<< HEAD
                  associate.hasOwnProperty('associateCompany') ? (
                    <>
                    <Card className="ba b--black-20 br4 pa4 ma2">
                      <h1 className="center white f3 bg-green w3 h3 tc pt3 br3">
                        {associate.associateCompany
                          ? associate.associateCompany.name.charAt(0)
                          : 'Demo'}
                      </h1>
                      <h1 className="tc black f4 mv0">
                        {associate.associateCompany.name}
                      </h1>
                      <h1 className="tc silver f7 mv0">
                        {associate.associateCompany.type}
                      </h1>
                    </Card>
                  </>
                  ) : 
                (
                  <>
                  <Card className="ba b--black-20 br4 pa4 ma2">
                    <h1 className="center white f3 bg-green w3 h3 tc pt3 br3">
                      {associate.company
                        ? associate.company.name.charAt(0)
                        : 'Demo'}
                    </h1>
                    <h1 className="tc black f4 mv0">
                      {associate.company.name}
                    </h1>
                    <h1 className="tc silver f7 mv0">
                      {associate.company.type}
                    </h1>
                  </Card>
                </>

                )
                ))
              ) : (
                <p>No associates available</p>
              )}
=======
                  <Card
                    className="ba b--black-0125 br4 ma1"
                    interactive={true}
                    onClick={async (e) => {
                      e.preventDefault();
                      props.history.push(
                        `/company/${props.company.name}/associate/${associate._id}`,
                      );
                    }}
                  >
                    {associate.associateCompany.logo ? (
                      <img
                        src={`${associate.associateCompany.logo}`}
                        alt="company logo"
                      />
                    ) : (
                        <h1 className="center white f4 fw6 bg-green tc br3 pt2 ma0"
                          style={{ width: '3rem', height: '3rem' }}>
                          {associate.associateCompany
                            ? associate.associateCompany.name.charAt(0)
                            : 'Demo'}
                        </h1>
                      )}
                    <h1 className="tc black f4-ns f5 fw6 mt2 mb0">
                      {associate.associateCompany.name}
                    </h1>
                    <h1 className="tc silver f7 mv0">
                      {associate.associateCompany.type}
                    </h1>
                    <h1 className="tc black f7 fw6 mt2">
                      Added on{' '}
                      {moment(associate.createdAt).format(
                        'MMMM Do YYYY',
                      )}
                    </h1>
                  </Card>
                ))
              ) : (
<<<<<<< HEAD
<<<<<<< HEAD
                    <p>No associates available</p>
                  )}
>>>>>>> c885f026... add associates in the project (#19)
=======
                <p>No associates available</p>
              )}
>>>>>>> d06346b0... code style issue fixed
=======
                    <p>No associates available</p>
                  )}
>>>>>>> f4601c6e... add associates in the project (#19)
            </div>
          </MobileOnlyView>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: any) => {
  return {
    company: state.companyReducer.currentCompany,
<<<<<<< HEAD
    associates: state.projectReducer.projectAssociates,
=======
    associates: state.associateReducer.associatesList,
>>>>>>> c885f026... add associates in the project (#19)
  };
};

export const AssociateList = connect(mapStateToProps, {
  getProjectAssociates,
})(withRouter(AssociateListComponent));
