import {
  ChangeEvent,
  useState,
  lazy,
  Suspense,
  useEffect,
} from 'react';
import { connect } from 'react-redux';
import { Dialog } from '@blueprintjs/core';

import { ICompany } from 'stores/company/Reducer';
import { User } from 'stores/user/Reducer';

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
import { useLocation } from 'react-router';

const CompanyProjects = lazy(
  () => import('components/project/CompanyProjects'),
);
const CompanyTasks = lazy(
  () => import('components/task/CompanyTasks'),
);
const ColleaguesPage = lazy(
  () => import('layouts/company/colleagues/Index'),
);
const CompanyAnnouncements = lazy(
  () => import('components/announcement/CompanyAnnouncements'),
);

interface ICompanyDashboardProps {
  user: User;
  company: ICompany;
  gettingCompanyDetails: boolean;
}

const Index = (props: ICompanyDashboardProps) => {
  const { company, gettingCompanyDetails } = props;
  const [value, setValue] = useState<number>(0);
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const location: {
    pathname: string;
    state: {
      tab: string;
    };
  } = useLocation();
  const tab = location?.state?.tab || '';

  const handleChange = (event: ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  const allTabs = [
    { component: <CompanyProjects />, label: 'Projects' },
    { component: <CompanyTasks />, label: 'Tasks' },
    { component: <ColleaguesPage />, label: 'Collaborators' },
    { label: 'Discussion' },
    {
      component: <CompanyAnnouncements company={props.company} />,
      label: 'Announcements',
    },
  ];

  useEffect(() => {
    if (tab === 'announcement') {
      setValue(4);
    }
  }, [location.state]);

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
              <CompanyName>{company.name}</CompanyName>
              <CompanyEditButton onClick={() => setShowDialog(true)}>
                Edit Company
              </CompanyEditButton>
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
        {allTabs.map((tab, i) => (
          <StyledTab label={tab.label} key={i} />
        ))}
      </StyledTabs>
      {allTabs.map((tab, i) => (
        <TabPanel value={value} index={i} key={i}>
          <Suspense fallback={<SuspenseLoader insideComponent />}>
            {tab.component}
          </Suspense>
        </TabPanel>
      ))}
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
});

export default connect(mapStateToProps)(Index);
