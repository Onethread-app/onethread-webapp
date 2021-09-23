import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { find } from 'lodash';

import moment from 'moment';
import { Card } from '@blueprintjs/core/lib/esm/components/card/card';
import { Popover } from '@blueprintjs/core/lib/esm/components/popover/popover';
import { Menu } from '@blueprintjs/core/lib/esm/components/menu/menu';
import { MenuItem } from '@blueprintjs/core/lib/esm/components/menu/menuItem';
import { Button } from '@blueprintjs/core/lib/esm/components/button/buttons';
import { Dialog } from '@blueprintjs/core/lib/esm/components/dialog/dialog';
import { ButtonGroup } from '@blueprintjs/core/lib/esm/components/button/buttonGroup';

import { ICompany } from 'stores/company/Reducer';
import { Color } from 'stores/UtilsActions';
import NoProjectsFound from 'NoProjectsFound';
import {
  unarchiveProject,
  deleteProject,
  getProjectArchive,
} from '../../../stores/project/Actions';

interface IArchivedProjects {
  company: ICompany;
  archiveProjectList: [];
  role: string;
  optionalRole: any;
  deletingProject: boolean;
  errorOnDeletingProject: string;

  getProjectArchive: () => void;
  unarchiveProject: (id: string) => void;
  deleteProject: (id: string) => void;
}

const ArchivedProjects = (props: IArchivedProjects) => {
  const [deleteProjectIndex, setDeleteProjectIndex] = useState('');
  const [deleteProjectDialog, setDeleteProjectDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  // const permissions = projectRules(props.role, props.optionalRole);

  const checkRoleForUnarchiveProject = (projectId: string) => {
    props.unarchiveProject(projectId);
  };

  const handleDialogBox = async (pid) => {
    setDeleteProjectIndex(pid);
    setDeleteProjectDialog(true);
  };

  const handleDelete = () => {
    if (deleteProjectIndex) {
      props.deleteProject(deleteProjectIndex);
      setLoading(true);
    }
  };

  useEffect(() => {
    props.getProjectArchive();
  }, []);

  useEffect(() => {
    if (
      loading === true
      && props.deletingProject === false
      && props.errorOnDeletingProject === ''
    ) {
      setDeleteProjectIndex('');
      setDeleteProjectDialog(false);
    }
  }, [loading, props.deletingProject, props.errorOnDeletingProject]);

  return (
    <>
      <div className='overflow-auto my-projects'>
        <div className='flex flex-column relative'>
          {props.archiveProjectList.length > 0 ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'repeat(auto-fit, minmax(200px, 265px))',
                gridTemplateRows: 'repeat(2, 135px)',
                gridGap: '10px 10px',
              }}
            >
              {' '}
              {props.archiveProjectList.map((archProject: any) => (
                <div className='pa1' key={archProject._id}>
                  <Card
                    className='h-100'
                    interactive
                    style={{
                      paddingLeft: '0px',
                      paddingBottom: '0px',
                    }}
                  >
                    <div
                      className=''
                      style={{
                        borderLeft: `5px solid 
                ${
                  find(Color, ['code', archProject.color])
                    ? find(Color, ['code', archProject.color])!.value
                    : 'red'
                }`,
                        // TODO use dictionary
                        // borderLeft: '5px solid red',
                        paddingLeft: '20px',
                        marginLeft: '-2px',
                        borderRadius: '3px',
                      }}
                    >
                      <div className='flex'>
                        <h3
                          className='mt0 mb2 flex-grow-1 fw6 overflow-hidden f4'
                          style={{
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                            width: '220px',
                          }}
                        >
                          {archProject.name}
                        </h3>

                        <Popover
                          className='w-10'
                          content={(
                            <Menu className='pa2'>
                              <MenuItem
                                className='pa1'
                                intent='primary'
                                text='Restore Project'
                                onClick={() => checkRoleForUnarchiveProject(
                                  archProject._id,
                                )}
                              />
                              <MenuItem
                                className='pa1'
                                intent='danger'
                                text='Delete Project'
                                onClick={() => handleDialogBox(archProject._id)}
                              />
                            </Menu>
                          )}
                          target={(
                            <Button
                              style={{
                                transform: 'rotate(90deg)',
                                OTransform: 'rotate(90deg)',
                                msTransform: 'rotate(90deg)',
                                WebkitTransform: 'rotate(90deg)',
                              }}
                              icon='more'
                              minimal
                              className='outline-0'
                            />
                          )}
                        />
                      </div>
                      <div className='flex flex-column items-start mt2'>
                        <span
                          className={`bp3-tag modifier ${
                            archProject.status === 'not-started'
                              ? 'bg-blue'
                              : archProject.status === 'ongoing'
                                ? 'bg-orange'
                                : 'bg-green'
                          }`}
                        >
                          {archProject.status.replace(/-|\s/g, ' ')}
                        </span>

                        <p
                          className='f7 fw5'
                          style={{ marginTop: '10px' }}
                        >
                          Deadline:
                          {' '}
                          {archProject.deadline
                            ? moment(archProject.deadline).format(
                              'DD/MM/YYYY',
                            )
                            : 'Not Set'}
                        </p>
                      </div>

                      <h3
                        className='mt0 mb2 flex-grow-1 fw6 overflow-hidden silver'
                        style={{
                          whiteSpace: 'nowrap',
                          textOverflow: 'ellipsis',
                          width: '220px',
                        }}
                      >
                        {archProject.departments.map((dep: any) => (
                          <label style={{ paddingLeft: '2px' }}>
                            {dep.name}
                          </label>
                        ))}
                      </h3>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          ) : (
            <NoProjectsFound />
          )}
        </div>
      </div>

      <Dialog
        isOpen={deleteProjectDialog}
        style={{ paddingBottom: '0' }}
        canOutsideClickClose
      >
        <div
          className='w-100 ba bw1 br2 pa3'
          style={{ borderColor: '#F55B7F' }}
        >
          <h4 style={{ marginBottom: 13 }}>Delete Project</h4>
          <p style={{ marginBottom: 10 }}>
            Are you sure you want to delete this project?
          </p>
          <ButtonGroup
            minimal
            style={{ display: 'flex', flexDirection: 'row-reverse' }}
          >
            <Button
              icon='trash'
              intent='danger'
              onClick={handleDelete}
            >
              Yes. Delete
            </Button>
            <Button
              icon='undo'
              onClick={() => {
                setDeleteProjectIndex('');
                setDeleteProjectDialog(false);
              }}
              intent='primary'
            >
              No. Keep it
            </Button>
          </ButtonGroup>
        </div>
      </Dialog>
    </>
  );
};

const mapStateToProps = (state: any) => ({
  company: state.companyReducer.currentCompany,
  archiveProjectList: state.projectReducer.allArchive,
  role:
    state.projectReducer.projectRole.projects
    && state.projectReducer.projectRole.projects.role,
  optionalRole:
    state.projectReducer.projectRole.projects
    && state.projectReducer.projectRole.projects.project.optionalRole,
  deletingProject: state.projectReducer.deletingProject,
  errorOnDeletingProject: state.projectReducer.errorOnDeletingProject,
});

export default connect(mapStateToProps, {
  unarchiveProject,
  deleteProject,
  getProjectArchive,
})(ArchivedProjects);
