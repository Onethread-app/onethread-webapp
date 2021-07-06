import React, { useState, useEffect } from 'react';
import { Loading } from 'components/Loading';
import { Card } from '@blueprintjs/core';
import { getProjectAssociates } from 'stores/project/Actions';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { ICompany } from 'stores/company/Reducer';
import { Associate } from 'stores/associate/Reducer';
import {
  CustomView,
  MobileOnlyView,
  isMobileOnly,
} from 'react-device-detect';
import { useTranslation } from 'react-i18next';

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

  const { t } = useTranslation();

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
                <p>{t('app.company.Partners.No-associates')}</p>
                // <p>No associates available</p>
              )}
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
                <p>{t('app.company.Partners.No-associates')}</p>
                // <p>No associates available</p>
              )}
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
    associates: state.projectReducer.projectAssociates,
  };
};

export const AssociateList = connect(mapStateToProps, {
  getProjectAssociates,
})(withRouter(AssociateListComponent));
