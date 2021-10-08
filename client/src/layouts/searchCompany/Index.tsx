import { useEffect, useState } from 'react';
import { Field, Form } from 'react-final-form';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';

import {
  getCompanySearchResultStart,
  requestToJoinCompanyStart,
} from 'stores/company/Actions';
import {
  checkError,
  composeValidators,
  required,
} from 'components/final-form/utils';

import CheckIcon from '@material-ui/icons/Check';
import {
  Container,
  FormContainer,
  Row,
  Wrapper,
  Column,
} from './Index.styles';
import {
  StyledButton,
  StyledError,
} from 'components/form-components/Index.styles';

interface Props {
  companyJoinRequestLoading: boolean;
  companySearchResult: any;
  companyJoinRequestFailure: string;
  getCompanySearchResultStart: (arg0: string) => void;
  requestToJoinCompanyStart: (arg0: string) => void;
}

const Index = ({
  companySearchResult,
  companyJoinRequestLoading,
  getCompanySearchResultStart,
  requestToJoinCompanyStart,
  companyJoinRequestFailure,
}: Props) => {
  const history = useHistory();
  const [companyName, setCompanyName] = useState<string>('');
  const [joiningCompany, setJoiningCompany] = useState<string>('');

  const onSubmit = (values: { name: string }) => {
    setCompanyName(values.name);
    getCompanySearchResultStart(values.name);
  };

  const handleJoinCompany = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    requestToJoinCompanyStart(joiningCompany);
  };

  useEffect(() => {
    if (
      !companyJoinRequestLoading &&
      companyJoinRequestFailure === ''
    ) {
      localStorage.removeItem('email');
      history.push('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyJoinRequestLoading, companyJoinRequestFailure]);

  return (
    <Container>
      <FormContainer>
        <header>Search Company</header>
        <p>Let's set up your workspace</p>
        <Form
          onSubmit={onSubmit}
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
              <label>
                What's the name of the Company you want to join?
              </label>
              <Column>
                <Field
                  name="name"
                  validate={composeValidators(required)}
                  render={({ input, meta }) => {
                    return (
                      <Column>
                        <Row>
                          <input {...input} />
                          <StyledButton type="submit">
                            Search
                          </StyledButton>
                        </Row>
                        {checkError(meta) && (
                          <StyledError
                            errorMessage={
                              meta.error || meta.submitError
                            }
                          />
                        )}
                      </Column>
                    );
                  }}
                />
              </Column>
            </form>
          )}
        />
      </FormContainer>
      <Wrapper>
        {companySearchResult?.length > 0 ? (
          <>
            <div>
              Showing {companySearchResult?.length} results for{' '}
              {companyName}
            </div>
            <div>
              <form onSubmit={handleJoinCompany}>
                <div>
                  {companySearchResult?.map(
                    (company: any, index: number) => (
                      <li key={index}>
                        <label>
                          <input
                            type="radio"
                            name="company"
                            value={company}
                            onClick={() => {
                              setJoiningCompany(company.mongo_id);
                            }}
                          />
                          <div className="card">
                            <span>
                              <CheckIcon />
                            </span>
                            <p>{company.name}</p>
                          </div>
                        </label>
                      </li>
                    ),
                  )}
                </div>
                <StyledButton
                  disabled={joiningCompany === '' ? true : false}
                  type="submit"
                >
                  Join Company
                </StyledButton>
              </form>
            </div>
          </>
        ) : joiningCompany !== '' ? (
          <div>No company was found for {companyName} </div>
        ) : null}
      </Wrapper>
    </Container>
  );
};

const mapStateToProps = (state: {
  companyReducer: {
    companySearchResults: any;
    companyJoinRequestLoading: boolean;
    companyJoinRequestFailure: string;
  };
}) => ({
  companySearchResult: state.companyReducer.companySearchResults,
  companyJoinRequestLoading:
    state.companyReducer.companyJoinRequestLoading,
  companyJoinRequestFailure:
    state.companyReducer.companyJoinRequestFailure,
});

export default connect(mapStateToProps, {
  getCompanySearchResultStart,
  requestToJoinCompanyStart,
})(Index);
