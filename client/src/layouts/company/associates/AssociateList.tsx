import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  CustomView,
  MobileOnlyView,
  isMobileOnly,
} from 'react-device-detect';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';

import { Card } from '@blueprintjs/core/lib/esm/components/card/card';
import moment from 'moment';

import { ICompany } from 'stores/company/Reducer';
import { Associate } from 'stores/associate/Reducer';
import { getAllAssociates } from 'stores/associate/Actions';

import { Loading } from 'components/Loading';
import { RightSidebar } from 'components/RightSidebar';
import { AssociateFormEditor } from './AssociateFormEditor';
import addIcon from '../../../resources/images/addIcon.png';

interface AssociatesPageComponentProps {
  company: ICompany;
  associates: Associate[];
  getAllAssociates: () => void;
}

export const AssociateListComponent = (
  props: RouteComponentProps & AssociatesPageComponentProps,
) => {
  const { t } = useTranslation();
  const [showAssociateDialog, setShowAssociateDialog] =
    useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadAssociates(getAssociates: () => void) {
      setLoading(true);
      await getAssociates();
      setLoading(false);
    }
    loadAssociates(props.getAllAssociates);
  }, [props.company._id]);

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
                  <Card
                    className="ba b--black-20 br4 pa4 ma2"
                    interactive={true}
                    onClick={async (e) => {
                      e.preventDefault();
                      props.history.push(
                        `/company/${props.company.uniqueName}/associate/${associate._id}`,
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
                <p>{t('app.company.Partners.No-Partners')}</p>
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
                  <Card
                    className="ba b--black-0125 br4 ma1"
                    interactive={true}
                    onClick={async (e) => {
                      e.preventDefault();
                      props.history.push(
                        `/company/${props.company.uniqueName}/associate/${associate._id}`,
                      );
                    }}
                  >
                    {associate.associateCompany.logo ? (
                      <img
                        src={`${associate.associateCompany.logo}`}
                        alt="company logo"
                      />
                    ) : (
                      <h1
                        className="center white f4 fw6 bg-green tc br3 pt2 ma0"
                        style={{ width: '3rem', height: '3rem' }}
                      >
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
                <p>{t('app.company.Partners.No-associates')}</p>
              )}
            </div>
          </MobileOnlyView>
          <div>
            <img
              onClick={() =>
                setShowAssociateDialog(!showAssociateDialog)
              }
              src={addIcon}
              className={`fixed pointer addButton ${
                showAssociateDialog ? 'dn' : 'db'
              }`}
              style={{
                boxShadow: '0px 6px 6px #00000029',
                borderRadius: '50%',
              }}
            />
          </div>
        </div>
      </div>
      {showAssociateDialog && (
        <RightSidebar
          onClose={() => setShowAssociateDialog(!showAssociateDialog)}
        >
          <AssociateFormEditor
            company={props.company}
            showDialog={showAssociateDialog}
            setShowDialog={() =>
              setShowAssociateDialog(!showAssociateDialog)
            }
          />
        </RightSidebar>
      )}
    </div>
  );
};

const mapStateToProps = (state: any) => {
  return {
    company: state.companyReducer.currentCompany,
    associates: state.associateReducer.associatesList,
  };
};

export const AssociateList = connect(mapStateToProps, {
  getAllAssociates,
})(withRouter(AssociateListComponent));
