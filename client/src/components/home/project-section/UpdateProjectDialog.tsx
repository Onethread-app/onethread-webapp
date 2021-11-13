import { useEffect, useState } from 'react';
import { Field, Form } from 'react-final-form';
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
import { IProject } from 'stores/project/Reducer';
import { Color } from 'stores/UtilsActions';
import { updateProject } from 'stores/project/Actions';
import { returnErrorText } from 'helpers/HandleSagaErrors';
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

interface IProps {
  setShowDialog: React.Dispatch<React.SetStateAction<boolean>>;
  project: IProject;
  errorOnUpdatingProject: string;
  updatingProject: boolean;
  updateProject: (project: {
    name;
    color;
    budget;
    currency;
    deadline;
    companyId;
    projectId;
  }) => void;
}

const Index = (props: IProps) => {
  const [checkColor, setCheckColor] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectCurrency, setSelectCurrency] = useState<
    { name: string; symbol: string }[]
  >([]);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [updatingProject, setUpdatingProject] =
    useState<boolean>(false);

  const { t } = useTranslation();

  const onSubmit = async (values: any) => {
    setLoading(true);
    props.updateProject({
      name: values.name,
      color: checkColor,
      budget: values.budget ? Number(values.budget) : 0,
      currency: selectCurrency[0]?.symbol,
      deadline: values.date || undefined,
      companyId: props.project.company._id,
      projectId: props.project._id,
    });
    setSuccessMessage(`The project ${values.name} has been updated}`);
    setUpdatingProject(true);
  };

  const handleCurrencyChange = async (selected: any) => {
    setSelectCurrency([
      {
        name: selected.name,
        symbol: selected.symbol,
      },
    ]);
  };

  useEffect(() => {
    if (props.project.currency) {
      setSelectCurrency([
        ...currencies.filter(
          (currency) => currency.symbol === props.project.currency,
        ),
      ]);
    }
  }, []);

  useEffect(() => {
    if (updatingProject) {
      if (
        props.errorOnUpdatingProject === '' &&
        props.updatingProject === false
      ) {
        props.setShowDialog(false);
        setLoading(false);
        successToaster(successMessage);
        setUpdatingProject(false);
      }
      if (
        props.errorOnUpdatingProject !== '' &&
        props.updatingProject === false
      ) {
        setLoading(false);
        errorToaster(returnErrorText(props.errorOnUpdatingProject));
        setUpdatingProject(false);
      }
    }
  }, [props.errorOnUpdatingProject, props.updatingProject]);

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
              defaultValue={props.project.name}
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
            <div className="w-100 flex flex-row justify-start items-center mr-auto">
              <label className="label">Due date</label>
              <Field<string>
                name="date"
                validate={required}
                defaultValue={String(props.project.deadline)}
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
                          input.value ? new Date(input.value) : null
                        }
                        defaultValue={props.project.deadline}
                        onChange={(date) => {
                          input.onChange(date);
                        }}
                        className="due-date-input due-date-subtask w-60"
                        KeyboardButtonProps={{
                          'aria-label': 'change date',
                        }}
                        placeholder={t(
                          'app.project.Project-boards.Select-date',
                        )}
                        minDate={new Date()}
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
            <div className="w-100 flex flex-row justify-start items-center mt3 mr-auto">
              <div className="w-100 flex mr3 items-center">
                <label className="label">Budget</label>
                <Field<string>
                  name="budget"
                  type="string"
                  defaultValue={`${props.project.budget || 0}`}
                  parse={(value: string) =>
                    value.replaceAll(/[^0-9]/g, '')
                  }
                  render={({ input, meta }) => (
                    <>
                      <input
                        {...input}
                        onChange={(e) => {
                          input.onChange(e.target.value);
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
                    Updating Project{' '}
                    <Spinner className="ml2" size={15} />
                  </>
                ) : (
                  'Update Project'
                )}
              </StyledButton>
              <SimpleButton
                className="h2 pointer"
                onClick={(e: any) => {
                  e.preventDefault();
                  props.setShowDialog(false);
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
  updatingProject: state.companyReducer.updatingProject,
  errorOnUpdatingProject: state.projectReducer.error,
});

export default connect(mapStateToProps, {
  updateProject,
})(Index);
