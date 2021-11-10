import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import moment from 'moment';

import { User } from 'stores/user/Reducer';
import { ICompany } from 'stores/company/Reducer';
import { IProject } from 'stores/project/Reducer';

import Skeleton from '@material-ui/lab/Skeleton/Skeleton';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';

import TextAvatar, {
  TextAvatarSkeleton,
} from 'components/avatar/TextAvatar';
import StatusTag from 'components/project/StatusTag';
import { AlignCenter } from 'components/UtilComponents';

import {
  CompanyIconAndName,
  CompanyName,
  DashboardP,
} from 'layouts/newCompany/Index.styles';
import {
  Container,
  ProjectTop,
  BackButton,
  ProjectHeader,
  ProjectName,
} from './Index.styles';

import BackImg from 'resources/svg/project_back.svg';
import RightImg from 'resources/svg/project_right.svg';
import { ChangeEvent, lazy, Suspense, useState } from 'react';
import { StyledTab, StyledTabs } from 'components/tab/NavTabs';
import TabPanel from 'components/tab/TabPanel';
import SuspenseLoader from 'components/loader/SuspenseLoader';

interface IProjectDashboardProps {
  user: User;
  company: ICompany;
  project: IProject;
  gettingCompanyDetails: boolean;
  singleProjectLoading: boolean;
  errorOnSingleProjectLoading: string;
}

const ProjectTasks = lazy(
  () => import('components/task/ProjectTasks'),
);
const ProjectWiki = lazy(() => import('components/wiki/ProjectWiki'));
const ProjectCollaborators = lazy(
  () => import('components/member/ProjectCollaborators'),
);
const ProjectDiscussion = lazy(
  () => import('components/discussion/ProjectDiscussion'),
);

const Index = (props: IProjectDashboardProps) => {
  const {
    company,
    gettingCompanyDetails,
    project,
    singleProjectLoading,
  } = props;
  const [value, setValue] = useState<number>(0);

  const handleChange = (event: ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  const allTabs = [
    { component: <ProjectTasks />, label: 'Tasks' },
    { component: <ProjectWiki />, label: 'Wiki' },
    { component: <ProjectCollaborators />, label: 'Collaborators' },
    { component: <ProjectDiscussion />, label: 'Discussion' },
  ];

  return (
    <Container>
      <ProjectTop>
        <Link to={`/company/${company.uniqueName}`}>
          <BackButton>
            <img src={BackImg} alt="go back" /> See All Projects
          </BackButton>
        </Link>
        <CompanyIconAndName noMarginBottom>
          {gettingCompanyDetails ? (
            <>
              <TextAvatarSkeleton />
              <Skeleton width={140} height={40} />
            </>
          ) : (
            <>
              <TextAvatar name={company.name} />
              <CompanyName>{company.name}</CompanyName>
            </>
          )}
        </CompanyIconAndName>
      </ProjectTop>
      <DashboardP>PROJECT DETAILS</DashboardP>
      <ProjectHeader>
        {singleProjectLoading ? (
          <Skeleton width={140} height={40} />
        ) : (
          <AlignCenter gap={'.5rem'}>
            <ProjectName>{project.name}</ProjectName>
            <StatusTag status={project.status} />
          </AlignCenter>
        )}
        {singleProjectLoading ? (
          <Skeleton width={140} height={40} />
        ) : (
          <AlignCenter gap={'.5rem'}>
            <CalendarTodayIcon fontSize="small" />
            <span>
              {moment(project.createdAt).format('MMM D, YYYY')}
            </span>
            <img src={RightImg} alt="to" />
            <span>
              {moment(project.deadline).format('MMM D, YYYY')}
            </span>
          </AlignCenter>
        )}
      </ProjectHeader>
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
    </Container>
  );
};

const mapStateToProps = (state: any) => ({
  user: state.userReducer.user,
  company: state.companyReducer.currentCompany,
  gettingCompanyDetails: state.companyReducer.gettingCompanyDetails,
  singleProjectLoading: state.projectReducer.singleProjectLoading,
  errorOnSingleProjectLoading:
    state.projectReducer.errorOnSingleProjectLoading,
  project: state.projectReducer.projectDetails,
});

export default connect(mapStateToProps)(Index);
