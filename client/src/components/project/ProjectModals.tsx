import { Dialog } from '@blueprintjs/core';

import { SimpleButton } from 'components/announcement/AnnouncementDialog.styles';
import ContactUs from 'components/contact-us/ContactUs';
import NoSubscriptionDialog from 'components/home/company-section/NoSubsciptionDialog';
import UpdateProjectDialog from 'components/home/project-section/UpdateProjectDialog';
import { Container, SuccessButton } from './Project.styles';
import { IProject } from 'stores/project/Reducer';
import { DangerButton } from './Project.styles';

interface Props {
  modalProps: () => {
    showArchiveProject: boolean;
    setShowArchiveProject: React.Dispatch<
      React.SetStateAction<boolean>
    >;
    handleArchiveProject: () => void;
    showUnarchiveProject: boolean;
    setShowUnarchiveProject: React.Dispatch<
      React.SetStateAction<boolean>
    >;
    handleUnarchiveProject: () => void;
    showUpdateProject: boolean;
    setShowUpdateProject: React.Dispatch<
      React.SetStateAction<boolean>
    >;
    showContactUsDialog: boolean;
    setShowContactUsDialog: React.Dispatch<
      React.SetStateAction<boolean>
    >;
    setShowNoSubscription: React.Dispatch<
      React.SetStateAction<boolean>
    >;
    showDeleteProject: boolean;
    setShowDeleteProject: React.Dispatch<
      React.SetStateAction<boolean>
    >;
    handleDeleteProject: () => void;
    showNoSubscription: boolean;
    setResponse: any;
    setShowSnackbar: React.Dispatch<React.SetStateAction<boolean>>;
    selectedProject: IProject;
  };
}

const ProjectModals = (props: Props) => {
  const {
    showArchiveProject,
    setShowArchiveProject,
    handleArchiveProject,
    showUnarchiveProject,
    setShowUnarchiveProject,
    handleUnarchiveProject,
    showUpdateProject,
    setShowUpdateProject,
    showContactUsDialog,
    setShowContactUsDialog,
    setShowNoSubscription,
    showDeleteProject,
    setShowDeleteProject,
    handleDeleteProject,
    showNoSubscription,
    setResponse,
    setShowSnackbar,
    selectedProject,
  } = props.modalProps();

  return (
    <>
      {showArchiveProject ? (
        <Dialog
          isOpen={showArchiveProject}
          onClose={() => setShowArchiveProject(false)}
          canEscapeKeyClose={true}
          canOutsideClickClose={true}
          className="pb0"
        >
          <Container>
            <div>Do you want to archive this project?</div>
            <div className="w-100 flex justify-center">
              <DangerButton
                className="mr2"
                onClick={handleArchiveProject}
              >
                Yes
              </DangerButton>
              <SimpleButton
                className="ml2"
                onClick={() => {
                  setShowArchiveProject(false);
                }}
              >
                Cancel
              </SimpleButton>
            </div>
          </Container>
        </Dialog>
      ) : null}
      {showUnarchiveProject ? (
        <Dialog
          isOpen={showUnarchiveProject}
          onClose={() => setShowUnarchiveProject(false)}
          canEscapeKeyClose={true}
          canOutsideClickClose={true}
          className="pb0"
        >
          <Container>
            <div>Do you want to unarchive this project?</div>
            <div className="w-100 flex justify-center">
              <SuccessButton
                className="mr2"
                onClick={handleUnarchiveProject}
              >
                Yes
              </SuccessButton>
              <SimpleButton
                className="ml2"
                onClick={() => {
                  setShowUnarchiveProject(false);
                }}
              >
                Cancel
              </SimpleButton>
            </div>
          </Container>
        </Dialog>
      ) : null}
      {showDeleteProject ? (
        <Dialog
          isOpen={showDeleteProject}
          onClose={() => setShowDeleteProject(false)}
          canEscapeKeyClose={true}
          canOutsideClickClose={true}
          className="pb0"
        >
          <Container>
            <div>
              This will delete everything of this project including
              all it's tasks, subtasks, and rooms. Do you still want
              to proceed?
            </div>
            <div className="w-100 flex justify-center">
              <DangerButton
                className="mr2"
                onClick={handleDeleteProject}
              >
                Yes
              </DangerButton>
              <SimpleButton
                className="ml2"
                onClick={() => {
                  setShowDeleteProject(false);
                }}
              >
                Cancel
              </SimpleButton>
            </div>
          </Container>
        </Dialog>
      ) : null}
      {showUpdateProject ? (
        <Dialog
          isOpen={showUpdateProject}
          onClose={() => setShowUpdateProject(false)}
          canEscapeKeyClose={true}
          canOutsideClickClose={true}
          className="pb0 h-auto w-auto"
        >
          <UpdateProjectDialog
            setShowDialog={setShowUpdateProject}
            project={selectedProject}
          />
        </Dialog>
      ) : null}
      {showNoSubscription ? (
        <Dialog
          isOpen={showNoSubscription}
          onClose={() => setShowNoSubscription(false)}
          canEscapeKeyClose={true}
          canOutsideClickClose={true}
          className="pb0 h-auto w-auto"
        >
          <NoSubscriptionDialog
            setShowContactDialog={setShowContactUsDialog}
            setShowNoSubscription={setShowNoSubscription}
          />
        </Dialog>
      ) : null}
      {showContactUsDialog ? (
        <Dialog
          isOpen={showContactUsDialog}
          onClose={() => setShowContactUsDialog(false)}
          canEscapeKeyClose={true}
          canOutsideClickClose={true}
          className="pb0 h-auto w-auto"
        >
          <ContactUs
            setShowContactUs={setShowContactUsDialog}
            setResponse={setResponse}
            setShowSnackbar={setShowSnackbar}
          />
        </Dialog>
      ) : null}
    </>
  );
};

export default ProjectModals;
