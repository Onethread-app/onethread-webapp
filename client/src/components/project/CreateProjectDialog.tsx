import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import Select from 'react-select';
import styled from 'styled-components';

import { DateInput } from '@blueprintjs/datetime';
import { Color } from 'stores/UtilsActions';
import { Icon } from '@blueprintjs/core';

import { getAllCompaniesByUserId } from 'stores/user/Actions';
import { createProjectInCompany } from 'stores/project/Actions';
import { ICompanyByUser, User } from 'stores/user/Reducer';

const CONTAINER = styled.div`
  form {
    > * {
      margin-bottom: 1rem;
    }

    input {
      border: 1px solid hsl(0, 0%, 80%);
      border-radius: 4px;

      &:nth-child(2) {
        min-height: 38px;
      }

      &:last-child {
        box-shadow: none;
        min-height: 38px;
      }

      ::placeholder,
      ::-webkit-input-placeholder {
        color: #65676d;
      }
      :-ms-input-placeholder {
        color: #65676d;
      }
    }
  }
`;

const HEADER = styled.h3`
  font-weight: 500;
  font-size: 25.168px;
  line-height: 38px;
  color: #0f0c4e;
`;

const TEXTINPUT = styled.input`
  padding: 2px 8px;

  ::placeholder,
  ::-webkit-input-placeholder {
    font-size: 14.5px;
  }
  :-ms-input-placeholder {
    font-size: 14.5px;
  }
`;

const DONE = styled.button`
  background: #0f0c4e;
  color: #fff;
  border-radius: 8.45662px;
  outline: none;
  border: none;
  width: 100%;
  margin-bottom: 0.5rem;
  padding: 12px 0;
`;

interface ICreateProjectDialog {
  user: User;
  companies: ICompanyByUser[];
  projectLoading: boolean;

  setShowDialog: React.Dispatch<React.SetStateAction<boolean>>;
  getAllCompaniesByUserId: (id: string) => void;
  createProjectInCompany: (val: {}) => void;
}

const CreateProjectDialog = (props: ICreateProjectDialog) => {
  const [name, setName] = useState('');
  const [companyId, setCompanyId] = useState('');
  const [deadline, setDeadline] = useState<Date | null>(null);
  const [labelColor, setLabelColor] = useState<any>(null);
  const [options, setOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [creating, setCreating] = useState(false);

  const handleDateChange = (date: Date | null) => {
    setDeadline(date);
  };

  const handleNameChange = (e: any) => {
    setName(e.target.value);
  };

  const handleCompanyChange = (selected: any) => {
    setCompanyId(selected.value);
  };

  useEffect(() => {
    props.getAllCompaniesByUserId(props.user._id);
    setOptions([{ value: '1', label: 'Loading' }]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.user._id]);

  useEffect(() => {
    if (props.companies) {
      const gettingOptionsFromCompanies = props.companies.map(
        (c: ICompanyByUser) => {
          return { value: c.company._id, label: c.company.name };
        },
      );
      setOptions(gettingOptionsFromCompanies);
    } else {
      setOptions([]);
    }
  }, [props.companies]);

  useEffect(() => {
    if (creating === true && props.projectLoading === false) {
      props.setShowDialog(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [creating, props.projectLoading]);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const payload = {
      name,
      companyId,
      deadline,
      color: labelColor,
    };
    props.createProjectInCompany(payload);
    setCreating(true);
  };

  return (
    <CONTAINER className="flex flex-column items-center justify-center h-100">
      <HEADER>Create Project</HEADER>
      <form
        onSubmit={handleSubmit}
        style={{ width: '100%', padding: '2rem 15%' }}
      >
        <Select
          placeholder="Select a company (Required)"
          id={'companies'}
          options={options}
          onChange={handleCompanyChange}
        ></Select>
        <TEXTINPUT
          type="text"
          name="project-name"
          id="project-name-from-dialog"
          placeholder="Project Name (Required)"
          className="w-100"
          onChange={handleNameChange}
          required
        />
        <div className="deadline">
          <DateInput
            formatDate={(date: Date) => date.toLocaleDateString()}
            parseDate={(str: string) => new Date(str)}
            onChange={handleDateChange}
            canClearSelection={false}
            value={deadline}
            popoverProps={{
              targetClassName: 'w-100',
            }}
            maxDate={moment().add(10, 'y').toDate()}
            minDate={new Date()}
            placeholder="Deadline"
            className="flex-auto"
          />
        </div>
        <div className="project-label">
          <label
            htmlFor="label"
            style={{ color: 'rgba(0, 0, 0, 0.37)' }}
          >
            Label
          </label>
          <div className="flex">
            {Color.map((color) => (
              <div className="pr2" key={color.code}>
                <Icon
                  className="br2 flex items-center justify-center h-100"
                  icon={color.code === labelColor ? 'tick' : 'blank'}
                  iconSize={16}
                  onClick={(e) => {
                    e.preventDefault();
                    setLabelColor(color.code);
                  }}
                  style={{
                    backgroundColor: color.value,
                    border:
                      color.code === labelColor
                        ? '3px solid #ffffff'
                        : 'none',
                    height: '27px',
                    width: '27px',
                    borderRadius: '50%',
                  }}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-column items-center w-100">
          <DONE>Done</DONE>
          <p
            className="tc pointer"
            onClick={() => {
              props.setShowDialog(false);
            }}
            style={{
              fontSize: '13.4px',
              lineHeight: '20px',
              color: '#0F0C4E',
            }}
          >
            Cancel
          </p>
        </div>
      </form>
    </CONTAINER>
  );
};

const mapStateToProps = (state: any) => ({
  companies: state.userReducer.user.companies,
  user: state.userReducer.user,
  projectLoading: state.projectReducer.projectLoading,
});

export default connect(mapStateToProps, {
  getAllCompaniesByUserId,
  createProjectInCompany,
})(CreateProjectDialog);
