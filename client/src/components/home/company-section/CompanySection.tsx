import { useEffect, useState } from 'react';

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
import { CompanySignupForm } from 'layouts/company/Form';
import { Dialog } from '@blueprintjs/core/lib/esm/components/dialog/dialog';
import { Link } from 'react-router-dom';
import { getCompanyDetails } from 'stores/company/Actions';

interface Props {
  companies: ICompanyByUser[];
  creatingCompany: boolean;
  errorOnCreatingCompany: string;
  getCompanyDetails: (name: string) => void;
  useToaster: () => {};
}

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
                <Avatar>{company.company.name[0]}</Avatar>
                <span>{company.company.name}</span>
              </div>
              <Footer>
                <span>
                  <img src={Union} alt="" />
                  {/* Add Project count */}
                </span>
                <span>
                  <img src={Vector} alt="" />
                  {/* Add tasks count */}
                </span>
              </Footer>
            </Company>
          </Link>
        ))}
      </CompanyContainer>
      {showCompanyDialog ? (
        <Dialog
          onClose={() => setShowCompanyDialog(!showCompanyDialog)}
          isOpen={showCompanyDialog}
          style={{ background: '#fff' }}
          canOutsideClickClose={false}
        >
          <CompanySignupForm setShowDialog={setShowCompanyDialog} />
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
