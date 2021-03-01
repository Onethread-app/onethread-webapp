import { Divider, Button } from '@blueprintjs/core';
import { connect } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { Form, Field } from 'react-final-form';
import { checkError, required } from 'components/final-form/utils';
import { SubmitError } from 'components/final-form/SubmitError';
import { updateProjectName } from '../../../stores/project/Actions';
import { DropdownFieldWithError } from 'components/fields/DropdownField';
import { FieldArray } from 'react-final-form-arrays';
import arrayMutators from 'final-form-arrays';
import { Entity, tokenConfig } from 'stores/UtilsActions';
import { SuggestFieldWithError } from 'components/fields/SuggestField';
import { useLiveSearch } from 'components/useLiveSearch';
import { tigrowApi } from 'config';
import { ICompany } from 'stores/company/Reducer';
import { isEqual } from 'lodash';
import CreatableSingle from 'components/creatable-select/CreatableSelect';

interface IChangeTypeProps {
  setShowDialog: (val: boolean) => void;
  projectId: string;
}

interface IChangeTypeInternalProps extends IChangeTypeProps {
  updateProjectName: (name: string, projectId: string) => any;
  isLoading: boolean;
  company: ICompany;
  departments: Entity[];
}

const ChangeTypeComponent = (props: IChangeTypeInternalProps) => {
  const [associates, setAssociates] = useState([]);
  const [selectedAssociates, setSelectedAssociates] = useState(
    [] as Entity[],
  );
  const [searchAssociate, setSearchAssociate] = useState('');
  const [type, setType] = useState('department');

  const onSubmit = (values: any) => {
    console.log(values);
  };

  const userRequestFactoryAssociate = async (userName: string) => {
    const headers = tokenConfig();
    const response = await tigrowApi.get(
      `projects/associate-company-search/${props.company._id}?name=${searchAssociate}&companyName=${props.company.name}`,
      headers,
    );

    const asso = response.data.data.map((e: any) =>
      isEqual(props.company._id, e._source.company_id) === true
        ? {
            _id: e._source.mongo_id,
            name: e._source.associateCompanyName,
          }
        : {
            _id: e._source.mongo_id,
            name: e._source.companyName,
          },
    );
    return asso;
  };

  let resultAssociate: any = [];
  resultAssociate = useLiveSearch(
    searchAssociate,
    userRequestFactoryAssociate,
    0,
  );

  useEffect(() => {
    setAssociates(resultAssociate);
  }, [resultAssociate]);

  useEffect(() => {
    if (props.departments.length > 0) {
      setType('associate');
    }
  }, []);

  return (
    <Form
      onSubmit={onSubmit}
      mutators={{
        ...arrayMutators,
      }}
      render={({
        handleSubmit,
        form: {
          mutators: { push, pop },
        },
        form,
        submitting,
        pristine,
        values,
        submitError,
        hasValidationErrors,
        ...rest
      }) => (
        <form className="fl w-100 ph4 pt6" onSubmit={handleSubmit}>
          <SubmitError errorMessage={submitError} />
          {type === 'department' ? (
            <Field<string>
              name="department"
              validate={required}
              render={({ meta, input }) => (
                <div
                  className={` ${checkError(meta) ? 'mb3' : 'mb4'}`}
                >
                  <div className="fl w-100 pb2">
                    <div className="mb1">
                      <p
                        className="fw5"
                        style={{ fontSize: '.8rem' }}
                      >
                        Select Departments
                      </p>
                    </div>
                    <CreatableSingle input={input} />
                  </div>
                </div>
              )}
            />
          ) : (
            <>
              <div>
                <p className="fw5" style={{ fontSize: '.8rem' }}>
                  Select Your Associate Companies
                </p>
                <SuggestFieldWithError
                  onChange={(query: string) => {
                    setSearchAssociate(query);
                  }}
                  items={associates}
                  selectedItems={selectedAssociates}
                  setSelectedItems={(item) => {
                    const c = item.pop();
                    push('associates', {
                      _id: c._id,
                      name: c.name,
                    });
                    setSelectedAssociates(item);
                  }}
                  multipleItemSelect={true}
                />
                <FieldArray name="associates">
                  {({ fields }) =>
                    fields.map((name, index) => (
                      <div className="flex justify-between mt1">
                        <div
                          className="bg-blue pa2 br2 mb3"
                          style={{ marginRight: '2px' }}
                        >
                          {fields.value[index].name}
                        </div>
                        <div className="flex items-baseline">
                          <Field<string>
                            id={`${name}.size`}
                            name={`${name}.size`}
                            validate={required}
                            render={({ input, meta }) => (
                              <div
                                className={` ${
                                  checkError(meta) ? 'mb2' : 'mb3'
                                }`}
                              >
                                <DropdownFieldWithError
                                  id={input.name}
                                  selectedValue={input.value}
                                  options={[
                                    { _id: '5', name: '1-5' },
                                    { _id: '10', name: '6-10' },
                                    { _id: '15', name: '11-15' },
                                  ]}
                                  onChange={input.onChange}
                                  error={
                                    checkError(meta) &&
                                    (meta.error || meta.submitError)
                                  }
                                  className="bn"
                                />
                              </div>
                            )}
                          />

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
              <Divider />
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
            </>
          )}
        </form>
      )}
    />
  );
};

const mapStateToProps = (state: any) => {
  return {
    isLoading: state.projectReducer.projectLoading,
    company: state.companyReducer.currentCompany,
    departments: state.companyReducer.currentCompany.departments,
  };
};

export const ChangeType = connect(mapStateToProps, {
  updateProjectName,
})(ChangeTypeComponent);
