import React, { useState, useEffect } from 'react';
import { Button, HTMLSelect , Icon} from '@blueprintjs/core';
import { connect } from 'react-redux';
import { Field, Form } from 'react-final-form';
import { InputGroupField } from 'components/fields/InputGroupField';
import { SubmitError } from 'components/final-form/SubmitError';
import { tokenConfig } from 'stores/UtilsActions';
// import { tigrowApi } from 'config';
import { required } from 'components/final-form/utils';
import { User } from 'stores/user/Reducer';
// import { SuggestFieldWithError } from 'components/fields/SuggestField';
// import { useLiveSearch } from 'components/useLiveSearch';
// import { isEmpty } from 'lodash';
import { createProject } from '../../stores/project/Actions';
import { tigrowApi } from 'config';

interface ProjectAddProps {
  setShowDialog: (val: boolean) => void;
}

interface ProjectAddInternalProps extends ProjectAddProps {
  user?: User;
  createProject: (val: any) => void;
}

export const ProjectAddComponent = (
  props: ProjectAddInternalProps,
) => {

  // const [admins, setAdmins] = useState([]);
  // const [selectedAdmins, setSelectedAdmins] = useState(
  //   [] as Entity[],
  // );
  
  // const [search, setSearch] = useState('');

  // const userRequestFactory = async (userName: string) => {
  //   const headers = tokenConfig();
  //   const response = await tigrowApi.get(
  //     `projects/concern-admin-search/${
  //     company
  //     }?name=${search}`,
  //     headers,
  //   );

  //   return response.data.data.map((e: any) => {
  //     return {
  //       ...e._source.account,
  //       memberId: e._source.mongo_id,
  //     };
  //   });
  // };
  // let result: any = [];
  // result = useLiveSearch(search, userRequestFactory, 0);

  const onSubmit = async (values: any) => {
    await props.createProject(values);
    if (props.setShowDialog) {
      props.setShowDialog(false);
    }
    return {};
  };

  const [roleCompany,setRoleCompany] = useState([]);
  const [, setCompany] = useState('');

  useEffect(() => {

    let getCompanies = async()=>{
      const headers = tokenConfig();
      const response = await tigrowApi.get(
        `company/user-role-company`,
        headers,
      );

      setRoleCompany(response.data);

      console.log(response.data)
      return response.data ;
    }

    getCompanies();


  }, []);

  return (
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
        <form className="pa4-ns pa2" onSubmit={handleSubmit}>
          <SubmitError errorMessage={submitError} />
          <div>
            <h1 className="f5 lh-copy">Create Project</h1>
            <div className="mb4">
              <Field<string>
                name="name"
                validate={required}
                render={({ input, meta }) => (
                  <div className="mb4">
                    <InputGroupField
                      id="name"
                      className={`br0 bb b--lightBlue`}
                      value={input.value}
                      onChange={input.onChange}
                      style={{
                        boxShadow: 'none',
                      }}
                      leftIcon="document"
                      placeHolder="Project Name (required)"
                    />
                  </div>
                )}
              />
            </div>
              <div className="mb4">
                <div className="flex">
                  <div className=" f5 pa1 bb b--lightBlue">
                    <Icon icon={'briefcase'} className="tigrow-lightBlue" />
                  </div>
                  <Field<string>
                    name="company"
                    validate={required}
                    render={({ input, meta }) => (
                      <HTMLSelect
                        fill={true}
                        minimal={true}
                        onChange={(e) => {
                          setCompany(e.target.value);
                          input.onChange(e.target.value);
                        }}
                        value={input.value}
                        className=" bb b--lightBlue"
                        style={{
                          boxShadow: 'none',
                          borderRadius: '0px',
                          backgroundColor: 'white',
                          flex: '1',
                          outline: 'none',
                        }}
                      >
                        <option selected value="">
                          Please select a company
                      </option>
                        {props.user && roleCompany.map((c: any) => (
                          <option value={c.company._id}>{c.company.name}</option>
                        ))}
                      </HTMLSelect>
                    )}
                  />
                </div>
              </div>
              <div>
                {/* <Field<string>
                  name="admin"
                  validate={required}
                  render={({ input, meta }) => (
                    <div
                      className={` ${
                        checkError(meta) ? 'mb3' : 'mb4'
                        }`}
                    >
                      <div className="w-100 pb2">
                        <label>Concerned Admin*</label>
                        <div className="flex mt2">
                          <div className=" f5 pa1">
                            <Icon icon={'user'} className="tigrow-lightBlue" />
                          </div>
                          <SuggestFieldWithError
                            className="ba b--lightBlue"
                            onChange={(query: string) => {
                              setSearch(query);
                            }}
                            items={admins}
                            selectedItems={selectedAdmins}
                            setSelectedItems={(item) => {
                              input.onChange(item);
                              setSelectedAdmins(item);
                            }}
                            multipleItemSelect={false}
                            error={
                              checkError(meta) &&
                              (meta.error || meta.submitError)
                            }
                          />
                        </div>
                      </div>
                      {selectedAdmins.length > 0 && (
                        <div className="w-100">
                          <div
                            className="overflow-auto br2"
                            style={{
                              border: '1px solid #707070',
                              maxHeight: '120px',
                              background: '#707070',
                            }}
                          >
                            {selectedAdmins.map((item) => (
                              <div>
                                <Tag
                                  key={item._id}
                                  className="pa1 ma1"
                                  interactive={true}
                                  style={{ background: '#0fa3a3' }}
                                  onRemove={(e) => {
                                    const filteredItems = selectedAdmins.filter(
                                      (selectedItem) =>
                                        item.name !==
                                        selectedItem.name,
                                    );
                                    setSelectedAdmins([
                                      ...filteredItems,
                                    ]);
                                    input.onChange(
                                      isEmpty(filteredItems)
                                        ? undefined
                                        : filteredItems.map(
                                          (admin: Entity) =>
                                            admin._id,
                                        ),
                                    );
                                  }}
                                  large={true}
                                  intent="primary"
                                >
                                  {item.name}
                                </Tag>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                /> */}
              </div>
          </div>
          <div className="flex justify-end">
            <Button
              className="w4 grow h2 pointer mr3"
              style={{
                background: '#fff',
                outline: 'none',
                border: '1px solid #0fa3a3',
                color: '#0fa3a3',
              }}
              onClick={(e: any) => {
                e.preventDefault();
                props.setShowDialog(false);
              }}
            >
              cancel
            </Button>
            <Button
              className="w4 grow h2 pointer"
              style={{
                background: '#0fa3a3',
                outline: 'none',
                color: 'white',
              }}
              loading={submitting}
              type="submit"
              disabled={submitting || pristine}
            >
              Save
            </Button>
          </div>
        </form>
      )}
    />
  );
};

const mapStateToProps = (state: any) => {
  return {
    user: state.userReducer.user,
  };
};

export const ProjectAdd = connect(
  mapStateToProps,
  {createProject}
)(ProjectAddComponent);
