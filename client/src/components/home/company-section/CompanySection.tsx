import { useCallback, useEffect, useState, useMemo } from 'react';
import { Dialog } from '@blueprintjs/core';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { getAllCompaniesByUserId } from 'stores/user/Actions';
import { ICompanyByUser, User } from 'stores/user/Reducer';
import { ICompany } from 'stores/company/Reducer';
import { clearCompanyState } from 'stores/company/Actions';

import Plus from '../../../resources/images/plus.png';
import Vector from '../../../resources/images/Vector.png';
import Union from '../../../resources/images/Union.png';
import Hamburger from '../../../resources/images/hamburger.png';
import {
  Avatar,
  Company,
  Header,
  Footer,
  CreateCompany,
  CompanyContainer,
  CompanySkeletons,
} from './CompanySection.styles';

import { CompanySignupForm } from './CompanyDialog';

interface ICompanySectionInternalProps {
  user: User;
  companies: ICompanyByUser[];
  currentCompany: ICompany;
  getAllCompaniesByUserId: (userId) => void;
  clearCompanyState: () => void;
}

export const Color = [
  { code: 0, value: '#FA617F' },
  { code: 1, value: '#A8D16B' },
  { code: 2, value: '#FFD7D0' },
  { code: 3, value: '#FE5E41' },
  { code: 4, value: '#3F61C5' },
  { code: 5, value: '#11B468' },
  { code: 6, value: '#5A1DD6' },
];

export const dummyArray = [1, 2, 3, 4];

const CompanySection = (props: ICompanySectionInternalProps) => {
  const [showCompanyDialog, setShowCompanyDialog] =
    useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const companies = useMemo(() => props.companies, [props.companies]);

  const getRandomInt = (max) => {
    return Math.floor(Math.random() * max);
  };

  const getRandomColor = useCallback(() => {
    return Color[getRandomInt(6)]?.value;
  }, []);

  useEffect(() => {
    if (props.user._id && props.companies.length === 0) {
      props.getAllCompaniesByUserId(props.user._id);
      setLoading(true);
    }
    if (props.companies.length > 0 && loading === true) {
      setLoading(false);
    }
    if (props.currentCompany.name) {
      props.clearCompanyState();
    }
  }, [props.user, props.companies, loading]);

  return (
    <div>
      <Header>
        Companies <img src={Hamburger} alt="" />
      </Header>
      <CompanyContainer>
        <Link
          to="#"
          onClick={() => {
            setShowCompanyDialog(!showCompanyDialog);
          }}
        >
          <CreateCompany>
            <img src={Plus} alt="" />
            <span>New</span>
            <span>Company</span>
          </CreateCompany>
        </Link>
        {loading ? (
          <>
            {[1, 2, 3, 4, 5].map((x) => (
              <CompanySkeletons id={x} key={x} />
            ))}
          </>
        ) : (
          <>
            {companies.map((company, i) => (
              <Link
                to={`/company/${company.company.uniqueName}`}
                key={company.company.uniqueName}
              >
                <Company>
                  <div style={{ width: '100%' }}>
                    <Avatar bgColor={getRandomColor()}>
                      {company.company?.name[0]}
                    </Avatar>
                    <span className="capitalize">
                      {company.company?.name}
                    </span>
                  </div>
                  <Footer>
                    <span>
                      <img src={Union} alt="" />
                      <p>{company.company.numberOfProjects}</p>
                    </span>
                    <span>
                      <img src={Vector} alt="" />
                      <p>{company.company.numberOfTasks}</p>
                    </span>
                  </Footer>
                </Company>
              </Link>
            ))}
          </>
        )}
      </CompanyContainer>
      {showCompanyDialog ? (
        <Dialog
          isOpen={showCompanyDialog}
          canOutsideClickClose={true}
          canEscapeKeyClose={true}
          onClose={() => {
            setShowCompanyDialog(false);
          }}
          autoFocus
          style={{ borderRadius: '1rem' }}
          className="w-auto h-auto pb0"
        >
          <CompanySignupForm setShowDialog={setShowCompanyDialog} />
        </Dialog>
      ) : null}
    </div>
  );
};

const mapStateToProps = (state: any) => ({
  user: state.userReducer.user,
  companies: state.userReducer.user.companies,
  currentCompany: state.companyReducer.currentCompany,
});

export default connect(mapStateToProps, {
  getAllCompaniesByUserId,
  clearCompanyState,
})(CompanySection);
