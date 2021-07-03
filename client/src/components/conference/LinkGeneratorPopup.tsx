import React from 'react';
import styled from 'styled-components';

import Link from 'resources/svg/Link.svg';

const LinkGeneratorPopup = () => {
  const Container = styled.div`
    height: 100%;
  `;

  const H2 = styled.h2`
    font-weight: bold;
    font-size: 21.85px;
    line-height: 33px;
    text-transform: uppercase;
    color: #0f0c4e;
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
    background: #0f0c4e;
    border-radius: 4px;
    height: 38px;
    width: 38px;
  `;

  return (
    <Container className="flex flex-column items-center justify-center">
      <H2>Empowering remote teams</H2>
      <P>Enter team name and Create link</P>
      <div className="flex items-center justify-center">
        <Input
          type="text"
          name="team"
          id="teaminput"
          placeholder="Enter team name"
        />
        <LinkBox className="flex items-center justify-center pointer">
          <img src={Link} alt="" />
        </LinkBox>
      </div>
    </Container>
  );
};

export default LinkGeneratorPopup;
