import { useEffect, useState } from 'react';
import { Field, Form } from 'react-final-form';
import CircularProgress from '@material-ui/core/CircularProgress/CircularProgress';
import Select from 'react-select';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

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
  addAnnouncementFailure,
  addAnnouncementSuccess,
  getCompanyDetails,
} from 'stores/company/Actions';
import {
  ModalContainer,
  SimpleButton,
  StyledButton,
} from './AnnouncementDialog.styles';
import {
  AnnouncementToaster,
  errorToaster,
} from 'components/toast/Toaster';
import { tigrowApi } from 'config';
import { formTokenConfig } from 'stores/UtilsActions';
import { returnErrorText } from 'helpers/HandleSagaErrors';

interface IProps {
  setOpenAnnouncementDialog: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  setOpenCompanyDialog: React.Dispatch<React.SetStateAction<boolean>>;
  user: User;
  companies: ICompanyByUser[];
  getAllCompaniesByUserId: (id: string) => void;
  currentCompany: any;
  addAnnouncement: (arg: string) => void;
  getCompanyDetails: (arg: string) => void;
  announcementLoading: boolean;
  announcementError: string;
  addAnnouncementSuccess: (response) => void;
  addAnnouncementFailure: (error) => void;
}

interface ICompanyOptionProps {
  value: string;
  label: string;
  uniqueName: string;
}

const Index = (props: IProps) => {
  const [selectValue, setSelectValue] = useState<
    ICompanyOptionProps[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [options, setOptions] = useState<ICompanyOptionProps[]>([]);
  const [company, setCompany] = useState<string>('');
  const [assignedCompanyError, setAssignedCompanyError] =
    useState<boolean>(false);

  const onSubmit = async (values: any) => {
    if (company) {
      setLoading(true);
      const headers = formTokenConfig(company);
      try {
        const response = await tigrowApi.post(
          `company/${company}/announcements`,
          { text: values.text },
          headers,
        );
        setLoading(false);
        AnnouncementToaster({
          name: selectValue[0].label,
          uniqueName: selectValue[0].uniqueName,
        });
        props.addAnnouncementSuccess(response.data.newAnnouncement);
        props.setOpenAnnouncementDialog(false);
      } catch (error) {
        setLoading(false);
        errorToaster(returnErrorText(error));
        props.addAnnouncementFailure(returnErrorText(error));
      }
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
        uniqueName: selected.uniqueName,
      },
    ]);
    // props.getCompanyDetails(selected.uniqueName);
  };

  useEffect(() => {
    if (props.companies.length > 0) {
      // const gettingOptionsFromCompanies = props.companies.map(
      //   (c: ICompanyByUser) => ({
      //     value: c.company._id,
      //     label: c.company.name,
      //     uniqueName: c.company.uniqueName,
      //   }),
      // );
      const filteredOptionsFromCompanies = props.companies
        .filter(
          (c: ICompanyByUser) =>
            (c.role === 'superAdmin' || c.role === 'admin') &&
            c.company.isSubscribed === true,
        )
        .map((c: ICompanyByUser) => ({
          value: c.company._id,
          label: c.company.name,
          uniqueName: c.company.uniqueName,
        }));
      setOptions(filteredOptionsFromCompanies);
    }
  }, [props.companies]);

  // useEffect(() => {
  //   if (loading) {
  //     if (
  //       props.announcementError === '' &&
  //       props.announcementLoading === false
  //     ) {
  //       setLoading(false);
  //       successToaster(
  //         'The announcement has been created successfully',
  //       );
  //       props.setOpenAnnouncementDialog(false);
  //     }
  //     if (
  //       props.announcementError !== '' &&
  //       props.announcementLoading === false
  //     ) {
  //       setLoading(false);
  //       errorToaster(props.announcementError);
  //     }
  //   }
  // }, [props.announcementError, props.announcementLoading]);

  useEffect(() => {
    if (company) {
      setAssignedCompanyError(false);
    }
  }, [company]);

  return (
    <ModalContainer>
      {options.length > 0 ? (
        <>
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
                    validate={composeValidators(
                      required,
                      maxValue(500),
                    )}
                    placeholder="Write something (max 500)"
                    render={({ input, meta }) => (
                      <div className="flex flex-column w-100">
                        <div className="flex flex-row items-center">
                          <label className="label">
                            Announcement:
                          </label>
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
                          className="textarea pa2"
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
                    onClick={() =>
                      props.setOpenAnnouncementDialog(false)
                    }
                  >
                    Cancel
                  </SimpleButton>
                </div>
              </form>
            )}
          />
        </>
      ) : props.companies.length > 0 ? (
        <div>
          <p>
            You do not have permission to create an announcement to
            any of your company.{' '}
            <Link
              to="#"
              onClick={() => {
                props.setOpenAnnouncementDialog(false);
                props.setOpenCompanyDialog(true);
              }}
            >
              Create a company?
            </Link>
          </p>
        </div>
      ) : props.companies.length === 0 ? (
        <div>
          You do not have a company yet.{' '}
          <Link
            to="#"
            onClick={() => {
              props.setOpenAnnouncementDialog(false);
              props.setOpenCompanyDialog(true);
            }}
          >
            Create a company?
          </Link>
        </div>
      ) : (
        <></>
      )}
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
  addAnnouncementSuccess,
  addAnnouncementFailure,
  getCompanyDetails,
})(Index);
