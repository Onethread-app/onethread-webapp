import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { connect, useDispatch } from 'react-redux';
import Select from 'react-select';
import { Form, Field } from 'react-final-form';
import { Button } from '@blueprintjs/core/lib/esm/components/button/buttons';

import { IRoom } from 'stores/room/Reducer';
import { createRoom } from 'stores/room/Actions';
import { CHANGE_ROOM, room } from 'stores/room/Types';

import {
  required,
  composeValidators,
  maxValue,
} from 'components/final-form/utils';
import { checkError } from 'components/final-form/utils';
import { IProject } from 'stores/project/Reducer';
import { ICompanyByUser } from 'stores/user/Reducer';
import { SmallTextAvatar } from 'components/avatar/TextAvatar';
import { ICompany } from 'stores/company/Reducer';
import { successToaster } from 'components/toast/Toaster';

interface ICreateFormProps {
  setShowDialog: (val: boolean) => void;
}

interface ICreateFormInternalProps extends ICreateFormProps {
  createRoom: (val: any) => void;
  errorOnRoomCreate: string;
  creatingRoom: boolean;
  roomLoading: boolean;
  uniqueCompanyName: string;
  currentRoom: IRoom;
  currentProject?: IProject;
  currentCompany?: ICompany;
  companies: ICompanyByUser[];
  projects: IProject[];
}

const CreateFormComponent: React.FC<any> = (
  props: ICreateFormInternalProps,
) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [submitted, setSubmitted] = useState(false);

  const [company, setCompany] = useState<any>({});
  const [projectLoading, setProjectLoading] =
    useState<boolean>(false);
  const [projectOptions, setProjectOptions] = useState<any>([{}]);
  const [companyOptions, setCompanyOptions] = useState<any>({});
  const [assignedProjectError, setAssignedProjectError] =
    useState(false);
  const [assignedCompanyError, setAssignedCompanyError] =
    useState(false);
  const [project, setProject] = useState<any>([]);

  const handleProject = async (selected: any) => {
    setProject([{}]);
    setProject([
      {
        value: selected.value,
        label: selected.label,
      },
    ]);
  };

  const handleCompany = async (selected: any) => {
    setCompany([
      {
        value: selected.value,
        label: selected.label,
        uniqueName: selected.uniqueName,
        isSubscribed: selected.isSubscribed,
      },
    ]);
    setProject([{}]);
    setProjectLoading(true);
    const optionsProject = props.projects
      .filter(
        (project: IProject) => project.company._id === selected.value,
      )
      .map((project: IProject) => ({
        value: project._id,
        label: project.name,
      }));
    setProjectOptions(optionsProject);
    setProjectLoading(false);
  };

  const onSubmit: any = (values: any) => {
    if (company.length > 0 && !company[0].value) {
      setAssignedCompanyError(true);
    }
    if (project.length > 0 && !project[0].value) {
      setAssignedProjectError(true);
    }
    if (Boolean(company[0]?.value && project[0]?.value) === true) {
      props.createRoom({
        ...values,
        projectId: project[0].value,
        companyId: company[0].value,
      });
      setSubmitted(true);
    }
  };

  useEffect(() => {
    if (props.currentCompany?._id) {
      setCompany([
        {
          value: props.currentCompany._id,
          label: props.currentCompany.name,
          uniqueName: props.currentCompany.uniqueName,
        },
      ]);
    }
    if (props.currentProject?._id) {
      setProject([
        {
          value: props.currentProject._id,
          label: props.currentProject.name,
        },
      ]);
    }
  }, []);

  useEffect(() => {
    const optionsCompany = props.companies.map((company) => {
      return {
        value: company.company._id,
        label: company.company.name,
        uniqueName: company.company.uniqueName,
        isSubscribed: company.company.isSubscribed,
      };
    });
    setCompanyOptions(optionsCompany);
  }, [props.companies]);

  useEffect(() => {
    if (
      submitted === true &&
      props.creatingRoom === false &&
      props.roomLoading === false &&
      props.errorOnRoomCreate === ''
    ) {
      dispatch({ type: CHANGE_ROOM });
      history.push(
        `/company/${props.currentRoom.company.uniqueName}/project/${props.currentRoom.project}?ptab=3&discussion=${props.currentRoom._id}&thread=0`,
      );
      successToaster('Discussion created successfully');
      setSubmitted(false);
      props.setShowDialog(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    props.creatingRoom,
    props.roomLoading,
    submitted,
    props.errorOnRoomCreate,
  ]);

  return (
    <Form
      onSubmit={onSubmit}
      initialValues={{ name: '' }}
      render={({ handleSubmit, submitting, pristine }) => (
        <>
          <form
            className="fl w-100 pa4 pt0 mt4-ns mt5"
            onSubmit={handleSubmit}
          >
            <h1 className="f5">Create Discussion</h1>
            <div className="flex items-center">
              <label className="text-width">Discussion:</label>
              <Field<string>
                name="name"
                validate={composeValidators(required, maxValue(32))}
                render={({ input, meta }) => (
                  <div className="flex flex-column">
                    <input
                      id={input.name}
                      placeholder="Discussion name"
                      value={input.value}
                      onChange={input.onChange}
                      style={{
                        boxShadow: 'none',
                        height: '2rem',
                        borderRadius: '0.25rem',
                        textIndent: '0.5rem',
                        border: '1px solid #e6e6ee6',
                      }}
                    />
                    {checkError(meta) ? (
                      <span>{meta.error || meta.submitError}</span>
                    ) : null}
                  </div>
                )}
              />
            </div>
            <div className="w-100 flex flex-row justify-between items-center mt3 mb3 mr-auto">
              <label className="text-width">Company:</label>
              <Select
                id="company"
                placeholder="Required"
                value={company}
                options={companyOptions}
                onChange={handleCompany}
                className="w-100"
                isOptionDisabled={(option) => {
                  return option.isSubscribed === false;
                }}
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
            {assignedCompanyError ? (
              <small
                style={{
                  color: 'red',
                  margin: '1rem 0rem',
                }}
              >
                Company is required.
              </small>
            ) : null}
            <div className="w-100 flex flex-row justify-between items-center mt2 mb3 mr-auto">
              <label className="text-width">Project:</label>
              <Select
                className="w-100"
                name="projectId"
                value={project}
                options={projectOptions}
                onChange={handleProject}
                isDisabled={
                  projectLoading
                    ? true
                    : company[0]?.value
                    ? false
                    : true
                }
              />
            </div>
            {assignedProjectError ? (
              <small
                style={{
                  color: 'red',
                  margin: '1rem 0rem',
                }}
              >
                Project is required.
              </small>
            ) : null}
            {props.errorOnRoomCreate && (
              <small className="red">{props.errorOnRoomCreate}</small>
            )}
            <div className="flex justify-end mt4">
              <Button
                className="grow h2 pointer white bp3-minimal w4 mr3"
                style={{
                  background: '#08A0F7',
                  outline: 'none',
                  color: 'white',
                }}
                loading={submitting}
                type="submit"
                disabled={
                  submitting ||
                  pristine ||
                  Boolean(company[0]?.value && project[0]?.value) ===
                    false
                }
              >
                Create
              </Button>
              <Button
                className="grow h2 pointer white bp3-minimal w4"
                style={{
                  background: '#fff',
                  outline: 'none',
                  border: '1px solid #08A0F7',
                  color: '#08A0F7',
                }}
                onClick={() => {
                  props.setShowDialog(false);
                  dispatch({ type: room.CLEAR_STATUS_CODE });
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </>
      )}
    />
  );
};

const mapStateToProps = (state: any) => {
  return {
    errorOnRoomCreate: state.roomReducer.errorOnRoomCreate,
    creatingRoom: state.roomReducer.creatingRoom,
    roomLoading: state.roomReducer.loading,
    uniqueCompanyName: state.companyReducer.currentCompany.uniqueName,
    currentRoom: state.roomReducer.currentRoom,
    companies: state.userReducer.user.companies,
    projects: state.projectReducer.userProjects,
  };
};

export const CreateForm = connect(mapStateToProps, {
  createRoom,
})(CreateFormComponent);
