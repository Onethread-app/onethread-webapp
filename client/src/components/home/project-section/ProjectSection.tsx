import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Field, Form } from 'react-final-form';
import Creatable from 'react-select/creatable';
import CircularProgress from '@material-ui/core/CircularProgress/CircularProgress';
import {
  KeyboardDateTimePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import {
  checkError,
  composeValidators,
  required,
} from 'components/final-form/utils';
import { ICompanyByUser, User } from 'stores/user/Reducer';
import { IProject } from 'stores/project/Reducer';
import { Color, tokenConfig } from 'stores/UtilsActions';
import { getAllCompaniesByUserId } from 'stores/user/Actions';
import { createProjectInCompany } from 'stores/project/Actions';
import {
  clearErrorOnCompanyCreate,
  createCompanyActionFailure,
  createCompanyActionSuccess,
} from 'stores/company/Actions';
import { returnErrorText } from 'helpers/HandleSagaErrors';
import { saveProjectForm } from 'stores/projectForm/Actions';
import { tigrowApi } from 'config';

import Hamburger from '../../../resources/images/hamburger.png';
import CheckIcon from '@material-ui/icons/Check';
import {
  Container,
  Header,
  Modal,
  Row,
  SimpleButton,
  TextInput,
  StyledRadioInput,
  Icon,
  StyledButton,
} from './ProjectSection.styles';

interface INewCompanyResponse {
  message: string;
  company: {
    _id: string;
    name: string;
    uniqueName: string;
    type: string;
    email: string;
    address: string;
    legalOwnerName: string;
    legalOwnerMail: string;
    role: string;
  };
}

interface IProps {
  user: User;
  companies: ICompanyByUser[];
  projectLoading: boolean;
  getAllCompaniesByUserId: (id: string) => void;
  createProjectInCompany: (val: {}) => void;
  clearErrorOnCompanyCreate: () => void;
  companyName: string;
  creatingCompany: boolean;
  errorOnCreatingCompany: string;
  errorOnCreatingProject: string;
  currentCompany: any;
  saveProjectForm: any;
  previousData: any;
  allProjects: IProject[];
  createCompanyActionSuccess: (arg: INewCompanyResponse) => void;
  createCompanyActionFailure: (arg: string) => void;
  useToaster: () => {
    showToaster: boolean;
    successMessage: string;
    errorMessage: string;
    setShowToaster: React.Dispatch<React.SetStateAction<boolean>>;
    setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
    setSuccessMessage: React.Dispatch<React.SetStateAction<string>>;
  };
}

const Index = (props: IProps) => {
  const [openProjectDialog, setOpenProjectDialog] =
    useState<boolean>(false);
  const [checkColor, setCheckColor] = useState<number>(0);
  const [options, setOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [selectValue, setSelectValue] = useState<
    { value: string; label: string }[]
  >([]);
  const [data, setData] = useState({});
  const [company, setCompany] = useState<string>('');
  const [defaultValues, setDefaultValues] = useState<any>([]);
  const [projects, setProjects] = useState<IProject[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [companyLoading, setCompanyLoading] =
    useState<boolean>(false);
  const [assignedCompanyError, setAssignedCompanyError] =
    useState<boolean>(false);

  const {
    showToaster,
    setShowToaster,
    setErrorMessage,
    setSuccessMessage,
  } = props.useToaster();

  const { t } = useTranslation();

  const onSubmit = async (values: any) => {
    if (company) {
      setLoading(true);
      props.createProjectInCompany({
        name: values.name,
        deadline: values.date,
        companyId: company,
        color: checkColor,
      });
      setSuccessMessage(
        `The project ${values.name} has been created in ${selectValue[0].label}`,
      );
    } else {
      setAssignedCompanyError(true);
    }
  };

  const handleCompanyChange = async (selected: any) => {
    if (selected.__isNew__) {
      setCompanyLoading(true);
      const headers = tokenConfig();
      if ((headers as any).headers.Authorization) {
        try {
          const response = await tigrowApi.post(
            `company`,
            { name: selected.value },
            headers,
          );
          props.createCompanyActionSuccess(response.data);
          setCompany(response.data.company._id);
          setSelectValue([
            {
              value: response.data.company._id,
              label: response.data.company.name,
            },
          ]);
          setOptions([
            ...options,
            {
              value: response.data.company._id,
              label: response.data.company.name,
            },
          ]);
          props.getAllCompaniesByUserId(props.user?._id);
          setSuccessMessage(
            `The company ${response.data.company.name} has been created`,
          );
          setShowToaster(true);
        } catch (err) {
          props.createCompanyActionFailure(returnErrorText(err));
          setErrorMessage(returnErrorText(err));
          setShowToaster(true);
        }
        setCompanyLoading(false);
      }
    } else {
      setCompany(selected.value);
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
  };

  useEffect(() => {
    if (props.companies.length > 0) {
      const gettingOptionsFromCompanies = props.companies.map(
        (c: ICompanyByUser) => ({
          value: c.company._id,
          label: c.company.name,
        }),
      );
      setOptions(gettingOptionsFromCompanies);
    }
  }, [props.companies]);
  useEffect(() => {
    setDefaultValues(props.previousData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setProjects(props.allProjects);
  }, [props.allProjects]);

  useEffect(() => {
    if (
      props.projectLoading === false &&
      props.errorOnCreatingProject === ''
    ) {
      setLoading(false);
      setOpenProjectDialog(false);
      setShowToaster(true);
    }
    if (
      props.projectLoading === false &&
      props.errorOnCreatingProject !== ''
    ) {
      setLoading(false);
      setSuccessMessage('');
      setErrorMessage(props.errorOnCreatingProject);
      setShowToaster(true);
    }
  }, [props.errorOnCreatingProject, props.projectLoading]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowToaster(false);
      setErrorMessage('');
      setSuccessMessage('');
    }, 3000);
    return () => clearTimeout(timeout);
  }, [showToaster]);

  useEffect(() => {
    if (company) {
      setAssignedCompanyError(false);
    }
  }, [company]);

  return (
    <Container>
      <Header>
        Projects
        <img src={Hamburger} alt="" />
      </Header>
      {projects.length === 0 ? (
        <Row>
          No project has been created.{' '}
          <Link
            to="#"
            onClick={() => setOpenProjectDialog(!openProjectDialog)}
          >
            Create Project
          </Link>
        </Row>
      ) : (
        <Row>
          {projects.length} project found.{' '}
          <Link
            to="#"
            onClick={() => setOpenProjectDialog(!openProjectDialog)}
          >
            Create Project
          </Link>
        </Row>
      )}
      {openProjectDialog ? (
        <Modal>
          <Form
            onSubmit={onSubmit}
            validate={(values: any) => {
              const errors = {} as any;
              return errors;
            }}
            render={({
              handleSubmit,
              form,
              submitting,
              pristine,
              values,
              submitError,
              hasValidationErrors,
              ...rest
            }) => (
              <form onSubmit={handleSubmit}>
                <label>PROJECT</label>
                <Field<string>
                  name="name"
                  type="text"
                  validate={composeValidators(required)}
                  placeholder="Project name"
                  render={({ input, meta }) => (
                    <TextInput
                      {...input}
                      placeholder="Project name"
                      hasError={
                        checkError(meta) &&
                        (meta.error || meta.submitError)
                      }
                    />
                  )}
                />
                <div className="w-100 flex flex-row justify-start items-center mt3 mr-auto">
                  <label className="label">Company:</label>
                  <Creatable
                    value={defaultValues.value && selectValue}
                    id="company"
                    isLoading={companyLoading}
                    options={options}
                    onChange={handleCompanyChange}
                    formatCreateLabel={(userInput) =>
                      `New: ${userInput}`
                    }
                    className="w-100 react-select"
                  />
                </div>
                {assignedCompanyError && (
                  <small
                    style={{
                      color: 'red',
                      margin: '1rem 0rem',
                    }}
                  >
                    Required
                  </small>
                )}
                <div className="w-100 flex flex-row justify-start items-center mt2 h3 mr-auto">
                  <label className="label">Due date:</label>
                  <Field<string>
                    name="date"
                    validate={required}
                    type="date"
                    render={({ input, meta }) => (
                      <>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                          <KeyboardDateTimePicker
                            disablePast
                            inputVariant="outlined"
                            id="date-picker-dialog"
                            format="MM/dd/yyyy"
                            value={
                              input.value
                                ? new Date(input.value)
                                : null
                            }
                            onChange={input.onChange}
                            className="due-date-input due-date-subtask"
                            KeyboardButtonProps={{
                              'aria-label': 'change date',
                            }}
                            placeholder={t(
                              'app.project.Project-boards.Select-date',
                            )}
                            minDate={new Date()}
                            style={{ width: '250px' }}
                          />
                        </MuiPickersUtilsProvider>
                        {checkError(meta) && (
                          <small
                            className="mv3 ml2"
                            style={{ color: 'red' }}
                          >
                            {meta.error || meta.submitError}
                          </small>
                        )}
                      </>
                    )}
                  />
                </div>
                <div className="w-100 flex flex-row justify-start items-center mt2">
                  <label className="label">Label:</label>
                  <div className="w-100 flex flex-row justify-start items-center mt3">
                    {Color.map((color) => (
                      <label
                        onClick={() => {
                          setCheckColor(color.code);
                        }}
                        key={color.code}
                        className="mr3 pointer"
                      >
                        <Icon
                          color={color.value}
                          checked={checkColor === color.code}
                        >
                          <span>
                            <CheckIcon
                              className={`${
                                checkColor === color.code
                                  ? 'white'
                                  : ''
                              }`}
                            />
                          </span>
                        </Icon>
                        <Field
                          name="label"
                          type="radio"
                          component={StyledRadioInput}
                          value={color.value}
                          key={color.code}
                        />
                      </label>
                    ))}
                  </div>
                </div>
                <div className="flex flex-row w-100 justify-between items-center mt3">
                  <StyledButton type="submit">
                    {loading ? (
                      <>
                        Creating Project
                        <CircularProgress className="ml2" size={20} />
                      </>
                    ) : (
                      'Create Project'
                    )}
                  </StyledButton>
                  <SimpleButton
                    type="button"
                    onClick={() => setOpenProjectDialog(false)}
                  >
                    Cancel
                  </SimpleButton>
                </div>
              </form>
            )}
          />
        </Modal>
      ) : null}
      {/* {Boolean(errorMessage && showToaster) ? (
        <ErrorToaster>{errorMessage}</ErrorToaster>
      ) : null}
      {Boolean(successMessage && showToaster) ? (
        <SuccessToaster>{successMessage}</SuccessToaster>
      ) : null} */}
    </Container>
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
  errorOnCreatingProject: state.projectReducer.error,
  previousData: state.projectFormReducer.data,
  allProjects: state.projectReducer.allProjects,
});

export default connect(mapStateToProps, {
  getAllCompaniesByUserId,
  createProjectInCompany,
  clearErrorOnCompanyCreate,
  saveProjectForm,
  createCompanyActionSuccess,
  createCompanyActionFailure,
})(Index);
