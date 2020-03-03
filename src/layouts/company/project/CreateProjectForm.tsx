import React, { useState, useEffect } from 'react';
import { InputGroupFieldWithLabel } from 'components/fields/InputGroupField';
import { Button, Icon, Tag } from '@blueprintjs/core';
import { createBoard } from 'stores/board/Actions';
import { connect } from 'react-redux';
import { Form, Field } from 'react-final-form';
import { checkError, required, composeValidators, maxValue } from 'components/final-form/utils';
import { DropdownFieldErrorWithLabel, DropdownFieldWithError } from 'components/fields/DropdownField';
import { boardColor, Entity } from 'stores/UtilsActions';
import { isEqual, isEmpty } from 'lodash';
import { Condition } from 'components/final-form/Condition';
import { SuggestField } from 'components/fields/SuggestField';
import { ICompanyTeamMembers } from 'stores/company/Reducer';
import { useLiveSearch } from 'components/useLiveSearch';

const FormComponent = (props: {
  setShowProjectDialog: (val: boolean) => void;
  projectType: Entity[];
  // createProject: (project: any) => void;
  // departments: [],
  // company: CompanyModel;
}) => {

  const onSubmit = async (values: any) => {
    window.alert(JSON.stringify(values, undefined, 2));
    // await props.createProject(values);
    if (props.setShowProjectDialog) {
      props.setShowProjectDialog(false);
    }
    return {};
  };

  const [labelColor, setLabelColor] = useState(null as any);
  const [departments, setDepartments]: any = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState([] as Entity[]);
  const [associates, setAssociates]: any = useState([]);
  const [selectedAssociates, setSelectedAssociates] = useState([] as Entity[]);
  const [admins, setAdmins]: any = useState([]);
  const [selectedAdmins, setSelectedAdmins] = useState([] as Entity[]);
  const [search, setSearch] = useState('');

  const userRequestFactory = async (userName: string) => {
    // const headers = tokenConfig();
    // const response = await tigrowApi.get(
    //   `tasks/${props.currentTask!._id}/suggest-member?companyId=${props.company!._id}`,
    //   headers);
    // return response.data;
  };

  let result: any = [];
  result = useLiveSearch(search, userRequestFactory, 800);

  useEffect(() => {
    setDepartments(result);
    setAssociates(result);
    setAdmins(result);
  }, [result]);

  const associateNo = [
    { _id: 'oneToFive', name: '1-5' },
    { _id: 'sixToTen', name: '6-10' },
    { _id: 'elevenToFifteen', name: '11-15' }
  ];

  return (
    <>
      <div className="pl3" style={{ marginTop: '6rem' }}>
        <h3>Create Project</h3>
      </div>
      <Form
        onSubmit={onSubmit}
        render={({ handleSubmit, form, submitting, pristine, values, submitError, hasValidationErrors, ...rest }) => (
          <form
            onSubmit={handleSubmit}
          >
            <div className="pa3 justify-content w-100">
              <Field<string>
                name="name"
                validate={composeValidators(required, maxValue(32))}
                render={({ input, meta }) =>
                  <div className={` ${checkError(meta) ? 'mb2' : 'mb3'}`}>
                    <InputGroupFieldWithLabel
                      id="name"
                      value={input.value}
                      onChange={input.onChange}
                      style={{
                        boxShadow: 'none',
                        fontSize: '18px',
                      }}
                      error={checkError(meta) && (meta.error || meta.submitError)}
                      label="Project Name*"
                    />
                  </div>
                }
              />
              <Field<string>
                name="projectType"
                render={({ input, meta }) =>
                  <div className={` ${checkError(meta) ? 'mb2' : 'mb3'}`}>
                    <DropdownFieldErrorWithLabel
                      id={input.name}
                      selectedValue={input.value}
                      options={
                        props.projectType && props.projectType.length > 0 ?
                          props.projectType : [] as any
                      }
                      onChange={input.onChange}
                      error={checkError(meta) && (meta.error || meta.submitError)}
                      label="ProjectType"
                      className="bn"
                    />
                  </div>
                }
              />
              <Condition
                when="projectType"
                validate={(value => {
                  return [
                    'singleDepartment'
                  ].includes(value);
                })}
              >
                <div className="mb4">
                  <Field<string>
                    name="department"
                    validate={required}
                    render={({ input, meta }) =>
                      <DropdownFieldErrorWithLabel
                        id={input.name}
                        selectedValue={input.value}
                        options={
                          []
                        }
                        onChange={input.onChange}
                        leftIcon="comparison"
                        label="Department Name"
                        error={checkError(meta) && (meta.error || meta.submitError)}
                        className="bn"
                      />
                    }
                  />
                </div>
              </Condition>
              <Condition
                when="projectType"
                validate={(value => {
                  return [
                    'multipleDepartment'
                  ].includes(value);
                })}
              >
                <Field<string>
                  name="department"
                  render={({ input, meta }) =>
                    <div className={` ${checkError(meta) ? 'mb3' : 'mb4'}`}>
                      <div className="fl w-100 pb2">
                        <div className="mb1">
                          <p className="fw5" style={{ fontSize: '.8rem' }}>Department Name</p>
                        </div>
                        <SuggestField
                          onChange={(query: string) => {
                            setSearch(query);
                          }}
                          items={departments}
                          selectedItems={selectedDepartment}
                          setSelectedItems={(item) => {
                            setSelectedDepartment(item);
                            input.onChange(item.map((department: any) => department._id));
                          }}
                          multipleItemSelect={true}
                        />
                      </div>
                      {selectedDepartment.length > 0 &&
                        <div className="w-100">
                          <div
                            className="overflow-auto br2"
                            style={{
                              border: '1px solid #707070',
                              maxHeight: '120px',
                              background: '#707070'
                            }}>
                            {selectedDepartment.map((item) => (
                              <div>
                                <Tag
                                  key={item._id}
                                  className="pa1"
                                  interactive={true}
                                  style={{ background: '#707070' }}
                                  onRemove={(e) => {
                                    const filteredItems = selectedDepartment.filter((selectedItem) => (
                                      item.name !== selectedItem.name
                                    ));
                                    setSelectedDepartment([
                                      ...filteredItems
                                    ]);
                                    input.onChange(
                                      isEmpty(filteredItems) ?
                                        undefined :
                                        filteredItems.map((department: any) => department._id));
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
                      }
                    </div>
                  }
                />
              </Condition>
              <Condition
                when="projectType"
                validate={(value => {
                  return [
                    'associates'
                  ].includes(value);
                })}
              >
                <Field<string>
                  name="associate"
                  render={({ input, meta }) =>
                    <div className={` ${checkError(meta) ? 'mb3' : 'mb4'}`}>
                      <div className="w-100 pb2">
                        <div className="mb1">
                          <p className="fw5" style={{ fontSize: '.8rem' }}>Select Your Associate Companies</p>
                        </div>
                        <SuggestField
                          onChange={(query: string) => {
                            setSearch(query);
                          }}
                          items={associates}
                          selectedItems={selectedAssociates}
                          setSelectedItems={(item) => {
                            setSelectedAssociates(item);
                            input.onChange(item.map((associates: any) => associates._id));
                          }}
                          multipleItemSelect={true}
                        />
                      </div>
                      <div >
                        <div className="flex justify-between pt2">
                          <p className="f7">Name</p>
                          <p className="f7">*Number of Associates</p>
                        </div>
                        <div className="flex justify-between pt2">
                          <Tag
                            // key={item._id}
                            className="pa1"
                            interactive={true}
                            // onRemove={(e) => {
                            //   const filteredItems = selectedAssociates.filter((selectedItem) => (
                            //               item.name !== selectedItem.name
                            //             ));
                            //   setSelectedAssociates([
                            //     ...filteredItems
                            //   ]);
                            //   input.onChange(
                            //     isEmpty(filteredItems) ?
                            //       undefined :
                            //       filteredItems.map((associate: ICompanyTeamMembers) => associate._id));
                            // }}
                            large={true}
                            intent="primary"
                          >
                            ami
                          </Tag>
                          <Field<string>
                            name="associateNo"
                            validate={required}
                            render={({ input, meta }) =>
                              <DropdownFieldWithError
                                id={input.name}
                                selectedValue={input.value}
                                onChange={input.onChange}
                                options={
                                  associateNo
                                }
                                error={checkError(meta) && (meta.error || meta.submitError)}
                                className="bn"
                              />
                            }
                          />
                        </div>
                      </div>
                      <div>
                        <Field<string>
                          name="admin"
                          render={({ input, meta }) =>
                            <div className={` ${checkError(meta) ? 'mb3' : 'mb4'}`}>
                              <div className="fl w-100 pb2">
                                <div className="mb1">
                                  <p className="fw5" style={{ fontSize: '.8rem' }}>Concerned Admin</p>
                                </div>
                                <SuggestField
                                  onChange={(query: string) => {
                                    setSearch(query);
                                  }}
                                  items={admins}
                                  selectedItems={selectedAdmins}
                                  setSelectedItems={(item) => {
                                    setSelectedAdmins(item);
                                    input.onChange(item.map((admins: ICompanyTeamMembers) => admins._id));
                                  }}
                                  multipleItemSelect={true}
                                />
                              </div>
                              {selectedAdmins.length > 0 &&
                                <div className="w-100">
                                  <div
                                    className="overflow-auto br2"
                                    style={{
                                      border: '1px solid #707070',
                                      maxHeight: '120px',
                                      background: '#707070'
                                    }}>
                                    {selectedAdmins.map((item) => (
                                      <div>
                                        <Tag
                                          key={item._id}
                                          className="pa1"
                                          interactive={true}
                                          style={{ background: '#707070' }}
                                          onRemove={(e) => {
                                            const filteredItems = selectedAdmins.filter((selectedItem) => (
                                              item.name !== selectedItem.name
                                            ));
                                            setSelectedAdmins([
                                              ...filteredItems
                                            ]);
                                            input.onChange(
                                              isEmpty(filteredItems) ?
                                                undefined :
                                                filteredItems.map((admins: Entity) => admins._id));
                                          }}
                                          large={true}
                                          intent="primary"
                                        >
                                          {/* {item.name} */}
                                          asdfg
                                        </Tag>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              }
                            </div>
                          }
                        />
                      </div>
                      <div>
                        <Field<string>
                          name="department"
                          render={({ input, meta }) =>
                            <div className={` ${checkError(meta) ? 'mb3' : 'mb4'}`}>
                              <div className="fl w-100 pb2">
                                <div className="mb1">
                                  <p className="fw5" style={{ fontSize: '.8rem' }}>Select Departments</p>
                                </div>
                                <SuggestField
                                  onChange={(query: string) => {
                                    setSearch(query);
                                  }}
                                  items={departments}
                                  selectedItems={selectedDepartment}
                                  setSelectedItems={(item) => {
                                    setSelectedDepartment(item);
                                    input.onChange(item.map((dept: ICompanyTeamMembers) => dept._id));
                                  }}
                                  multipleItemSelect={true}
                                />
                              </div>
                              {selectedDepartment.length > 0 &&
                                <div className="w-100">
                                  <div
                                    className="overflow-auto br2"
                                    style={{
                                      border: '1px solid #707070',
                                      maxHeight: '120px',
                                      background: '#707070'
                                    }}>
                                    {selectedDepartment.map((item) => (
                                      <div>
                                        <Tag
                                          key={item._id}
                                          className="pa1"
                                          interactive={true}
                                          style={{ background: '#707070' }}
                                          onRemove={(e) => {
                                            const filteredItems = selectedDepartment.filter((selectedItem) => (
                                              item.name !== selectedItem.name
                                            ));
                                            setSelectedDepartment([
                                              ...filteredItems
                                            ]);
                                            input.onChange(
                                              isEmpty(filteredItems) ?
                                                undefined :
                                                filteredItems.map((dept: Entity) => dept._id));
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
                              }
                            </div>
                          }
                        />
                      </div>
                      {selectedDepartment.length > 0 &&
                        <div className="w-100">
                          <div
                            className="overflow-auto br2"
                            style={{
                              border: '1px solid #707070',
                              maxHeight: '120px',
                              background: '#707070'
                            }}>
                            {selectedDepartment.map((item) => (
                              <div>
                                <Tag
                                  key={item._id}
                                  className="pa1"
                                  interactive={true}
                                  style={{ background: '#707070' }}
                                  onRemove={(e) => {
                                    const filteredItems = selectedDepartment.filter((selectedItem) => (
                                      item.name !== selectedItem.name
                                    ));
                                    setSelectedDepartment([
                                      ...filteredItems
                                    ]);
                                    input.onChange(
                                      isEmpty(filteredItems) ?
                                        undefined :
                                        filteredItems.map((member: Entity) => member._id));
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
                      }
                    </div>
                  }
                />
              </Condition>
              <Field<string>
                name="color"
                render={({ input, meta }) =>
                  <div className="mb3">
                    <p className="fw5 mb3" style={{ fontSize: '.8rem' }}>Label</p>
                    <div className="flex">
                      {boardColor.map((color) => (
                        <div className="pr2" key={color.code}>
                          <Icon
                            className="br2"
                            icon={isEqual(color.code, labelColor) === true ? 'tick' : 'blank'}
                            onClick={(e) => {
                              e.preventDefault();
                              input.onChange(color.code);
                              setLabelColor(color.code);
                            }}
                            style={{
                              backgroundColor: color.value,
                              border: isEqual(color.code, labelColor) === true ? '3px solid #ffffff' : 'none',
                              height: '3rem',
                              padding: '0.8rem'
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                }
              />
              <div className="flex justify-end mt4" >
                <Button className="w4 grow h2 pointer mr3"
                  style={{ background: '#060517', outline: 'none', color: 'white' }}
                  onClick={(e: any) => {
                    e.preventDefault();
                    props.setShowProjectDialog(false);
                  }}
                >
                  cancel
                  </Button>
                <Button
                  className="w4 grow h2 pointer br0"
                  style={{ background: '#0fa3a3', outline: 'none', color: 'white' }}
                  loading={submitting}
                  type="submit"
                  disabled={submitting || pristine}
                >
                  create
          </Button>
              </div>
            </div>
          </form>
        )
        }
      />
    </>
  );
};

const mapStateToProps = (state: any) => {
  return {
    departments: state.companyReducer.currentCompany.departments,
    company: state.companyReducer.currentCompany
  };
};

export const FormProject = connect(mapStateToProps, { createBoard })(FormComponent);