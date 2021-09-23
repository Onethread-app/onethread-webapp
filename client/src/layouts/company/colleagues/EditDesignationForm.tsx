import { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import { Form, Field } from 'react-final-form';
import { Icon } from '@blueprintjs/core/lib/esm/components/icon/icon';
import { Button } from '@blueprintjs/core/lib/esm/components/button/buttons';
import { IconNames } from '@blueprintjs/icons';

import { ICompanyMembers } from 'stores/company/Reducer';
import { Entity } from 'stores/UtilsActions';

import { Condition } from 'components/final-form/Condition';
import { InputGroupFieldWithError } from 'components/fields/InputGroupField';
import { DropdownFieldWithError } from 'components/fields/DropdownField';
import {
  required,
  checkError,
  composeValidators,
  maxValue,
} from 'components/final-form/utils';

interface EditDesignationFormProps {
  setShowDialogEdit: (val: boolean) => void;
}

interface EditDesignationFormInternalProps
  extends EditDesignationFormProps {
  member: ICompanyMembers | undefined;
  setShowDialogEdit: (val: boolean) => void;
  editDesignation: (values: any, memberId: string) => void;
  getCompanyMembers: () => void;
  divisions: Entity[];
  departments: Entity[];
  isLoading: boolean;
}
export const EditDesignationFormComponent = (
  props: EditDesignationFormInternalProps,
) => {
  const [initial, setInitial] = useState({});

  const onSubmit: any = async (values: any) => {
    if (props.member) {
      values.designation = props.member.designations[0]._id;
      const status: any = await props.editDesignation(
        values,
        props.member._id,
      );
      if (status && props.isLoading === false) {
        await props.getCompanyMembers();
        props.setShowDialogEdit(false);
      }
    }
    return {};
  };

  const initialValues: any = () => {
    const divisions = ['director', 'cxo'];
    if (props.member && props.member.designations.length) {
      if (divisions.includes(props.member.designations[0].division)) {
        return {
          division: props.member.designations[0].division,
          position: props.member.designations[0].position,
        };
      }
      return {
        division: props.member.designations[0].division,
        department: props.member.designations[0].department._id,
        position: props.member.designations[0].position,
      };
    }
    return {};
  };

  useEffect(() => {
    setInitial(initialValues());
  }, []);

  return (
    <Form
      onSubmit={onSubmit}
      initialValues={initial}
      render={({
        handleSubmit,
        form,
        submitting,
        pristine,
        values,
      }) => (
        <div>
          <div className='flex justify-end pa3'>
            <Icon
              icon={IconNames.DELETE}
              iconSize={20}
              className='grow pointer tigrow-lightBlue'
              onClick={(e: any) => props.setShowDialogEdit(false)}
            />
          </div>
          <form className='fl w-100 pa4 pt0' onSubmit={handleSubmit}>
            <h1 className='f5 tigrow-lightBlue'>Edit Role</h1>
            <div className='flex flex-column'>
              <div className='mb4'>
                <Field<string>
                  name='division'
                  validate={required}
                  render={({ input, meta }) => (
                    <DropdownFieldWithError
                      placeholder='Please select a division'
                      id={input.name}
                      selectedValue={input.value}
                      options={
                        props.divisions && props.divisions.length > 0
                          ? props.divisions
                          : ([] as any)
                      }
                      onChange={input.onChange}
                      leftIcon='id-number'
                      error={
                        checkError(meta)
                        && (meta.error || meta.submitError)
                      }
                    />
                  )}
                />
              </div>

              <Condition
                when='division'
                validate={(value) => [
                  'seniorManager',
                  'middleManager',
                  'operationalEmployee',
                ].includes(value)}
              >
                <div className='mb4'>
                  <Field<string>
                    name='department'
                    validate={required}
                    render={({ input, meta }) => (
                      <>
                        <DropdownFieldWithError
                          placeholder='Please select a department'
                          id={input.name}
                          selectedValue={input.value}
                          options={
                            props.departments
                            && props.departments.length > 0
                              ? props.departments
                              : ([] as any)
                          }
                          onChange={input.onChange}
                          leftIcon='comparison'
                          error={
                            checkError(meta)
                            && (meta.error || meta.submitError)
                          }
                        />
                      </>
                    )}
                  />
                </div>
              </Condition>
            </div>
            <Field<string>
              name='position'
              validate={composeValidators(required, maxValue(50))}
              render={({ input, meta }) => (
                <InputGroupFieldWithError
                  id={input.name}
                  className={`br0 ${
                    checkError(meta) ? 'bb b--red' : 'bb b--lightBlue'
                  }`}
                  placeHolder='Position'
                  value={input.value}
                  onChange={input.onChange}
                  leftIcon='id-number'
                  leftIconColor={`${
                    checkError(meta) ? 'red' : '#34b3e9'
                  }`}
                  style={{ boxShadow: 'none' }}
                  error={
                    checkError(meta)
                    && (meta.error || meta.submitError)
                  }
                />
              )}
            />
            <div className='tc'>
              <Button
                className='grow h2 pointer white bp3-minimal w4 mt4'
                style={{
                  background: '#34b3e9',
                  outline: 'none',
                  color: 'white',
                }}
                loading={submitting}
                type='submit'
                disabled={submitting || pristine}
              >
                Save
              </Button>
            </div>
          </form>
        </div>
      )}
    />
  );
};

const mapStateToProps = (state: any) => ({
  isLoading: state.companyReducer.designationLoading,
});

export const EditDesignationForm = connect(mapStateToProps)(
  EditDesignationFormComponent,
);
