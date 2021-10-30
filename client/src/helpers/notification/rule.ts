import companyProfile from 'resources/images/sidebarCompanyProfile.svg';
import associates from 'resources/images/sideBarAssociates.svg';
import board from 'resources/images/sideBarBoard.svg';
import colleague from 'resources/images/sidebarTeam.svg';
import project from 'resources/images/ProjectsIcon.svg';
import preface from 'resources/images/sideBarPreface.svg';
import room from 'resources/images/sidebarRoom.svg';
import team from 'resources/images/sidebarProjectTeam.svg';

export const notificationType = {
  associate: {
    img: associates,
    path: async (notification: any) => {
      return `/company/${notification.company.uniqueName}/associates`;
    },
  },
  companyProfile: {
    img: companyProfile,
    path: async (notification: any) => {
      return `/company/${notification.company.uniqueName}`;
    },
  },
  colleague: {
    img: colleague,
    path: async (notification: any) => {
      return `/company/${notification.company.uniqueName}/dashboard`;
    },
  },
  announcement: {
    img: companyProfile,
    path: async (notification: any) => {
      return `/company/${notification.company.uniqueName}/dashboard`;
    },
  },
  profile: {
    img: companyProfile,
    path: async (notification: any) => {
      return `/company/${notification.company.uniqueName}`;
    },
  },
  project: {
    img: project,
    path: async (notification: any) => {
      return `/company/${notification.company.uniqueName}/project`;
    },
  },
  preface: {
    img: preface,
    path: async (notification: any) => {
      return `/company/${notification.company.uniqueName}/project/${notification.project}`;
    },
  },
  board: {
    img: board,
    path: async (notification: any) => {
      return `/company/${notification.company.uniqueName}/project/${notification.project}/board/${notification.board}`;
    },
  },
  room: {
    img: room,
    path: async (notification: any) => {
      return `/company/${notification.company.uniqueName}/project/${notification.project}/room?roomId=${notification.room}&view=default`;
    },
  },
  team: {
    img: team,
    path: async (notification: any) => {
      return `/company/${notification.company.uniqueName}/project/${notification.project}/overview`;
    },
  },

  task: {
    img: board,
    path: async (notification: any) => {
      return `/company/${notification.company.uniqueName}/project/${notification.project}/board/${notification.board}/task/${notification.task}`;
    },
  },
  subtask: {
    img: board,
    path: async (notification: any) => {
      return `/company/${notification.company.uniqueName}/project/${notification.project}/board/${notification.board}/task/${notification.task}`;
    },
  },
  others: {
    img: companyProfile,
    path: async (notification: any) => {
      return `/company/${notification.company.uniqueName}`;
    },
  },
};
