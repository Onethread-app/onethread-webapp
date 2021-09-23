import { useEffect, useState } from 'react';
import { withRouter } from 'react-router';
import { useParams, NavLink } from 'react-router-dom';
import { MobileView, isMobileOnly } from 'react-device-detect';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import Axios from 'axios';
import { server } from 'config';

import moment from 'moment';

import { tokenConfig } from 'stores/UtilsActions';

import { Loading } from 'components/Loading';
import Navbar from 'components/navbar/Navbar';
import Table from './Table/Table';

import './index.scss';

export const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

const ProjectInfo = ({
  context,
  data,
  containerStyle = {},
  dataStyle = {},
  dataClassName = '',
}) => (
  <p
    style={{
      fontSize: 18.5,
      fontWeight: 'bold',
      paddingBottom: 4,
      ...containerStyle,
    }}
  >
    {context}
    :
    {' '}
    <span
      style={{ fontWeight: 'normal', ...dataStyle }}
      className={dataClassName}
    >
      {data}
    </span>
  </p>
);

type Order = 'asc' | 'desc';
interface Data {
  name: string;
  status: string;
  dueDate: string;
  assign: string;
  priority: string;
}

const Index = (props: any) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);

  const [name, setName] = useState('');
  const [deadline, setDeadline] = useState('');
  const [status, setStatus] = useState('');
  const [lead, setLead] = useState('');
  const [startingDate, setStartingDate] = useState('');

  const [tasks, setTasks] = useState<any[]>([]);

  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof Data>('dueDate');
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [companyUnqName, setCompanyUnqName] = useState('');

  const { projectId } = useParams<{ projectId: string }>();

  useEffect(() => {
    setIsLoading(true);

    const headers = tokenConfig();
    Axios.get(`${server}projects/overview?pid=${projectId}`, headers)
      .then((res) => {
        const { project } = res.data.response;
        setName(project.name);
        setDeadline(project.deadline);
        setStatus(project.status.toLowerCase());
        setLead(project.lead);
        setStartingDate(project.startingDate);
        setCompanyUnqName(project.companyUniqueName);
        setTasks(res.data.response.tasks);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
      });
  }, []);

  return (
    <div className={isMobileOnly ? 'ph2' : 'ph5'}>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <MobileView>
            <Navbar type='company' />
            <div className='flex justify-between mt5'>
              <NavLink
                exact
                className='bg-black-10 pa2 ma1 br4 tc dark-gray fw6 w-25'
                to={`/company/${props.company.uniqueName}/project/${props.project._id}/overview`}
                activeStyle={{
                  background: '#34b3e9',
                  color: 'white',
                }}
                style={{ color: 'darkGray' }}
              >
                <small style={{ color: 'inherit' }}>
                  {t('app.company.Projects.Overview')}
                </small>
              </NavLink>
              <NavLink
                exact
                className='bg-black-10 pa2 ma1 br4 tc dark-gray fw6 w-25'
                to={`/company/${props.company.uniqueName}/project/${props.project._id}`}
                activeStyle={{
                  background: '#34b3e9',
                  color: 'white',
                }}
                style={{ color: 'darkGray' }}
              >
                <small style={{ color: 'inherit' }}>
                  {t('app.project.Project-preface.Intro')}
                </small>
              </NavLink>
              <NavLink
                exact
                className='bg-black-10 pa2 ma1 br4 tc dark-gray fw6 w-25'
                to={`/company/${props.company.uniqueName}/project/${props.project._id}/room`}
                activeStyle={{
                  background: '#34b3e9',
                  color: 'white',
                }}
                style={{ color: 'darkGray' }}
              >
                <small style={{ color: 'inherit' }}>
                  {t('app.project.Project-rooms.Rooms')}
                </small>
              </NavLink>
              <NavLink
                exact
                className='bg-black-10 pa2 ma1 br4 tc dark-gray fw6 w-25'
                to={`/company/${props.company.uniqueName}/project/${props.project._id}/board`}
                activeStyle={{
                  background: '#34b3e9',
                  color: 'white',
                }}
                style={{ color: 'darkGray' }}
              >
                <small style={{ color: 'inherit' }}>
                  {t('app.project.Project-boards.Board')}
                </small>
              </NavLink>
              <NavLink
                exact
                className='bg-black-10 pa2 ma1 br4 tc dark-gray fw6 w-25'
                to={`/company/${props.company.uniqueName}/project/${props.project._id}/team`}
                activeStyle={{
                  background: '#34b3e9',
                  color: 'white',
                }}
                style={{ color: 'darkGray' }}
              >
                <small style={{ color: 'inherit' }}>
                  {t('app.project.Project-teammates.Team-members')}
                </small>
              </NavLink>
              <NavLink
                exact
                className='bg-black-10 pa2 ma1 br4 tc dark-gray fw6 w-25'
                to={`/company/${props.company.uniqueName}/project/${props.project._id}/settings`}
                activeStyle={{
                  background: '#34b3e9',
                  color: 'white',
                }}
                style={{ color: 'darkGray' }}
              >
                <small style={{ color: 'inherit' }}>
                  {t('app.company.Projects.Project-Settings')}
                </small>
              </NavLink>
            </div>
          </MobileView>

          <div>
            <div>
              <ProjectInfo
                context={t('app.company.Projects.Name')}
                data={name}
              />
              <ProjectInfo
                context={t('app.company.Projects.Beginning')}
                data={moment(startingDate).format('MMM DD, YYYY')}
              />
              <ProjectInfo
                context={t('app.company.Projects.Finish')}
                data={
                  deadline
                    ? moment(deadline).format('MMM DD, YYYY')
                    : 'N/A'
                }
              />
              <ProjectInfo
                context={t('app.company.Projects.Lead')}
                data={lead}
              />
              <ProjectInfo
                context={t('app.company.Projects.Status')}
                data={status.replace(/-|\s/g, ' ')}
                dataStyle={{
                  fontWeight: 'normal',
                  backgroundColor: `${
                    status === 'not-started'
                      ? '#357EDD'
                      : status === 'ongoing'
                        ? '#FF6300'
                        : '#19A974'
                  }`,
                  marginLeft: 5,
                  color: 'white',
                  borderRadius: 5,
                  fontSize: 16.5,
                  textTransform: 'capitalize',
                }}
                dataClassName='ph2 pv1'
              />
            </div>
            <>
              {!tasks.length ? (
                <div className='tc pt3'>
                  <h2>{t('app.company.Projects.Not-available')}</h2>
                </div>
              ) : (
                <>
                  <Table
                    order={order}
                    setOrder={setOrder}
                    orderBy={orderBy}
                    setOrderBy={setOrderBy}
                    selected={selected}
                    setSelected={setSelected}
                    page={page}
                    setPage={setPage}
                    rowsPerPage={rowsPerPage}
                    setRowsPerPage={setRowsPerPage}
                    tasks={tasks}
                    companyUnqName={companyUnqName}
                    projectId={projectId}
                  />
                </>
              )}
            </>
          </div>
        </>
      )}
    </div>
  );
};
const mapStateToProps = (state: any) => ({
  boardList: state.taskIndexReducer.taskReducer.boardList,
  company: state.companyReducer.currentCompany,
  departmentNameLoading: state.companyReducer.departmentNameLoading,
  role:
      state.projectReducer.projectRole.projects
      && state.projectReducer.projectRole.projects.role,
  optionalRole:
      state.projectReducer.projectRole.projects
      && state.projectReducer.projectRole.projects.project.optionalRole,
  user: state.userReducer.user,
  project: state.projectReducer.projectDetails,
  singleProjectLoading: state.projectReducer.singleProjectLoading,
  currentBoard: state.taskIndexReducer.taskReducer.currentBoard,
  fetchingBoards: state.taskIndexReducer.taskReducer.fetchingBoards,
  fetchingBoard: state.taskIndexReducer.taskReducer.fetchingBoard,
  errorOnFetchingBoard:
      state.taskIndexReducer.taskReducer.errorOnFetchingBoard,
  subscriptiontExpired:
      state.subscriptionReducer.subscriptionExpired,
});

export const OverviewPage = connect(
  mapStateToProps,
  {},
)(withRouter(Index));

export default OverviewPage;
