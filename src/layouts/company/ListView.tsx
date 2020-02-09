import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router';
import { getCompanyDetails } from 'stores/company/Actions';
import { History } from 'history';
import { getAllCompaniesByUserId } from 'stores/user/Actions';
import { User, ICompanyByUser } from 'stores/user/Reducer';
import { Loading } from 'components/Loading';

interface CompanyListViewProps {
  showDialog: boolean;
  setShowDialog: (val: boolean) => void;
}
interface CompanyListViewInternalProps extends CompanyListViewProps {
  currentCompany: string;
  companies: ICompanyByUser[];
  user: User;
  getCompanyDetails: (companyId: string, history: History) => void;
  getAllCompaniesByUserId: (userId: string) => void;
}

export const ListViewComponent = (props: CompanyListViewInternalProps & RouteComponentProps) => {

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (loading === true) {
      props.getAllCompaniesByUserId(props.user._id);
    }
    setLoading(false);
  }, [loading])

  return (
    <>
      <div className="mw6 center overflow-y-auto" style={{ maxHeight: '16rem' }}>
        {loading ? <Loading /> : props.companies && props.companies.length > 0 ?
          props.companies.map((c: ICompanyByUser) => (
            <article
              className={`dt w-100 hover-bg-black-10 pa2 ${props.currentCompany === c.company._id ? "bg-black-10" : ""} mt2 pointer bp3-popover-dismiss`}
              onClick={async () => {
                const response = await props.getCompanyDetails(c.company.name, props.history) as any;
                if (response.status === 200) {
                  props.history.push(`/company/${(response as any).data.company.name}`);
                } 
                // else{
                //   props.history.push(`/notFound`);
                // }
              }}
            >
              <div
                className="dtc w1 v-mid"
              >
                <div className={`db w1 h1 br-100 
                ${props.currentCompany === c.company._id ? "bg-green" : "bg-red"}`}
                  style={{ width: '.7rem', height: '.7rem' }}
                ></div>
              </div>
              <div className="dtc v-mid pl3">
                <h1 className="f7 f6-ns fw4 lh-title black mv0 ws-break">{c.company.name} </h1>
                <h2 className="f6 fw3 mt0 mb0 black-60 ws-break">{`Role: ${c.role}`}</h2>
              </div>
            </article>
          )) : undefined}
      </div>
      <button
        onClick={() => props.setShowDialog(!props.showDialog)}
        className="b--none w-100 mt3 br2 grow ph5 pointer pv2 white outline-0 bg-tigrowLightBlue bp3-popover-dismiss"
      >
        Create Company
        </button>
    </>
  )
}

const mapStateToProps = (state: any) => {
  return {
    companies: state.userReducer.user.companies,
    user: state.userReducer.user,
    currentCompany: state.companyReducer.currentCompany._id,
  }
}

export const CompanyListView = connect(mapStateToProps, { getCompanyDetails, getAllCompaniesByUserId })(withRouter(ListViewComponent));


