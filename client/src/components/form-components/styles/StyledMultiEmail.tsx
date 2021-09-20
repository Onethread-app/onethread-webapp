import { SetStateAction, useRef, useState } from 'react';

import styled from 'styled-components';

import StyledError from './StyledError';

interface Props {
  emails: string[];
  setEmails: (email: string[]) => {};
  name: string;
  placeholder?: string;
}

const StyledDiv = styled.div`
  border: 2px gray solid;
  border-radius: 6px;
  width: 100%;
  height: 4rem;
  padding: 4px;
  display: flex;
  flex-wrap: wrap;
  overflow-y: auto;
  gap: 1rem;

  & div {
    padding: 2px 8px;
    border-radius: 1rem;
    margin: 0 2px;
    border: 2px gray solid;
    margin: 0 4px;
    height: 1.5rem;
    width: fit-content;
  }

  & input {
    min-height: 1.5rem;
    max-width: 95%;
    max-height: 95%;
    border-color: transparent;
    outline: transparent;
  }

  & input:focus {
    border-color: transparent;
    outline: transparent;
    border: none;
    height: 1.5rem;
  }

  button {
    color: black;
    background-color: transparent;
    border: none;
    font-size: 1rem;
    cursor: pointer;
  }
`;

const ReactMultiEmail = ({
  emails,
  setEmails,
  name,
  placeholder,
}: Props) => {
  const [input, setInput] = useState<string>('');
  const [errors, setErrors] = useState<string>('');

  const inputRef = useRef<HTMLInputElement | null>(null);

  const isInList = (email: string) => {
    return emails.includes(email);
  };

  const isEmail = (email: string) => {
    const emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    return emailRegex.test(email);
  };

  const isValid = (email: string) => {
    let error = '';

    if (isInList(email)) {
      error = `${email} has already been added.`;
    }

    if (!isEmail(email)) {
      error = `${email} is not a valid email address.`;
    }

    if (error) {
      setErrors(error);
      return false;
    }

    return true;
  };

  const handleKeyDown = (evt: {
    key: string;
    preventDefault: () => void;
  }) => {
    if (['Enter', 'Tab', ',', ' '].includes(evt.key)) {
      evt.preventDefault();

      let value = input.trim();

      if (value && isValid(value)) {
        setEmails([...emails, value]);
        setInput('');
        value = '';
      }
    }
  };

  const handleChange = (evt: {
    target: { value: SetStateAction<string> };
  }) => {
    setInput(evt.target.value);
    setErrors('');
  };

  const handleDelete = (item: string) => {
    setEmails(emails.filter((email) => email !== item));
  };

  const handlePaste = (evt: {
    preventDefault: () => void;
    clipboardData: { getData: (arg0: string) => string };
  }) => {
    evt.preventDefault();

    const paste = evt.clipboardData.getData('text');
    const pastedEmails = paste.match(/[\w\d-]+@[\w\d-]+\.[\w\d-]+/g);

    if (pastedEmails) {
      const toBeAdded = pastedEmails.filter(
        (email: string) => !isInList(email),
      );

      setEmails([...emails, ...toBeAdded]);
    }
  };
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
      }}
    >
      <StyledDiv
        onFocus={() => {
          inputRef.current.focus();
        }}
        onClick={() => {
          inputRef.current.focus();
        }}
      >
        {emails.map((email) => (
          <div key={email}>
            {email}
            <button
              type="button"
              className="button"
              onClick={() => handleDelete(email)}
            >
              &times;
            </button>
          </div>
        ))}

        <input
          ref={inputRef}
          name={name}
          type="email"
          placeholder={placeholder ?? ''}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          onChange={handleChange}
          value={input}
        />
      </StyledDiv>
      {errors && <StyledError errorMessage={errors}></StyledError>}
    </div>
  );
};

export default ReactMultiEmail;
