import { CreateDialogList } from './Navbar.styles';

interface Props {
  listProps: () => {
    setOpenCompanyDialog: React.Dispatch<
      React.SetStateAction<boolean>
    >;
    setOpenProjectDialog: React.Dispatch<
      React.SetStateAction<boolean>
    >;
    setOpenTaskDialog: React.Dispatch<React.SetStateAction<boolean>>;
    setOpenAnnouncementDialog: React.Dispatch<
      React.SetStateAction<boolean>
    >;
  };
}

const CreateOptionList = (props: Props) => {
  const {
    setOpenCompanyDialog,
    setOpenProjectDialog,
    setOpenTaskDialog,
    setOpenAnnouncementDialog,
  } = props.listProps();
  return (
    <CreateDialogList>
      <div onClick={() => setOpenCompanyDialog(true)}>Company</div>
      <div onClick={() => setOpenProjectDialog(true)}>Project</div>
      <div onClick={() => setOpenTaskDialog(true)}>Task</div>
      <div onClick={() => setOpenAnnouncementDialog(true)}>
        Announcement
      </div>
      <div>Room</div>
    </CreateDialogList>
  );
};

export default CreateOptionList;
