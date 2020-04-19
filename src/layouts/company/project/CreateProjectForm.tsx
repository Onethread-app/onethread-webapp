import React, { useState, useEffect } from 'react';
import { InputGroupFieldWithLabel } from 'components/fields/InputGroupField';
import { Button, Icon, Tag } from '@blueprintjs/core';
import { connect } from 'react-redux';
import { Form, Field } from 'react-final-form';
import {
  checkError,
  required,
  composeValidators,
  maxValue
} from 'components/final-form/utils';
import { DropdownFieldErrorWithLabel } from 'components/fields/DropdownField';
import { Color, Entity } from 'stores/UtilsActions';
import { isEqual, isEmpty } from 'lodash';
import { Condition } from 'components/final-form/Condition';
import { SuggestFieldWithError } from 'components/fields/SuggestField';
import { ICompany } from 'stores/company/Reducer';
import { useLiveSearch } from 'components/useLiveSearch';
import { createProject } from '../../../stores/project/Actions';
import { getAllDepartments } from '../../../stores/company/Actions';
import { tigrowApi } from 'config';
import { tokenConfig } from 'stores/UtilsActions';
import { Associate } from 'stores/associate/Reducer';
import arrayMutators from 'final-form-arrays';
import { FieldArray } from 'react-final-form-arrays';

const FormComponent = (props: {
  setShowProjectDialog: (val: boolean) => void;
  departments: [];
  createProject: any;
  company: ICompany;
  associates: Associate[];
}) => {
  const [labelColor, setLabelColor] = useState(null as any);
  const [selectedDepartment, setSelectedDepartment] = useState([] as Entity[]);
  const [selectedAssociates, setSelectedAssociates] = useState([] as Entity[]);
  const [admins, setAdmins] = useState([]);
  const [selectedAdmins, setSelectedAdmins] = useState([] as Entity[]);
  const [search, setSearch] = useState('');

  const onSubmit = async (values: any) => {
    await props.createProject(values, selectedAdmins);
    if (props.setShowProjectDialog) {
      props.setShowProjectDialog(false);
    }
    return {};
  };

  const userRequestFactory = async (userName: string) => {
    const headers = tokenConfig();
    const response = await tigrowApi.get(
      `projects/concern-admin-search/${props.company!._id}?name=${search}`,
      headers
    );

    return response.data.data.map((e: any) => {
      return {
        ...e._source.account,
        memberId: e._source.mongo_id
      };
    });
  };

  let result: any = [];
  result = useLiveSearch(search, userRequestFactory, 0);

  useEffect(() => {
    setAdmins(result);
  }, [result]);

  return (
    <>
      <div className="pl3" style={{ marginTop: '6rem' }}>
        <h3>Create Project</h3>
      </div>
      <Form
        onSubmit={onSubmit}
        mutators={{
          ...arrayMutators
        }}
        render={({
          handleSubmit,
          form: {
            mutators: { push, pop }
          },
          form,
          submitting,
          pristine,
          values,
          submitError,
          hasValidationErrors,
          ...rest
        }) => (
          <form onSubmit={handleSubmit}>
            <div className="pa3 justify-content w-100">
              <Field<string>
                name="name"
                validate={composeValidators(required, maxValue(32))}
                render={({ input, meta }) => (
                  <div className={` ${checkError(meta) ? 'mb2' : 'mb3'}`}>
                    <InputGroupFieldWithLabel
                      id="name"
                      value={input.value}
                      onChange={input.onChange}
                      style={{
                        boxShadow: 'none',
                        fontSize: '18px'
                      }}
                      error={
                        checkError(meta) && (meta.error || meta.submitError)
                      }
                      label="Project Name*"
                    />
                  </div>
                )}
              />
              <div>
                <Field<string>
                  name="admin"
                  validate={required}
                  render={({ input, meta }) => (
                    <div className={` ${checkError(meta) ? 'mb2' : 'mb3'}`}>
                      <div className="w-100 pb2">
                        <div className="mb1">
                          <p className="fw5" style={{ fontSize: '.8rem' }}>
                            Concerned Admin
                          </p>
                        </div>
                        <SuggestFieldWithError
                          onChange={(query: string) => {
                            setSearch(query);
                          }}
                          items={admins}
                          selectedItems={selectedAdmins}
                          setSelectedItems={item => {
                            input.onChange(item);
                            setSelectedAdmins(item);
                          }}
                          multipleItemSelect={false}
                          error={
                            checkError(meta) && (meta.error || meta.submitError)
                          }
                        />
                      </div>
                      {selectedAdmins.length > 0 && (
                        <div className="w-100">
                          <div
                            className="overflow-auto br2"
                            style={{
                              border: '1px solid #707070',
                              maxHeight: '120px',
                              background: '#707070'
                            }}
                          >
                            {selectedAdmins.map(item => (
                              <div>
                                <Tag
                                  key={item._id}
                                  className="pa1 ma1"
                                  interactive={true}
                                  style={{ background: '#0fa3a3' }}
                                  onRemove={e => {
                                    const filteredItems = selectedAdmins.filter(
                                      selectedItem =>
                                        item.name !== selectedItem.name
                                    );
                                    setSelectedAdmins([...filteredItems]);
                                    input.onChange(
                                      isEmpty(filteredItems)
                                        ? undefined
                                        : filteredItems.map(
                                            (admin: Entity) => admin._id
                                          )
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
                />
              </div>
              <div className="flex flex-column">
                <Field<string>
                  name="department"
                  validate={required}
                  render={({ meta, input }) => (
                    <div className={` ${checkError(meta) ? 'mb3' : 'mb4'}`}>
                      <div className="fl w-100 pb2">
                        <div className="mb1">
                          <p className="fw5" style={{ fontSize: '.8rem' }}>
                            Select Departments
                          </p>
                        </div>
                        <SuggestFieldWithError
                          onChange={(query: string) => {
                            // setSearch(query);
                          }}
                          items={props.departments}
                          selectedItems={selectedDepartment}
                          setSelectedItems={item => {
                            // input.onChange(item);
                            setSelectedDepartment(item);
                            input.onChange(item.map((dept: any) => dept._id));
                          }}
                          multipleItemSelect={true}
                          error={
                            checkError(meta) && (meta.error || meta.submitError)
                          }
                        />
                      </div>
                      {selectedDepartment.length > 0 && (
                        <div className="w-100">
                          <div
                            className="overflow-auto br2"
                            style={{
                              border: '1px solid #707070',
                              maxHeight: '120px',
                              background: '#707070'
                            }}
                          >
                            {selectedDepartment.map(item => (
                              <div>
                                <Tag
                                  key={item._id}
                                  className="pa1"
                                  interactive={true}
                                  style={{ background: '#707070' }}
                                  onRemove={e => {
                                    const filteredItems = selectedDepartment.filter(
                                      selectedItem =>
                                        item.name !== selectedItem.name
                                    );
                                    setSelectedDepartment([...filteredItems]);
                                    input.onChange(
                                      isEmpty(filteredItems)
                                        ? undefined
                                        : filteredItems.map(
                                            (dept: Entity) => dept._id
                                          )
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
                />
                <Field<string>
                  name="projectType"
                  validate={required}
                  render={({ input, meta }) => (
                    <div className={` ${checkError(meta) ? 'mb2' : 'mb3'}`}>
                      <DropdownFieldErrorWithLabel
                        id={input.name}
                        selectedValue={input.value}
                        options={[
                          { _id: 'associates', name: 'Associates' },
                          { _id: 'sd', name: 'Single Department' },
                          { _id: 'md', name: 'Multiple Department' }
                        ]}
                        onChange={input.onChange}
                        error={
                          checkError(meta) && (meta.error || meta.submitError)
                        }
                        label="ProjectType"
                        className="bn"
                      />
                    </div>
                  )}
                />
              </div>

              <Condition
                when="projectType"
                validate={value => {
                  return ['associates'].includes(value);
                }}
              >
                <div>
                  <p className="fw5" style={{ fontSize: '.8rem' }}>
                    Select Your Associate Companies
                  </p>
                  <SuggestFieldWithError
                    onChange={(query: string) => {
                      setSearch(query);
                    }}
                    items={props.associates.map(
                      associate => associate.associateCompany
                    )}
                    selectedItems={selectedAssociates}
                    setSelectedItems={item => {
                      const c = item.pop();
                      push('associates', {
                        _id: c._id,
                        name: c.name
                      });
                      setSelectedAssociates(item);
                    }}
                    multipleItemSelect={true}
                  />
                  <FieldArray name="associates">
                    {({ fields }) =>
                      fields.map((name, index) => (
                        <div className="flex justify-between mt1">
                          <div style={{ marginRight: '2px' }}>
                            {fields.value[index].name}
                          </div>
                          <div>
                            <Field<string>
                              name={`${name}.size`}
                              component="select"
                              placeholder="size"
                            >
                              <option value="5">1-5</option>
                              <option value="10">6-10</option>
                              <option value="15">11-15</option>
                            </Field>

                            <span
                              onClick={() => fields.remove(index)}
                              style={{ cursor: 'pointer' }}
                            >
                              ❌
                            </span>
                          </div>
                        </div>
                      ))
                    }
                  </FieldArray>
                </div>
              </Condition>
              <Field<string>
                name="color"
                render={({ input, meta }) => (
                  <div className="mb3 mt3">
                    <p className="fw5 mb3" style={{ fontSize: '.8rem' }}>
                      Label
                    </p>
                    <div className="flex">
                      {Color.map(color => (
                        <div className="pr2" key={color.code}>
                          <Icon
                            className="br2"
                            icon={
                              isEqual(color.code, labelColor) === true
                                ? 'tick'
                                : 'blank'
                            }
                            onClick={e => {
                              e.preventDefault();
                              input.onChange(color.code);
                              setLabelColor(color.code);
                            }}
                            style={{
                              backgroundColor: color.value,
                              border:
                                isEqual(color.code, labelColor) === true
                                  ? '3px solid #ffffff'
                                  : 'none',
                              height: '3rem',
                              padding: '0.8rem'
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              />
              <div className="flex justify-end mt4">
                <Button
                  className="w4 grow h2 pointer mr3"
                  style={{
                    background: '#060517',
                    outline: 'none',
                    color: 'white'
                  }}
                  onClick={(e: any) => {
                    e.preventDefault();
                    props.setShowProjectDialog(false);
                  }}
                  text="Cancel"
                />
                <Button
                  className="w4 grow h2 pointer br0"
                  style={{
                    background: '#0fa3a3',
                    outline: 'none',
                    color: 'white'
                  }}
                  loading={submitting}
                  type="submit"
                  disabled={submitting || pristine}
                  text="Create"
                />
              </div>
            </div>
          </form>
        )}
      />
    </>
  );
};

const mapStateToProps = (state: any) => {
  return {
    departments: state.companyReducer.currentCompany.departments,
    company: state.companyReducer.currentCompany,
    associates: state.associateReducer.associatesList
  };
};

export const FormProject = connect(mapStateToProps, {
  createProject,
  getAllDepartments
})(FormComponent);
