import { useEffect, useState } from 'react';
import { Field, Form } from 'react-final-form';
import CircularProgress from '@material-ui/core/CircularProgress/CircularProgress';
import Select from 'react-select';
// import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import {
  checkError,
  composeValidators,
  required,
  maxValue,
} from 'components/final-form/utils';
import { ICompanyByUser, User } from 'stores/user/Reducer';
import { getAllCompaniesByUserId } from 'stores/user/Actions';
import {
  addAnnouncement,
  //   addAnnouncementFailure,
  //   addAnnouncementSuccess,
  getCompanyDetails,
} from 'stores/company/Actions';
import {
  ModalContainer,
  SimpleButton,
  StyledButton,
} from './announcementDialog.styles';
import {
  errorToaster,
  successToaster,
} from 'components/toast/Toaster';

interface IProps {
  setOpenAnnouncementDialog: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  user: User;
  companies: ICompanyByUser[];
  getAllCompaniesByUserId: (id: string) => void;
  currentCompany: any;
  addAnnouncement: (arg: string) => void;
  //   addAnnouncementSuccess: () => void;
  //   addAnnouncementFailure: (arg: string) => void;
  getCompanyDetails: (arg: string) => void;
  announcementLoading: boolean;
  announcementError: string;
}

const Index = (props: IProps) => {
  const [selectValue, setSelectValue] = useState<
    { value: string; label: string }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [options, setOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [company, setCompany] = useState<string>('');
  const [assignedCompanyError, setAssignedCompanyError] =
    useState<boolean>(false);

  const onSubmit = async (values: any) => {
    if (company) {
      setLoading(true);
      props.addAnnouncement(values.text);
    } else {
      setAssignedCompanyError(true);
    }
  };

  const handleCompanyChange = async (selected: any) => {
    setCompany(selected.value);
    setSelectValue([
      {
        value: selected.value,
        label: selected.label,
      },
    ]);
    props.getCompanyDetails(selected.uniqueName);
  };

  useEffect(() => {
    if (props.companies.length > 0) {
      const gettingOptionsFromCompanies = props.companies.map(
        (c: ICompanyByUser) => ({
          value: c.company._id,
          label: c.company.name,
          uniqueName: c.company.uniqueName,
        }),
      );
      setOptions(gettingOptionsFromCompanies);
    }
  }, [props.companies]);

  useEffect(() => {
    if (loading) {
      if (
        props.announcementError === '' &&
        props.announcementLoading === false
      ) {
        setLoading(false);
        successToaster(
          'The announcement has been created successfully',
        );
        props.setOpenAnnouncementDialog(false);
      }
      if (
        props.announcementError !== '' &&
        props.announcementLoading === false
      ) {
        setLoading(false);
        errorToaster(props.announcementError);
      }
    }
  }, [props.announcementError, props.announcementLoading]);

  useEffect(() => {
    if (company) {
      setAssignedCompanyError(false);
    }
  }, [company]);

  return (
    <ModalContainer>
      <h3>Company Announcement</h3>
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
            <div className="w-100 flex flex-row justify-start items-center mt3 mr-auto">
              <label className="label mr3">Company:</label>
              <Select
                value={selectValue[0]}
                id="company"
                options={options}
                onChange={handleCompanyChange}
                className="react-select w-100"
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
            <div className="w-100 flex flex-row justify-start items-center mt3 mr-auto">
              <Field
                name="text"
                id="text"
                validate={composeValidators(required, maxValue(500))}
                placeholder="Write something (max 500)"
                render={({ input, meta }) => (
                  <div className="flex flex-column w-100">
                    <div className="flex flex-row items-center">
                      <label className="label">Announcement:</label>
                      {checkError(meta) ? (
                        <small
                          style={{
                            color: 'red',
                            margin: '0 1rem',
                          }}
                        >
                          {meta.error || meta.submitError}
                        </small>
                      ) : null}
                    </div>
                    <textarea
                      {...input}
                      placeholder="Write something (max 500)"
                      className="textarea"
                    />
                  </div>
                )}
              />
            </div>
            <div className="flex flex-row w-100 justify-between items-center mt3">
              <StyledButton type="submit">
                {loading ? (
                  <>
                    Creating Announcement
                    <CircularProgress className="ml2" size={20} />
                  </>
                ) : (
                  'Create Announcement'
                )}
              </StyledButton>
              <SimpleButton
                type="button"
                onClick={() => props.setOpenAnnouncementDialog(false)}
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
  currentCompany: state.companyReducer.currentCompany,
  announcementLoading: state.companyReducer.loading,
  announcementError: state.companyReducer.error,
});

export default connect(mapStateToProps, {
  getAllCompaniesByUserId,
  addAnnouncement,
  //   addAnnouncementSuccess,
  //   addAnnouncementFailure,
  getCompanyDetails,
})(Index);
