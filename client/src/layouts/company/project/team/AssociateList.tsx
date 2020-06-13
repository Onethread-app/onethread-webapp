import React, { useState, useEffect } from 'react';
import { Loading } from 'components/Loading';
import { Card } from '@blueprintjs/core';
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
import { getProjectAssociates } from 'stores/project/Actions';
=======
import moment from 'moment';
import { getProjectAssociates } from 'stores/associate/Actions';
>>>>>>> c885f026... add associates in the project (#19)
=======
import { getProjectAssociates } from 'stores/project/Actions';
>>>>>>> e8fd5de7... Wip/project type associates (#199) (#203)
=======
import { getProjectAssociates } from 'stores/project/Actions';
>>>>>>> 6d92f22e... Dev (#202)
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
<<<<<<< HEAD
<<<<<<< HEAD

                  associate.hasOwnProperty('associateCompany') ? (
                    <>
                    <Card className="ba b--black-20 br4 pa4 ma2">
=======
                  <>
                    <Card
                      className="ba b--black-20 br4 pa4 ma2"
                    >
>>>>>>> 06ed9e58... feat: app version inclued (#220)
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
<<<<<<< HEAD
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
=======
>>>>>>> 6d92f22e... Dev (#202)
                  <Card
                    className="ba b--black-20 br4 pa4 ma2"
                    interactive={true}
                  >
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
=======
                    <Card
                      className="ba b--black-20 br4 pa4 ma2"
                    >
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
>>>>>>> 06ed9e58... feat: app version inclued (#220)
                ))
              ) : (
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
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
=======
                <p>No associates available</p>
              )}
>>>>>>> 4e99f05f... code style issue fixed
=======
                    <p>No associates available</p>
                  )}
>>>>>>> e8fd5de7... Wip/project type associates (#199) (#203)
=======
                    <p>No associates available</p>
                  )}
>>>>>>> 6d92f22e... Dev (#202)
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
<<<<<<< HEAD
<<<<<<< HEAD
                  associate.hasOwnProperty('associateCompany') ? (
                    <>
                    <Card className="ba b--black-20 br4 pa4 ma2">
                      <h1 className="center white f3 bg-green w3 h3 tc pt3 br3">
=======
                  <>
                    <Card
                      className="ba b--black-0125 br4 ma1"
                    >
                      <h1
                        className="center white f4 fw6 bg-green tc br3 pt2 ma0"
                        style={{ width: '3rem', height: '3rem' }}
                      >
>>>>>>> 06ed9e58... feat: app version inclued (#220)
                        {associate.associateCompany
                          ? associate.associateCompany.name.charAt(0)
                          : 'Demo'}
                      </h1>
<<<<<<< HEAD
                      <h1 className="tc black f4 mv0">
=======
                      <h1 className="tc black f4-ns f5 fw6 mt2 mb0">
>>>>>>> 06ed9e58... feat: app version inclued (#220)
                        {associate.associateCompany.name}
                      </h1>
                      <h1 className="tc silver f7 mv0">
                        {associate.associateCompany.type}
                      </h1>
                    </Card>
<<<<<<< HEAD
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
=======
>>>>>>> 6d92f22e... Dev (#202)
                  <Card
                    className="ba b--black-0125 br4 ma1"
                    interactive={true}
                  >
                    <h1
                      className="center white f4 fw6 bg-green tc br3 pt2 ma0"
                      style={{ width: '3rem', height: '3rem' }}
=======
                    <Card
                      className="ba b--black-20 br4 pa4 ma2"
>>>>>>> 06ed9e58... feat: app version inclued (#220)
                    >
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
                ))
              ) : (
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
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
=======
                <p>No associates available</p>
              )}
>>>>>>> 4e99f05f... code style issue fixed
=======
                    <p>No associates available</p>
                  )}
>>>>>>> e8fd5de7... Wip/project type associates (#199) (#203)
=======
                    <p>No associates available</p>
                  )}
>>>>>>> 6d92f22e... Dev (#202)
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
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
    associates: state.projectReducer.projectAssociates,
=======
    associates: state.associateReducer.associatesList,
>>>>>>> c885f026... add associates in the project (#19)
=======
    associates: state.projectReducer.projectAssociates,
>>>>>>> e8fd5de7... Wip/project type associates (#199) (#203)
=======
    associates: state.projectReducer.projectAssociates,
>>>>>>> 6d92f22e... Dev (#202)
=======
    associates: state.projectReducer.projectAssociates
>>>>>>> 06ed9e58... feat: app version inclued (#220)
  };
};

export const AssociateList = connect(mapStateToProps, {
  getProjectAssociates,
})(withRouter(AssociateListComponent));
