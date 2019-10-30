import React, { useState, useEffect } from 'react'
import { ListItemViewWithImage } from 'components/common/ListItemViewWithImage';
import { Dialog } from '@blueprintjs/core';
import { CompanySignupForm } from './SignupForm';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router';
import { getCompanyDetails } from 'stores/company/Actions';
import { History } from 'history';
import { getAllCompaniesByUserId } from 'stores/user/Actions';
import { User, ICompanyByUser } from 'stores/user/Reducer';
import { Loading } from 'components/common/field/Loading';

interface CompanyListViewInternalProps {
  companies: ICompanyByUser[];
  user: User;
  getCompanyDetails: (companyId: string, history: History) => void;
  getAllCompaniesByUserId: (userId: string) => void;
}

export const ListViewComponent = (props: CompanyListViewInternalProps & RouteComponentProps) => {
  const [showDialog, setShowDialog] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log(`get comapnies`)
    if (loading === true) {
      props.getAllCompaniesByUserId(props.user._id);
    }
    setLoading(false);
  }, [loading])

  return (
    <>
      <div className="mw6 center">
        {loading ? <Loading /> : props.companies && props.companies.length > 0 ? props.companies.map((c: ICompanyByUser) => (
          <ListItemViewWithImage
            imageSrc={`https://robohash.org/${c.company.name}`}
            listTitle={c.company.name}
            // listDescription="C"
            role={c.role}
            onClick={async () => {
              const response = await props.getCompanyDetails(c.company.name, props.history) as any;
              if (response) {
                props.history.push(`/company/${(response as any).company.name}`)
              }
            }}
          />
        )) : undefined}

        <button
          onClick={() => setShowDialog(!showDialog)}
          className="b--none w-100 br3 grow h2 ph5 pointer pv2 white outline-0 bg-tigrowLightBlue ma2 bp3-popover-dismiss"
        >
          Create Company
                </button>
      </div>
      {showDialog && (
        <Dialog
          icon="briefcase"
          onClose={() => setShowDialog(!showDialog)}
          title="Company Sign Up"
          isOpen
          style={{ background: '#fff' }}
        >
          <div>
            <CompanySignupForm setShowDialog={setShowDialog} />
          </div>
        </Dialog>
      )}
    </>
  )
}

const mapStateToProps = (state: any) => {
  return {
    companies: state.userReducer.user.companies,
    user: state.userReducer.user
  }
}

export const ListView = connect(mapStateToProps, { getCompanyDetails, getAllCompaniesByUserId })(withRouter(ListViewComponent));


