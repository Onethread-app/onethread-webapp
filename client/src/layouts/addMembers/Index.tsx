import { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { CSVReader } from 'react-papaparse';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import {
  getCompanyPublicInformation,
  inviteColleagueInBulk,
} from 'stores/company/Actions';

import { SubmitError } from 'components/final-form/SubmitError';
import useElementSize from 'helpers/hooks/useElementSize';

import AttachmentIcon from '@material-ui/icons/Attachment';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import WhatsAppIcon from '@material-ui/icons/WhatsApp';
import OnethreadLogo from '../../resources/images/onethread-text.png';

import {
  Container,
  FormContainer,
  ImageContainer,
  Logo,
  Modal,
  SmallContainer,
  TextLink,
  StyledText,
  StyledLinkContainer,
  SmallText,
  Row,
  StyledButton,
} from './Index.styles';
import { StyledMultiEmail } from 'components/form-components/Index.styles';

interface IProps {
  inviteColleagueInBulk: (arg0: string[]) => void;
  company: any;
  invitingLoading: boolean;
  getCompanyPublicInformation: (arg0: string) => void;
}

const Index = (props: IProps) => {
  const {
    inviteColleagueInBulk,
    company,
    invitingLoading,
    getCompanyPublicInformation,
  } = props;
  const [emails, setEmails] = useState<string[]>([]);
  const [csvEmails, setCsvEmails] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [companyName, setCompanyName] = useState<string>('');
  const [companyId, setCompanyId] = useState<string>(
    JSON.parse(localStorage.getItem('currentCompanyId')!),
  );
  const history = useHistory();

  const linkRef = useRef<HTMLInputElement | null>(null);
  const containerRef = useRef(null);
  const containerSize = useElementSize(containerRef);

  const { t } = useTranslation();

  const handleOnDrop = (data: any[]) => {
    const getDataWithEmails = data.filter((item) =>
      Boolean(item?.data?.email),
    );
    if (getDataWithEmails.length > 0) {
      setEmails([
        ...emails,
        ...getDataWithEmails.map((item) => {
          return item.data?.email;
        }),
      ]);
      setModalOpen(false);
    } else {
      setError('No valid email found.');
    }
  };

  const handleOnError = (
    err: any,
    file: any,
    inputElem: any,
    reason: any,
  ) => {
    setError(err);
  };

  const handleOnRemoveFile = () => {
    setCsvEmails([]);
  };

  const onSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    inviteColleagueInBulk(emails);
  };

  const handleInviteWithCSV = () => {
    inviteColleagueInBulk(csvEmails);
    setLoading(true);
  };

  useEffect(() => {
    if (!localStorage.getItem('currentCompanyId')!) {
      history.push('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (
      companyId !==
      JSON.parse(localStorage.getItem('currentCompanyId')!)
    ) {
      setCompanyId(
        JSON.parse(localStorage.getItem('currentCompanyId')!),
      );
    }
  }, [companyId]);

  useEffect(() => {
    if (company?.name === '') {
      setCompanyName(
        JSON.parse(localStorage.getItem('currentCompany')!),
      );
      getCompanyPublicInformation(companyId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [company?.name]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsCopied(false);
    }, 3000);

    return () => clearTimeout(timeout);
  }, [isCopied]);

  useEffect(() => {
    if (loading && emails.length > 0 && !invitingLoading) {
      setEmails([]);
      setLoading(false);
    }
    if (loading && csvEmails.length > 0 && !invitingLoading) {
      setCsvEmails([]);
      setLoading(false);
      setModalOpen(false);
    }
  }, [csvEmails.length, emails.length, invitingLoading, loading]);

  useEffect(() => {
    if (
      company?.pendingMembers?.length > 0 ||
      (company?.members?.length > 1 && invitingLoading === false)
    ) {
      localStorage.removeItem('currentCompany');
      localStorage.removeItem('currentCompanyId');
      history.push('/signin');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    company?.members?.length,
    company?.pendingMembers?.length,
    invitingLoading,
  ]);

  return (
    <Container>
      <FormContainer ref={containerRef}>
        <Logo to="/">
          One<span>Thread</span>
        </Logo>
        <TextLink to="/create-company">
          <KeyboardBackspaceIcon /> Back
        </TextLink>
        <header>
          {company?.name || companyName} has been created
        </header>
        <p>Invite collaborators to be part of your company.</p>
        <StyledText>Link to share</StyledText>
        <Row>
          <StyledLinkContainer>
            <input
              type="text"
              ref={linkRef}
              readOnly
              value={`${window.location.host}/join/${company?._id}`}
            />
            <StyledButton
              onClick={async () => {
                linkRef?.current?.select();
                const link = `${window.location.host}/join/${
                  company?._id || companyId
                }`;
                setIsCopied(true);
                if ('clipboard' in navigator) {
                  await navigator.clipboard.writeText(link);
                } else {
                  document.execCommand('copy', true, link);
                }
              }}
            >
              {isCopied ? 'Copied' : 'Copy Link'}
            </StyledButton>
          </StyledLinkContainer>
          <a
            href={`whatsapp://send?text=${
              window.location.host
            }/join/${company?._id || companyId}`}
            data-action="share/whatsapp/share"
          >
            <WhatsAppIcon
              style={{
                fontSize: '36px',
                color: 'green',
                cursor: 'pointer',
              }}
            />
          </a>
        </Row>
        <Row>
          <StyledText>Invite People</StyledText>
        </Row>
        {error && <SubmitError errorMessage={error} />}
        <form onSubmit={onSubmit}>
          <StyledMultiEmail
            emails={emails || []}
            setEmails={async (data) => setEmails([...data])}
            name=""
            placeholder=""
          />
          <SmallText>
            Add upto 100 emails separated by space and comma{' '}
          </SmallText>
          <Row>
            <SmallContainer>
              <StyledButton type="submit">Invite</StyledButton>{' '}
              <StyledButton
                onClick={() => {
                  setModalOpen(!modalOpen);
                }}
                type="button"
              >
                CSV
              </StyledButton>
            </SmallContainer>
            <SmallContainer>
              <TextLink
                to="#"
                onClick={() => {
                  localStorage.removeItem('currentCompany');
                  localStorage.removeItem('currentCompanyId');
                  history.push('/');
                }}
              >
                Skip
              </TextLink>
            </SmallContainer>
          </Row>
        </form>
        {modalOpen ? (
          <Modal>
            <CSVReader
              onDrop={handleOnDrop}
              onError={handleOnError}
              addRemoveButton
              config={{
                header: true,
              }}
              onRemoveFile={handleOnRemoveFile}
            >
              <span
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <AttachmentIcon />
                Drop CSV file here or click to upload.
              </span>
            </CSVReader>
            <SmallContainer>
              <span>
                Keep your emails inside a column named 'email'
              </span>
            </SmallContainer>
            <SmallContainer>
              <StyledButton
                disabled={csvEmails.length === 0}
                onClick={handleInviteWithCSV}
              >
                {t('app.project.Tasks.View')}
              </StyledButton>
              <StyledButton
                data-button="danger"
                type="button"
                onClick={() => setModalOpen(false)}
              >
                {t('app.project.Project-preface.Cancel')}
              </StyledButton>
            </SmallContainer>
          </Modal>
        ) : null}
      </FormContainer>
      <ImageContainer height={containerSize.height}>
        <Logo to="/">
          <img src={OnethreadLogo} alt="Onethread logo" />
        </Logo>
        <h3>
          {t('landing.login.about-one-thread-login.content-login')}
        </h3>
      </ImageContainer>
    </Container>
  );
};

const mapStateToProps = (state: any) => ({
  company: state.companyReducer.currentCompany,
  invitingLoading: state.companyReducer.invitingColleague,
});

export default connect(mapStateToProps, {
  inviteColleagueInBulk,
  getCompanyPublicInformation,
})(Index);
