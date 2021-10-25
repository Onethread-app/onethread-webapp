import { useCallback, useEffect, useState } from 'react';

import { ICompanyByUser } from 'stores/user/Reducer';

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
} from './CompanySection.styles';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getCompanyDetails } from 'stores/company/Actions';
import { Dialog } from '@material-ui/core';
import { CompanySignupForm } from './CompanyDialog';

interface Props {
  companies: ICompanyByUser[];
  creatingCompany: boolean;
  errorOnCreatingCompany: string;
  getCompanyDetails: (name: string) => void;
  useToaster: () => {};
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

const CompanySection = (props: Props) => {
  const {
    companies,
    creatingCompany,
    errorOnCreatingCompany,
    getCompanyDetails,
  } = props;
  const [showCompanyDialog, setShowCompanyDialog] =
    useState<boolean>(false);

  const handleCompanyChange = (company: {
    _id: string;
    uniqueName: string;
  }) => {
    getCompanyDetails(company.uniqueName);
  };

  const getRandomInt = (max) => {
    return Math.floor(Math.random() * max);
  };

  const getRandomColor = useCallback(() => {
    return Color[getRandomInt(6)]?.value;
  }, []);

  useEffect(() => {
    if (
      showCompanyDialog &&
      creatingCompany === false &&
      errorOnCreatingCompany === ''
    ) {
      setShowCompanyDialog(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [creatingCompany, errorOnCreatingCompany]);

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

        {companies.map((company, i) => (
          <Link
            to={`/company/${company.company.uniqueName}`}
            key={company.company.uniqueName}
          >
            <Company>
              <div
                style={{ width: '100%' }}
                onClick={() => handleCompanyChange(company.company)}
              >
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
      </CompanyContainer>
      {showCompanyDialog ? (
        <Dialog
          onClose={() => setShowCompanyDialog(!showCompanyDialog)}
          open={showCompanyDialog}
          maxWidth={'lg'}
        >
          <CompanySignupForm
            setShowDialog={setShowCompanyDialog}
            useToaster={props.useToaster}
          />
        </Dialog>
      ) : null}
    </div>
  );
};

const mapStateToProps = (state: any) => ({
  companies: state.userReducer.user.companies,
  creatingCompany: state.companyReducer.creatingCompany,
  errorOnCreatingCompany: state.companyReducer.errorOnCreatingCompany,
});

export default connect(mapStateToProps, { getCompanyDetails })(
  CompanySection,
);
