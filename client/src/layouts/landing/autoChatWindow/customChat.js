import React from 'react';
import ChatBot from 'react-simple-chatbot';
import { ThemeProvider } from 'styled-components';
import ChatBotImage from '../../../resources/homepageImages/chatBot.png';

export default function CustomChatbot(props) {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');

  props.getChatUserInfo(name, email);
  const theme = {
    background: 'white',
    fontFamily: 'Helvetica, sans-serif',
    headerBgColor: '#827397',
    headerFontColor: '#fff',
    headerFontSize: '20px',
    botBubbleColor: '#ff6363',
    botFontColor: '#fff',
    userBubbleColor: '#fff',
    userFontColor: '#4c4c4c',
  };
  const steps = [
    {
      id: 'Greet',
      message: 'Welcome to TiGrow!',
      asMessage: true,
      trigger: 'Ask Name',
    },
    {
      id: 'Ask Name',
      message: 'Please type your name?',
      asMessage: true,
      trigger: 'name',
    },
    {
      id: 'name',
      user: true,
      validator: (value) => {
        if (value === '') {
          return 'You did not type anything';
        }
        return true;
      },
      trigger: 'userName',
    },
    {
      id: 'userName',
      message: ({ previousValue, steps }) => {
        setName(previousValue);
        return `Hi ${previousValue}! welcome back. Hope you're having a good day, Thank you very
        much for visiting us again. Let's get you started with TiGrow!
        Collaborate with your Team and Connect with your External
        Stakeholders for Free in TiGrow today!`;
      },
      trigger: ({ value, steps }) => 'askOption',
    },
    {
      id: 'askOption',
      message: 'Still not sure about using TiGrow today?',
      trigger: 'optionsForQ1',
    },
    {
      id: 'optionsForQ1',
      options: [
        {
          value: 1,
          label: 'I would like to know more about TiGrow',
          trigger: 'emailAsk',
        },
        {
          value: 2,
          label: 'Setup a meeting with our sales team',
          trigger: 'emailAsk',
        },
      ],
    },
    {
      id: 'emailAsk',
      message:
        'Please leave us your mail address! Our sales team will contact with you.',
      trigger: 'email',
    },
    {
      id: 'email',
      user: true,
      validator: (value) => {
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!re.test(String(value).toLowerCase())) {
          return 'Please enter a valid email';
        }
        return true;
      },
      trigger: 'Done',
    },
    {
      id: 'Done',
      message: ({ previousValue, steps }) => {
        setEmail(previousValue);
        return `Thanks ${steps.name.message}, Glad to know you !!`;
      },
      end: true,
    },
  ];
  return (
    <div>
      <ThemeProvider theme={theme}>
        <ChatBot
          botAvatar={ChatBotImage}
          floating={true}
          steps={steps}
          headerTitle="TiGrow"
          width="400px"
        />
      </ThemeProvider>
    </div>
  );
}
