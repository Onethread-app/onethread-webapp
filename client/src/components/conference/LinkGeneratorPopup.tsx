import React, { useState } from 'react';
import * as Cookies from 'js-cookie';
import axios from 'axios';
import { tokenConfig } from 'stores/UtilsActions';
import { server } from 'config';
import styled from 'styled-components';
import Validator from 'layouts/videoConferences/utils/Validator';
import Link from 'resources/svg/Link.svg';
import { useTranslation } from 'react-i18next';

const Container = styled.div`
  height: 100%;
`;

const H2 = styled.h2`
  font-weight: bold;
  font-size: 21.85px;
  line-height: 33px;
  text-transform: uppercase;
  color: #34B3E9;
  padding: 0;
  margin: 0;
`;

const P = styled.p`
  font-size: 13.25px;
  line-height: 20px;
  color: #2d2d2d;
`;

const Input = styled.input`
  background: #f0f0f0;
  border-radius: 4px;
  border: none;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  height: 38px;
  width: 290px;
  outline: none;
  padding: 5px 10px;
  text-align: center;
`;

const LinkBox = styled.div`
  background: #34B3E9;
  border-radius: 4px;
  height: 38px;
  width: 38px;
`;

const validate = (val: string) => {
  if (Validator.isNonEmpty(val.trim())) {
    return {
      success: false,
      error: 'Team name cannot be empty!',
    };
  } else if (Validator.minLength(val.trim(), 1)) {
    return {
      success: false,
      error: 'Team name cannot be shorter than 1!',
    };
  } else if (Validator.maxLength(val.trim(), 16)) {
    return {
      success: false,
      error: 'Team name cannot be longer than 16!',
    };
  } else if (Validator.validChar(val.trim())) {
    return {
      success: false,
      error:
        'Only capital or lower-case letter, number and "_" are permitted!',
    };
  } else {
    return {
      success: true,
      error: '',
    };
  }
};

const LinkGeneratorPopup = () => {
  const [teamName, setTeamName] = useState('');
  const [conferenceLink, setConferenceLink] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isValid, setIsValid] = useState(false);
  const { t } = useTranslation();

  const handleChange = (e) => {
    setTeamName(e.target.value);
    const { success, error } = validate(e.target.value);
    setErrorMessage(error);
    setIsValid(success);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };
  const handleSubmit = () => {
    if (isValid && errorMessage === '') {
      console.log(teamName);
      Cookies.set('channel', teamName);
      Cookies.set('baseMode', 'avc');
      Cookies.set('transcode', 'interop');
      Cookies.set('attendeeMode', 'video');
      Cookies.set('videoProfile', '480p_4');

      const host =
        process.env.PUBLIC_URL || `${document.location.host}`;
      const link = host + '/vc/join/?conf=' + window.btoa(teamName);

      const headers = tokenConfig();
      if ((headers.headers as any).Authorization) {
        axios
          .post(
            `${server}video-conferences/save-record`,
            { link: link, name: teamName },
            headers,
          )
          .then((res) => {
            setConferenceLink(link);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
  };

  return (
    <Container className="flex flex-column items-center justify-center">
      <H2>{t('app.Video-Conferences.Empowering-teams')}</H2>
      <P>{t('app.Video-Conferences.Enter-name')}</P>
      {/* <H2>Empowering remote teams</H2>
      <P>Enter team name and Create link</P> */}
      <div className="flex items-center justify-center mt2">
        <Input
          type="text"
          name="team"
          id="teaminput"
          autoFocus
          placeholder={t('app.Video-Conferences.Enter-team-name')}
          // placeholder="Enter team name"
          value={teamName}
          onKeyDown={handleKeyDown}
          onChange={handleChange}
        />
        <LinkBox
          className="flex items-center justify-center pointer"
          onClick={handleSubmit}
          aria-disabled={teamName.length < 1}
        >
          <img src={Link} alt="" />
        </LinkBox>
      </div>
      {errorMessage && <div className="mt2">{errorMessage}</div>}

      {conferenceLink && (
        <div className="mt2 w-55">
          {/* Link: */}
          {t('app.Video-Conferences.Link')}:{' '}
          <a href={conferenceLink} target="_blank" rel="noreferrer">
            {conferenceLink}
          </a>
        </div>
      )}
    </Container>
  );
};

export default LinkGeneratorPopup;
