import { useEffect, useState } from 'react';
import { Field, Form } from 'react-final-form';
// import Creatable from 'react-select/creatable';
import Creatable from 'react-select/creatable';
import { currencies } from 'currencies.json';
import Select from 'react-select';

import { Spinner } from '@blueprintjs/core/lib/esm/components/spinner/spinner';
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

import CheckIcon from '@material-ui/icons/Check';
import {
  ModalContainer,
  SimpleButton,
  TextInput,
  StyledRadioInput,
  Icon,
  StyledButton,
} from './ProjectSection.styles';
import {
  successToaster,
  errorToaster,
} from 'components/toast/Toaster';
import { SmallTextAvatar } from 'components/avatar/TextAvatar';
import { IProjectFormState } from 'stores/projectForm/Reducer';

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

// interface ICompanyOptions {
//   value: string;
//   label: string;
// }

interface IProps {
  setOpenProjectDialog: React.Dispatch<React.SetStateAction<boolean>>;
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
  // setProjects: React.Dispatch<React.SetStateAction<IProject[]>>;
}

const Index = (props: IProps) => {
  const [checkColor, setCheckColor] = useState<number>(0);
  const [selectValue, setSelectValue] = useState<
    { value: string; label: string }[]
  >([]);
  const [defaultValues, setDefaultValues] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [companyLoading, setCompanyLoading] =
    useState<boolean>(false);
  const [options, setOptions] = useState<
    { value: string; label: string; isSubscribed: boolean }[]
  >([]);
  const [data, setData] = useState<IProjectFormState>({
    ...props.previousData,
  });
  const [company, setCompany] = useState<string>('');
  const [assignedCompanyError, setAssignedCompanyError] =
    useState<boolean>(false);
  const [selectCurrency, setSelectCurrency] = useState<
    { name: string; symbol: string }[]
  >([]);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [creatingProject, setCreatingProject] =
    useState<boolean>(false);

  const { previousData } = props;

  const { t } = useTranslation();

  const onSubmit = async (values: any) => {
    if (company) {
      setLoading(true);
      props.createProjectInCompany({
        name: values.name,
        companyId: company,
        color: checkColor,
        budget: values.budget ? Number(values.budget) : 0,
        currency: selectCurrency[0]?.symbol,
        deadline: values.date || undefined,
        statusList: [{ name: 'Backlog', positionInBoard: 0 }],
      });
      setSuccessMessage(
        `The project ${values.name} has been created in ${selectValue[0]?.label}`,
      );
      setCreatingProject(true);
    } else {
      setAssignedCompanyError(true);
    }
  };

  const handleCurrencyChange = async (selected: any) => {
    setSelectCurrency([
      {
        name: selected.name,
        symbol: selected.symbol,
      },
    ]);
    setData({ ...data, currency: { ...selected } });
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
              isSubscribed: true,
            },
          ]);
          setData({
            ...data,
            company: {
              value: response.data.company._id,
              label: response.data.company.name,
              isSubscribed: true,
            },
          });
          props.getAllCompaniesByUserId(props.user?._id);
          successToaster(
            `The company ${response.data.company.name} has been created`,
          );
        } catch (err) {
          errorToaster(returnErrorText(err));
        }
        setCompanyLoading(false);
      }
    } else {
      setCompany(selected.value);
      setData({
        ...data,
        company: { ...selected },
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
    setData({ ...previousData });
    setSelectValue([{ ...previousData?.company }]);
    setCompany(previousData?.company?.value);
    setSelectCurrency([
      { ...(previousData?.currency || currencies[0]) },
    ]);
    setCheckColor(previousData?.label || 0);
  }, []);

  useEffect(() => {
    props.saveProjectForm(data);
  }, [data]);

  useEffect(() => {
    if (props.companies.length > 0) {
      const gettingOptionsFromCompanies = props.companies
        .filter(
          (c: ICompanyByUser) => c.company.isSubscribed === true,
        )
        .map((c: ICompanyByUser) => ({
          value: c.company._id,
          label: c.company.name,
          uniqueName: c.company.uniqueName,
          isSubscribed: c.company.isSubscribed,
        }));
      setOptions(gettingOptionsFromCompanies);
    }
  }, [props.companies]);

  useEffect(() => {
    setDefaultValues(props.previousData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (company) {
      setAssignedCompanyError(false);
    }
  }, [company]);

  useEffect(() => {
    if (creatingProject) {
      if (
        props.errorOnCreatingProject === '' &&
        props.projectLoading === false
      ) {
        props.saveProjectForm({});
        props.setOpenProjectDialog(false);
        setLoading(false);
        successToaster(successMessage);
        setCreatingProject(false);
      }
      if (
        props.errorOnCreatingProject !== '' &&
        props.projectLoading === false
      ) {
        setLoading(false);
        errorToaster(returnErrorText(props.errorOnCreatingProject));
        setCreatingProject(false);
        setSuccessMessage('');
      }
    }
  }, [props.errorOnCreatingProject, props.projectLoading]);

  return (
    <ModalContainer>
      <h1 className="f5 lh-title mb1">
        {t('app.forms.Start-project.Create-project')}
      </h1>
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
            <Field<string>
              name="name"
              type="text"
              validate={composeValidators(required)}
              render={({ input, meta }) => (
                <div className="w-100 flex flex-row justify-start items-center mt2 h3 mr-auto">
                  <label className="label">Project Name</label>
                  <TextInput
                    {...input}
                    placeholder="Required"
                    hasError={
                      checkError(meta) &&
                      (meta.error || meta.submitError)
                    }
                  />
                </div>
              )}
            />
            <div className="w-100 flex flex-row justify-start items-center mt2 mr-auto">
              <label className="label">Company</label>
              <Creatable
                defaultValue={data?.company}
                value={defaultValues.value && selectValue}
                id="company"
                isLoading={companyLoading}
                options={options}
                onChange={handleCompanyChange}
                className="react-select w-60"
                isOptionDisabled={(option) =>
                  option.isSubscribed === false
                }
                formatCreateLabel={(inputValue: string) => (
                  <div className="w-100 font-bold flex">
                    <div className="h-100 mr2">New</div> {inputValue}
                  </div>
                )}
                createOptionPosition="first"
                formatOptionLabel={(data) => (
                  <div className="flex items-center">
                    {typeof data.label === 'string' ? (
                      <SmallTextAvatar
                        name={data.label.slice(0, 1)}
                      />
                    ) : null}
                    <span className="ml2">{data.label}</span>
                  </div>
                )}
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
              <label className="label">Due date</label>
              <Field<string>
                name="date"
                validate={required}
                type="date"
                render={({ input, meta }) => (
                  <>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <KeyboardDateTimePicker
                        disablePast
                        defaultValue={data?.deadline}
                        inputVariant="outlined"
                        id="date-picker-dialog"
                        format="MM/dd/yyyy"
                        value={
                          input.value ? new Date(input.value) : null
                        }
                        onChange={(date) => {
                          input.onChange(date);
                          setData({
                            ...data,
                            deadline: date,
                          });
                        }}
                        className="due-date-input due-date-subtask w-60"
                        KeyboardButtonProps={{
                          'aria-label': 'change date',
                        }}
                        placeholder={t(
                          'app.project.Project-boards.Select-date',
                        )}
                        minDate={new Date()}
                        // style={{ width: '250px' }}
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
            <div className="w-100 flex flex-row justify-start items-center mr-auto">
              <div className="w-100 flex mr3 items-center">
                <label className="label">Budget</label>
                <Field<string>
                  defaultValue={data?.budget}
                  name="budget"
                  type="string"
                  parse={(value: string) =>
                    value.replaceAll(/[^0-9]/g, '')
                  }
                  render={({ input, meta }) => (
                    <>
                      <input
                        {...input}
                        onChange={(e) => {
                          input.onChange(e.target.value);
                          setData({
                            ...data,
                            budget: e.target.value,
                          });
                        }}
                        value={input.value ?? ''}
                        style={{
                          width: '100%',
                          boxShadow:
                            'rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px',
                          border: 'none',
                          padding: '0.5rem',
                          borderRadius: '0.2rem',
                          height: 'auto',
                        }}
                        placeholder="Enter your budget for this project"
                      />
                    </>
                  )}
                />
              </div>
              <div className="flex w-30">
                {/* <label className=""></label> */}
                <Field<string>
                  name="currency"
                  type="string"
                  render={({ input, meta }) => (
                    <Select
                      value={selectCurrency}
                      id="currency"
                      options={currencies}
                      onChange={handleCurrencyChange}
                      className="react-select w-100"
                      getOptionLabel={(option) => option.name}
                      getOptionValue={(option) => option.symbol}
                    />
                  )}
                />
              </div>
            </div>
            <div className="w-100 flex flex-row justify-start mt3 items-center">
              <label className="label mb3">Label</label>

              {Color.map((color) => (
                <label
                  onClick={() => {
                    setCheckColor(color.code);
                    setData({ ...data, label: color?.code });
                  }}
                  key={color.code}
                  className="pointer mb3 flex items-center mr4"
                >
                  <Icon
                    color={color.value}
                    checked={checkColor === color.code}
                  >
                    <span>
                      <CheckIcon
                        className={`${
                          checkColor === color.code ? 'white' : ''
                        }`}
                      />
                    </span>
                  </Icon>
                  <Field
                    name="label"
                    type="radio"
                    defaultValue={data?.label}
                    component={StyledRadioInput}
                    value={color.code}
                    key={color.code}
                  />
                </label>
              ))}
            </div>
            <div className="flex justify-between">
              <StyledButton
                type="submit"
                className="h2 pointer"
                disabled={loading}
              >
                {loading ? (
                  <>
                    Creating Project{' '}
                    <Spinner className="ml2" size={15} />
                  </>
                ) : (
                  'Create Project'
                )}
              </StyledButton>
              <SimpleButton
                className="h2 pointer"
                onClick={(e: any) => {
                  e.preventDefault();
                  props.setOpenProjectDialog(false);
                  setLoading(false);
                }}
              >
                Cancel
              </SimpleButton>
            </div>
          </form>
        )}
      />
    </ModalContainer>
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
