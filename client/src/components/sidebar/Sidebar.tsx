import { useCallback, useState, memo } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { connect } from 'react-redux';

import { IProject } from 'stores/project/Reducer';
import { ICompanyByUser, User } from 'stores/user/Reducer';
import { clearCompanyState } from 'stores/company/Actions';

import logo from 'resources/images/onethread-text.png';
import home from 'resources/images/Home.png';
import companiesIcon from 'resources/images/Companies.png';
import project from 'resources/images/ProjectIcon.png';
import task from 'resources/images/TasksIcon.png';
import upArrow from 'resources/images/upArrow.png';
import downArrow from 'resources/images/downArrow.png';
import star from 'resources/images/Star.png';
// import documents from 'resources/images/favorite.png';
import onethread from 'resources/images/onethread.png';
import {
  ArrayItem,
  CompanyContainer,
  Container,
  ContainerBody,
  Favourites,
  Header,
  Item,
} from './Sidebar.styles';
import { setSubscriptionNotExpire } from 'stores/subscriptionBilling/Actions';

interface Props {
  leftOpen: boolean;
  user: User;
  companies: ICompanyByUser[];
  project: IProject;
  favouriteProjects: any;
  subscriptionExpired: boolean;
  clearCompanyState: () => void;
  setSubscriptionNotExpire: () => void;
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

const Sidebar = (props: Props) => {
  const { user, companies, leftOpen } = props;
  const [showCompanies, setShowCompanies] = useState<boolean>(true);
  const history = useHistory();

  const getRandomInt = (max: number) => {
    return Math.floor(Math.random() * max);
  };

  const getRandomColor = useCallback(() => {
    return Color[getRandomInt(6)]?.value;
  }, []);

  return (
    <Container leftOpen={!leftOpen}>
      <Header>
        <NavLink to={`/${user?.name}/home`}>
          {leftOpen ? (
            <img
              src={onethread}
              className="w-50"
              alt="Onethread Icon"
            />
          ) : (
            <img src={logo} alt="Onethread logo" />
          )}
        </NavLink>
        <hr className="left-open" />
      </Header>
      <ContainerBody>
        <Item
          to={`/${user?.name}/home`}
          activeClassName="active-link"
        >
          <img src={home} alt="Home icon" />
          <span className="left-open">Home</span>
        </Item>
        <Item
          to="#"
          onClick={() => {
            setShowCompanies(!showCompanies);
          }}
        >
          <img src={companiesIcon} alt="Company icon" />
          <span className="left-open">Companies</span>
          <span style={{ marginLeft: 'auto' }} className="left-open">
            {leftOpen === false && showCompanies ? (
              <img src={upArrow} alt="Up arrow icon" />
            ) : leftOpen === false && showCompanies === false ? (
              <img src={downArrow} alt="Down arrow icon" />
            ) : null}
          </span>
        </Item>
        {leftOpen === false && showCompanies ? (
          <CompanyContainer>
            {companies.map((company) => (
              <ArrayItem
                activeClassName="active-link"
                to={`/company/${company.company.uniqueName}`}
                bgcolor={getRandomColor()}
                key={company.company?._id}
                onClick={() => {
                  if (props.subscriptionExpired) {
                    props.clearCompanyState();
                    props.setSubscriptionNotExpire();
                  }
                  history.push(
                    `/company/${company.company.uniqueName}/`,
                  );
                }}
              >
                <i></i>
                <span className="left-open capitalize">
                  {company.company?.name}
                </span>
              </ArrayItem>
            ))}
          </CompanyContainer>
        ) : null}
        <Item to={`/projects`} activeClassName="active-link">
          <img src={project} alt="Project icon" />
          <span className="left-open">Projects</span>
        </Item>
        <Item to={`/tasks`} activeClassName="active-link">
          <img src={task} alt="Tasks icon" />
          <span className="left-open">Tasks</span>
        </Item>
        {/* <Item to={`/documents`}>
          <img src={documents} alt="Document icon" />
          <span className="left-open">Documents</span>
        </Item> */}
      </ContainerBody>
      <Favourites className="left-open">
        <span className="left-open">Favourites</span>
        {props.favouriteProjects?.length > 0
          ? props.favouriteProjects.map(
              (fP: {
                project: {
                  company: { uniqueName: string };
                  _id: string;
                  name: string;
                };
              }) => (
                <ArrayItem
                  activeClassName="active-link"
                  to={`/company/${fP.project.company.uniqueName}/project/${fP.project._id}`}
                  bgcolor={getRandomColor()}
                  key={fP.project._id}
                >
                  <i></i>
                  <span className="left-open capitalize">
                    {fP.project.name}
                  </span>
                </ArrayItem>
              ),
            )
          : null}
        <div>
          <img src={star} alt="" />
          Star projects for easy access
        </div>
      </Favourites>
    </Container>
  );
};

const mapStateToProps = (state: any) => ({
  subscriptionExpired: state.subscriptionReducer.subscriptionExpired,
});

export default connect(mapStateToProps, {
  clearCompanyState,
  setSubscriptionNotExpire,
})(memo(Sidebar));
