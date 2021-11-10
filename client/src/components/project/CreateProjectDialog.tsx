import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import styled from 'styled-components';
import _ from 'lodash';

import moment from 'moment';
import CreatableSelect from 'react-select/creatable';
import { DateInput } from '@blueprintjs/datetime/lib/esm/dateInput';
import { Icon } from '@blueprintjs/core/lib/esm/components/icon/icon';

import { ICompanyByUser, User } from 'stores/user/Reducer';
import { saveProjectForm } from 'stores/projectForm/Actions';
import { getAllCompaniesByUserId } from 'stores/user/Actions';
import { createProjectInCompany } from 'stores/project/Actions';
import { Color } from 'stores/UtilsActions';
import {
  createCompanyAction,
  clearErrorOnCompanyCreate,
} from 'stores/company/Actions';

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
  color: #08a0f7;
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
  background: #08a0f7;
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

  createCompanyAction: (val: any) => void;
  clearErrorOnCompanyCreate: () => void;
  companyName: string;
  creatingCompany: boolean;
  errorOnCreatingCompany: string;
  currentCompany: any;
  projectList: () => void;
  saveProjectForm: any;
  previousData: any;
}

const CreateProjectDialog = (props: ICreateProjectDialog) => {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [companyId, setCompanyId] = useState('');
  const [deadline, setDeadline] = useState<Date | null>(null);
  const [labelColor, setLabelColor] = useState<any>(null);
  const [options, setOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [selectValue, setSelectValue] = useState<
    { value: string; label: string }[]
  >([]);
  const [creating, setCreating] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [newCompanyInfo, setNewCompanyInfo] = useState<any>({});
  const [data, setData] = useState<any>({});
  const [defaultValues, setDefaultValues] = useState<any>([]);

  const handleDateChange = (date: Date | null) => {
    setData({ ...data, deadline: date });
    setDeadline(date);
  };

  const handleNameChange = (e: any) => {
    setData({ ...data, name: e.target.value });
    setName(e.target.value);
  };

  const handleCompanyChange = async (selected: any) => {
    setNewCompanyInfo({});
    if (selected.__isNew__) {
      setNewCompanyInfo(selected);
      await props.createCompanyAction({
        name: selected.value,
      });
    } else {
      setCompanyId(selected.value);
      setData({
        ...data,
        value: selected.value,
        label: selected.label,
      });
      setSelectValue([
        {
          value: selected.value,
          label: selected.label,
        },
      ]);
    }
    setErrorMessage('');
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const payload = _.pickBy({
      name,
      companyId,
      deadline,
      color: labelColor,
    });

    if (!payload.companyId) {
      setErrorMessage('Company name is invalid');
    } else if (!payload.name) {
      setErrorMessage('#08A0F7 is required');
    } else {
      props.createProjectInCompany(payload);
      setCreating(true);
      props.projectList();
      props.saveProjectForm({});
    }
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

  useEffect(() => {
    if (newCompanyInfo.__isNew__ && props.currentCompany._id) {
      if (props.currentCompany.name === newCompanyInfo.value) {
        setCompanyId(props.currentCompany._id);
      } else {
        setErrorMessage('Company name is invalid');
      }
    }
  }, [newCompanyInfo, props.currentCompany]);

  useEffect(() => {
    setDefaultValues(props.previousData);
  }, []);

  useEffect(() => {
    props.saveProjectForm(data);
  }, [data]);

  useEffect(() => {
    setLabelColor(defaultValues.color);
    setDeadline(defaultValues.deadline);
    setName(defaultValues.name);
    setCompanyId(defaultValues.value);
    setSelectValue([
      {
        value: defaultValues.value,
        label: defaultValues.label,
      },
    ]);
  }, [defaultValues]);

  return (
    <CONTAINER className="flex flex-column items-center justify-center h-100">
      <HEADER>{t('app.company.Projects.Create-Project')}</HEADER>
      <form
        onSubmit={handleSubmit}
        style={{ width: '100%', padding: '2rem 15%' }}
      >
        {errorMessage && (
          <div
            style={{
              marginBottom: 0,
              paddingBottom: 5,
            }}
          >
            <span style={{ color: 'red' }}>*{errorMessage}</span>
          </div>
        )}

        <CreatableSelect
          value={defaultValues.value && selectValue}
          placeholder={t(
            'app.company.Projects.Create-or-Select-company',
          )}
          id={'companies'}
          options={options}
          onChange={handleCompanyChange}
          formatCreateLabel={(userInput) =>
            `Create company: ${userInput}`
          }
        ></CreatableSelect>

        <TEXTINPUT
          type="text"
          name="project-name"
          id="project-name-from-dialog"
          placeholder={t('app.project.Project-preface.Project-Name')}
          className="w-100"
          onChange={handleNameChange}
          required
          defaultValue={defaultValues.name}
          autoFocus={true}
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
            placeholder={t('app.project.Project-preface.Deadline')}
            className="flex-auto"
          />
        </div>

        <div className="project-label">
          <label
            htmlFor="label"
            style={{ color: 'rgba(0, 0, 0, 0.37)' }}
          >
            {t('app.project.Project-preface.Label')}
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
                    setData({ ...data, color: color.code });
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
          <DONE>{t('app.project.Project-preface.Done')}</DONE>
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
            {t('app.project.Project-preface.Cancel')}
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
  companyName: state.companyReducer.currentCompany.uniqueName,
  currentCompany: state.companyReducer.currentCompany,
  creatingCompany: state.companyReducer.creatingCompany,
  errorOnCreatingCompany: state.companyReducer.errorOnCreatingCompany,
  previousData: state.projectFormReducer.data,
});

export default connect(mapStateToProps, {
  getAllCompaniesByUserId,
  createProjectInCompany,
  createCompanyAction,
  clearErrorOnCompanyCreate,
  saveProjectForm,
})(CreateProjectDialog);
