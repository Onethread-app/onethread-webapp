import companyProfile from '../../../resources/images/sidebarCompanyProfile.svg';
import associates from '../../../resources/images/sideBarAssociates.svg';
import board from '../../../resources/images/sideBarBoard.svg';
import colleague from '../../../resources/images/sidebarTeam.svg';
import project from '../../../resources/images/ProjectsIcon.svg';
import preface from '../../../resources/images/sideBarPreface.svg';
import room from '../../../resources/images/sidebarRoom.svg';
import team from '../../../resources/images/sidebarProjectTeam.svg';
import { store } from 'Store';

// const state = store.getState();

export const notificationType = {
  associate: {
    img: associates,
    path: async () => {
      const companyName = await store.getState().companyReducer.currentCompany
        .name;
      return `/company/${companyName}/associates`;
    }
  },
  companyProfile: {
    img: companyProfile,
    path: async () => {
      const companyName = await store.getState().companyReducer.currentCompany
        .name;
      return `/company/${companyName}`;
    }
  },
  colleague: {
    img: colleague,
    path: async () => {
      const companyName = await store.getState().companyReducer.currentCompany
        .name;
      return `/company/${companyName}/team`;
    }
  },
  announcement: {
    img: companyProfile,
    path: async () => {
      const companyName = await store.getState().companyReducer.currentCompany
        .name;
      return `/company/${companyName}/dashboard`;
    }
  },
  profile: {
    img: companyProfile,
    path: async () => {
      const companyName = await store.getState().companyReducer.currentCompany
        .name;
      return `/company/${companyName}`;
    }
  },
  project: {
    img: project,
    path: async () => {
      const companyName = await store.getState().companyReducer.currentCompany
        .name;
      return `/company/${companyName}/project`;
    }
  },
  preface: {
    img: preface,
    path: async (notification: any) => {
      const companyName = await store.getState().companyReducer.currentCompany
        .name;
      return `/company/${companyName}/project/${notification.project._id}`;
    }
  },
  board: {
    img: board,
    path: async (notification: any) => {
      const companyName = await store.getState().companyReducer.currentCompany
        .name;
      return `/company/${companyName}/project/${notification.project._id}/board`;
    }
  },
  room: {
    img: room,
    path: async (notification: any) => {
      const companyName = await store.getState().companyReducer.currentCompany
        .name;
      return `/company/${companyName}/project/${notification.project._id}/room`;
    }
  },
  team: {
    img: team,
    path: async (notification: any) => {
      const companyName = await store.getState().companyReducer.currentCompany
        .name;
      return `/company/${companyName}/project/${notification.project._id}/team`;
    }
  },
  task: {
    img: board,
    path: async (notification: any) => {
      const companyName = await store.getState().companyReducer.currentCompany
        .name;
      return `/company/${companyName}/project`;
    }
  },
  others: {
    img: companyProfile,
    path: async () => {
      const companyName = await store.getState().companyReducer.currentCompany
        .name;
      return `/company/${companyName}`;
    }
  }
};
