import {
  ChangeEvent,
  useState,
  lazy,
  Suspense,
  useMemo,
  useEffect,
} from 'react';
import { connect } from 'react-redux';
import { Dialog } from '@blueprintjs/core';

import useQuery from 'helpers/hooks/useQuery';
import { ICompany } from 'stores/company/Reducer';
import { User } from 'stores/user/Reducer';
import { Link } from 'react-router-dom';

import { companyPermit } from 'stores/UtilsActions';

import SuspenseLoader from 'components/loader/SuspenseLoader';
import { StyledTab, StyledTabs } from 'components/tab/NavTabs';
import TabPanel from 'components/tab/TabPanel';
import TextAvatar, {
  TextAvatarSkeleton,
} from 'components/avatar/TextAvatar';
import {
  Container,
  DashboardP,
  CompanyOptions,
  CompanyIconAndName,
  CompanyName,
  CompanyEditButton,
} from './Index.styles';
import Skeleton from '@material-ui/lab/Skeleton/Skeleton';
import { CompanyInfoForm } from 'layouts/company/profile/BasicInformationEditor';

const CompanyProjects = lazy(
  () => import('components/project/CompanyProjects'),
);
const CompanyTasks = lazy(
  () => import('components/task/CompanyTasks'),
);
const ColleaguesPage = lazy(
  () => import('layouts/company/colleagues/NewIndex'),
);
const CompanyAnnouncements = lazy(
  () => import('components/announcement/CompanyAnnouncements'),
);
const CompanyPartners = lazy(
  () => import('../company/associates/Index'),
);
interface ICompanyDashboardProps {
  user: User;
  company: ICompany;
  gettingCompanyDetails: boolean;
  subscriptionExpired: boolean;
}

const Index = (props: ICompanyDashboardProps) => {
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const query = useQuery();
  const tabValue = useMemo(() => {
    return query.get('tab') || '0';
  }, [query]);
  const { company, gettingCompanyDetails } = props;
  const [value, setValue] = useState<number>(parseInt(tabValue));
  const handleChange = (event: ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    setValue(parseInt(tabValue));
  }, [tabValue]);

  const allTabs = [
    { component: <CompanyProjects />, label: 'Projects' },
    { component: <CompanyTasks />, label: 'Tasks' },
    { component: <ColleaguesPage />, label: 'Colleagues' },
    {
      component: <CompanyAnnouncements />,
      label: 'Announcements',
    },
    {
      component: (
        <CompanyPartners
          user={props.user}
          company={props.company}
          subscriptiontExpired={props.subscriptionExpired}
        />
      ),
      label: 'Partners',
      show: companyPermit(props.company.role),
    },
  ];

  return (
    <Container>
      <DashboardP>Company Dashboard</DashboardP>
      <CompanyIconAndName>
        {gettingCompanyDetails ? (
          <TextAvatarSkeleton />
        ) : (
          <TextAvatar name={company.name} />
        )}
        <CompanyOptions>
          {gettingCompanyDetails ? (
            <Skeleton width={140} height={40} />
          ) : (
            <>
              <div className="flex flex-column">
                <CompanyName>{company.name}</CompanyName>
                <Link
                  to={`/company/${company.uniqueName}/profile`}
                  className="profile-link"
                >
                  View Profile
                </Link>
              </div>
              {companyPermit(props.company.role) ? (
                <CompanyEditButton
                  onClick={() => setShowDialog(true)}
                >
                  Edit Company
                </CompanyEditButton>
              ) : null}
            </>
          )}
        </CompanyOptions>
      </CompanyIconAndName>
      <StyledTabs
        value={value}
        onChange={handleChange}
        aria-label="company tabs"
        variant="scrollable"
        scrollButtons="auto"
      >
        {allTabs.map((tab, i) =>
          tab.show !== false ? (
            <StyledTab label={tab.label} key={i} tab={value} />
          ) : null,
        )}
      </StyledTabs>
      {allTabs.map((tab, i) =>
        tab.show !== false ? (
          <TabPanel value={value} index={i} key={i}>
            <Suspense fallback={<SuspenseLoader insideComponent />}>
              {tab.component}
            </Suspense>
          </TabPanel>
        ) : null,
      )}
      {showDialog ? (
        <Dialog
          onClose={() => {
            setShowDialog(!showDialog);
          }}
          isOpen={showDialog}
          className="bg-white"
          canEscapeKeyClose={true}
          canOutsideClickClose={true}
          autoFocus
        >
          <CompanyInfoForm setShowDialog={setShowDialog} />
        </Dialog>
      ) : null}
    </Container>
  );
};

const mapStateToProps = (state: any) => ({
  user: state.userReducer.user,
  company: state.companyReducer.currentCompany,
  gettingCompanyDetails: state.companyReducer.gettingCompanyDetails,
  subscriptionExpired: state.subscriptionReducer.subscriptionExpired,
});

export default connect(mapStateToProps)(Index);
