import { IProject } from 'stores/project/Reducer';
import { List } from './Project.styles';

interface Props {
  setShowUpdateProject: React.Dispatch<React.SetStateAction<boolean>>;
  setShowArchiveProject: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  setShowUnarchiveProject: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  setShowDeleteProject: React.Dispatch<React.SetStateAction<boolean>>;
  setShowUpdateproject: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedProject: React.Dispatch<React.SetStateAction<IProject>>;
  project: IProject;
}

const ProjectButtonOptions = (props: Props) => {
  const {
    setShowUpdateProject,
    setSelectedProject,
    setShowUnarchiveProject,
    setShowArchiveProject,
    setShowDeleteProject,
    project,
  } = props;
  return (
    <div className="flex flex-column">
      <List
        onClick={(e) => {
          e.stopPropagation();
          setSelectedProject(project);
          setShowUpdateProject(true);
        }}
        className="mb1"
      >
        Edit
      </List>
      {project.status === 'archived' ? (
        <List
          onClick={(e) => {
            e.stopPropagation();
            setSelectedProject(project);
            setShowUnarchiveProject(true);
          }}
        >
          Unarchive
        </List>
      ) : (
        <List
          onClick={(e) => {
            e.stopPropagation();
            setSelectedProject(project);
            setShowArchiveProject(true);
          }}
        >
          Archive
        </List>
      )}
      <List
        onClick={(e) => {
          e.stopPropagation();
          setSelectedProject(project);
          setShowDeleteProject(true);
        }}
        className="mt1"
      >
        Delete
      </List>
    </div>
  );
};

export default ProjectButtonOptions;
