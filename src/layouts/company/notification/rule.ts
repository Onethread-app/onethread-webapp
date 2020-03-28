import companyProfile from '../../../resources/images/sidebarCompanyProfile.svg';
import associates from '../../../resources/images/sideBarAssociates.svg';
import board from '../../../resources/images/sideBarBoard.svg';
import colleague from '../../../resources/images/sidebarTeam.svg';
import project from '../../../resources/images/ProjectsIcon.svg';
import preface from '../../../resources/images/sideBarPreface.svg';
import room from '../../../resources/images/sidebarRoom.svg';
import team from '../../../resources/images/sidebarProjectTeam.svg';
import { store } from 'Store';

const state = store.getState();

export const notificationType = {
  associate: {
    img: associates,
    path: `/company/Company1234/associates`
  },
  companyProfile: {
    img: companyProfile,
    path: `/company/Company1234/associates`
  },
  board: {
    img: board,
    path: `/company/${
      store.getState().companyReducer.currentCompany.name
    }/associates`
  },
  colleague: {
    img: colleague,
    path: `/company/${
      store.getState().companyReducer.currentCompany.name
    }/associates`
  },
  announcement: {
    img: companyProfile,
    path: `/company/${state.companyReducer.currentCompany.name}/associates`
  },
  profile: {
    img: companyProfile,
    path: `/company/${
      store.getState().companyReducer.currentCompany.name
    }/associates`
  },
  project: {
    img: project,
    path: `/company/${state.companyReducer.currentCompany.name}/associates`
  },
  preface: {
    img: preface,
    path: `/company/${state.companyReducer.currentCompany.name}/associates`
  },
  room: {
    img: room,
    path: `/company/${state.companyReducer.currentCompany.name}/associates`
  },
  team: {
    img: team,
    path: `/company/${state.companyReducer.currentCompany.name}/associates`
  },
  task: {
    img: board,
    path: `/company/${state.companyReducer.currentCompany.name}/associates`
  },
  others: {
    img: companyProfile,
    path: `/company/${state.companyReducer.currentCompany.name}/associates`
  }
};
