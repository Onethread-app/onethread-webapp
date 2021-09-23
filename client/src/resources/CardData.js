import task from './LandingImages/task-complete.svg';
import intClient from './LandingImages/international-client.svg';
import business from './LandingImages/business.svg';
import team from './LandingImages/team.svg';
import support from './LandingImages/support.svg';

const CardData = [
  {
    id: 1,
    mainHeader: 'Project Management Tool',
    subHeader: 'Easily Plan, Collaborate, Organize And eliver Projects Of All Sizes, On Time, Using One Project Planning Software With All The Right Tools Put At One Place.',
    icon: task,
    featureType: 'popular',
    features: [
      {
        content: 'KANBAN BOARDS',
      },
      {
        content: 'TASK, SUB-TASK',
      },
      {
        content: 'PROJECT MODERATORS',
      },
      {
        content: 'ANNOUNCEMENT',
      },
    ],
  },
  {
    id: 2,
    mainHeader: 'Work From Home Solution',
    subHeader: 'From Assigning Tasks & Monitoring Your Team’s Performance To Collaborating With Them In A Shared Browser And Video Conference, TiGrow Is A Complete Remote Working Solution.',
    icon: intClient,
    featureType: 'upcoming',
    features: [
      {
        content: 'SHARED BROWSER',
      },
      {
        content: 'GANTT CHART FOR KPI MONITORING',
      },
      {
        content: 'CLOCK IN & OUT',
      },
      {
        content: 'TIME SHEET',
      },
    ],
  },
  {
    id: 3,
    mainHeader: 'Vendor Management Tool',
    subHeader: "From Medium To Large Enterprise Everyone Has To Manage Multiple Vendors For Their Activities, Managing All Those Vendors Wasn't This Much Easier Before.",
    icon: business,
    featureType: 'new',
    features: [
      {
        content: 'QUOTATION REVEALING',
      },
      {
        content: 'DOCUMENTS APPROVAL',
      },
      {
        content: 'SMART CONTRACT',
      },
    ],
  },
  {
    id: 4,
    mainHeader: 'Finding Team Mates',
    subHeader: 'Find The Perfect Team Mate For Your Team Find & Hire Your Remote, Contractual, Full Time Or Part Time Teammate For Any Type Of Projects.',
    icon: team,
    featureType: 'new',
    features: [
      {
        content: 'REQUEST FOR NEW TEAM MATE',
      },
      {
        content: 'PROJECT BASED TIME SHEET FOR PAYMENT',
      },
      {
        content: 'POST YOUR PORTFOLIO SERVICES/SKILLS AND GET HIRED BY COMPANIES',
      },
    ],
  },
  {
    id: 5,
    mainHeader: 'Finding Partners',
    subHeader: 'Search And Find Partner Companies From Around The World And Invite Them To Collaborate With You In TiGrow.',
    icon: support,
    featureType: 'new',
    features: [
      {
        content: 'TECHNOLOGICAL VENDOR SECTION',
      },
      {
        content: 'CHANNEL PARTNER SECTION',
      },
      {
        content: 'DIGITAL MARKETING SECTION',
      },
    ],
  },
];

export default CardData;
