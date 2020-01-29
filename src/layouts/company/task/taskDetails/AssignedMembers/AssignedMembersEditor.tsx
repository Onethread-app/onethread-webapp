import React, { useState, useEffect } from 'react';
import { Form, Field } from 'react-final-form';
import { SubmitError } from 'components/final-form/SubmitError';
import { checkError } from 'components/final-form/utils';
import { SuggestField } from 'components/fields/SuggestField';
import { Tag, Button, Icon } from '@blueprintjs/core';
import { tokenConfig } from 'stores/UtilsActions';
import { server } from 'tigrowApi';
import { useLiveSearch } from 'components/useLiveSearch';
import { isEmpty } from 'lodash';
import { connect } from 'react-redux';
import { CompanyModel } from 'stores/company/Reducer';
import { IconNames } from '@blueprintjs/icons';

interface IMembersFormProps {
    setMembersPopover: (val: boolean) => void;
  company?: CompanyModel;
}

interface ICompanyTeamMembers {
  _id: string;
  name: string;
}
export const AssignedMembersEditorComponent = (props: IMembersFormProps) => {
  const onSubmit = async (values: any) => {
    props.setMembersPopover(false);
  };

  // if (isEmpty(values.location)) {
  //   values.location = '';
  // }
  // const response = await props.editInfoAction(values);
  // if (response.message === 200) {
  //   props.setShowDialog(false);
  //   return true;
  // }
  // return { [response.fieldName]: response.message };

  const [teamMembers, setTeamMembers]: any = useState([]);
  const [selectedTeamMember, setSelectedTeamMember] = useState([] as ICompanyTeamMembers[]);
  const [username, setUsername] = useState('');

  const userRequestFactory = (userName: string): Promise<any> => {
    const headers = tokenConfig();
    return fetch(`${server}company/${props.company!.name}/members/search?name=${userName}`, headers)
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
    <Form
      onSubmit={onSubmit}
      render={({ handleSubmit, form, submitting, pristine, values, submitError, hasValidationErrors, ...rest }) => (
        <form
          className="fl w-100 ph2 pt2"
          onSubmit={handleSubmit}
        >
          <SubmitError errorMessage={submitError} />
          <div className="flex justify-end">
						<Icon
							icon={IconNames.CROSS}
							iconSize={20}
							className="grow pointer"
							onClick={(e: any) => props.setMembersPopover(false)}
						/>
					</div>
          <Field<string>
            name="member"
            render={({ input, meta }) =>
              <div className={` ${checkError(meta) ? 'mb3' : 'mb4'}`}>
                <div className="fl w-100 pb2">
                  <div className="mb1">
                    <p className="fw5" style={{ fontSize: '.8rem' }}>Assign Members</p>
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
              Assign
              </Button>
          </div>
        </form>
      )}
    />
  );
};

const mapStateToProps = (state: any) => {
  return {
    company: state.companyReducer.currentCompany
  };
};

export const AssignedMembersEditor = connect(mapStateToProps, null)(AssignedMembersEditorComponent);