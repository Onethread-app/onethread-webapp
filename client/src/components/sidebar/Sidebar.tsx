import { useCallback, useState, memo } from 'react';
import { NavLink } from 'react-router-dom';
import { IProject } from 'stores/project/Reducer';
import { ICompanyByUser } from 'stores/user/Reducer';

import logo from 'resources/images/onethread-text.png';
import home from 'resources/images/Home.png';
import companiesIcon from 'resources/images/Companies.png';
import project from 'resources/images/ProjectIcon.png';
import task from 'resources/images/TasksIcon.png';
import upArrow from 'resources/images/upArrow.png';
import downArrow from 'resources/images/downArrow.png';
import star from 'resources/images/Star.png';
import favourites from 'resources/images/favorite.png';
import onethread from 'resources/images/onethread.png';
import {
  Company,
  CompanyContainer,
  Container,
  ContainerBody,
  Favourites,
  Header,
  Item,
} from './Sidebar.styles';

interface Props {
  leftOpen: boolean;
  user: any;
  companies: ICompanyByUser[];
  project: IProject;
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
              <Company
                activeClassName="active-link"
                to={`/company/${company.company?.uniqueName}`}
                bgcolor={getRandomColor()}
                key={company.company?._id}
              >
                <i></i>
                <span className="left-open capitalize">
                  {company.company?.name}
                </span>
              </Company>
            ))}
          </CompanyContainer>
        ) : null}
        <Item to={`/pprojects`} activeClassName="active-link">
          <img src={project} alt="Project icon" />
          <span className="left-open">Projects</span>
        </Item>
        <Item to={`/tasks`} activeClassName="active-link">
          <img src={task} alt="Tasks icon" />
          <span className="left-open">Tasks</span>
        </Item>
        {leftOpen ? (
          <Item to={`/favourites`}>
            <img src={favourites} alt="Files icon" />
          </Item>
        ) : null}
      </ContainerBody>
      <Favourites className="left-open">
        <span className="left-open">Favourites</span>
        <div>
          <img src={star} alt="" />
          Star projects for easy access
        </div>
      </Favourites>
    </Container>
  );
};

export default memo(Sidebar);
