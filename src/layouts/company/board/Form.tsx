import React, { useState, useEffect } from 'react';
import { InputGroupFieldWithLabel } from 'components/fields/InputGroupField';
import { Button, Icon, Tag } from '@blueprintjs/core';
import { createBoard } from 'stores/board/Actions';
import { TaskBoard } from 'stores/board/Reducer';
import { connect } from 'react-redux';
import { Form, Field } from 'react-final-form';
import { checkError, required } from 'components/final-form/utils';
import { DropdownFieldErrorWithLabel } from 'components/fields/DropdownField';
import { SuggestField } from 'components/fields/SuggestField';
import { tokenConfig, boardColor } from 'stores/UtilsActions';
import { server } from 'tigrowApi';
import { CompanyModel, ICompanyTeamMembers } from 'stores/company/Reducer';
import { useLiveSearch } from 'components/useLiveSearch';
import { isEmpty, upperFirst, isEqual } from 'lodash';

const FormComponent = (props: {
  loading: boolean;
  setShowTaskBoardDialog?: (val: boolean) => void;
  createBoard: (board: TaskBoard) => void;
  departments: [],
  company: CompanyModel;
}) => {
  const onSubmit = async (values: any) => {
    await props.createBoard(values);
    if (props.setShowTaskBoardDialog) {
      props.setShowTaskBoardDialog(false);
    }
    return {};
  };

  const [labelColor, setLabelColor] = useState(null as any);
  const [teamMembers, setTeamMembers]: any = useState([]);
  const [selectedTeamMember, setSelectedTeamMember] = useState([] as ICompanyTeamMembers[]);
  const [username, setUsername] = useState('');

  const userRequestFactory = (userName: string): Promise<any> => {
    const headers = tokenConfig();
    return fetch(`${server}company/${props.company.name}/members/search?name=${userName}`, headers)
      .then((res) => res.json())
      .then((res) => res.employees.data)
      .catch((err) => []);
  };

  let result: any = [];
  result = useLiveSearch(username, userRequestFactory, 800);

  useEffect(() => {
    setTeamMembers(result);
  }, [result]);

  return (
    <>
      <div className="pl3" style={{ marginTop: '6rem' }}>
        <h3>Create Board</h3>
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
                validate={required}
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
                      label="Board Name*"
                    />
                  </div>
                }
              />
              <Field<string>
                name="department"
                render={({ input, meta }) =>
                  <div className={` ${checkError(meta) ? 'mb2' : 'mb3'}`}>
                    <DropdownFieldErrorWithLabel
                      id={input.name}
                      selectedValue={input.value}
                      options={
                        props.departments && props.departments.length > 0 ?
                          props.departments : [] as any
                      }
                      onChange={input.onChange}
                      error={checkError(meta) && (meta.error || meta.submitError)}
                      label="Department"
                      className="bn"
                    />
                  </div>
                }
              />
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
              <Field<string>
                name="member"
                render={({ input, meta }) =>
                  <div className={` ${checkError(meta) ? 'mb3' : 'mb4'}`}>
                    <div className="fl w-100 pb2">
                      <div className="mb1">
                        <p className="fw5" style={{ fontSize: '.8rem' }}>Add Members</p>
                      </div>
                      <SuggestField
                        onChange={(query: string) => {
                          setUsername(query);
                        }}
                        items={teamMembers}
                        selectedItems={selectedTeamMember}
                        setSelectedItems={(item) => {
                          setSelectedTeamMember(item);
                          input.onChange(item.map((member: ICompanyTeamMembers) => member._id));
                        }}
                        multipleItemSelect={true}
                      />
                    </div>
                    {selectedTeamMember.length > 0 &&
                      <div className="w-100">
                        <div
                          className="overflow-auto br2"
                          style={{
                            border: '1px solid #707070',
                            maxHeight: '120px',
                            background: '#707070'
                          }}>
                          {selectedTeamMember.map((item) => (
                            <div>
                              <Tag
                                key={item._id}
                                className="pa1"
                                interactive={true}
                                style={{ background: '#707070' }}
                                onRemove={(e) => {
                                  const filteredItems = selectedTeamMember.filter((selectedItem) => (
                                    item.name !== selectedItem.name
                                  ));
                                  setSelectedTeamMember([
                                    ...filteredItems
                                  ]);
                                  input.onChange(
                                    isEmpty(filteredItems) ?
                                      undefined :
                                      filteredItems.map((member: ICompanyTeamMembers) => member._id));
                                }}
                                large={true}
                                intent="primary"
                              >
                                <p className="mb0"
                                  style={{ color: '#ffffff' }}>
                                  {upperFirst(item.firstName)} {upperFirst(item.lastName)} has been added
                              </p>
                              </Tag>
                            </div>
                          ))}
                        </div>
                      </div>
                    }
                  </div>
                }
              />
              <div className="fr">
                <Button
                  className="grow pointer white bp3-minimal w4 mt2"
                  style={{
                    background: '#0FA3A3',
                    outline: 'none',
                    color: 'white',
                  }}
                  loading={submitting}
                  type="submit"
                  disabled={submitting || pristine}
                >
                  Create
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
    loading: state.taskManagementReducer.boardReducer.loading,
    departments: state.companyReducer.currentCompany.departments,
    company: state.companyReducer.currentCompany
  };
};

export const FormBoard = connect(mapStateToProps, { createBoard })(FormComponent);