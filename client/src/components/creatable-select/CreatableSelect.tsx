import React from 'react';
import { connect } from 'react-redux';

import CreatableSelect from 'react-select/creatable';

import { FieldInputProps } from 'react-final-form';
import { errorMessgeHandler } from 'components/final-form/utils';

import { IDepartment } from 'layouts/company/project/CreateProjectForm';

import { tokenConfig } from 'stores/UtilsActions';
import { tigrowApi } from 'config';

interface ICreatableSingleProps {
  // setSelectedDepartment: ([]) => void;
  input: FieldInputProps<string, HTMLElement>;
}
interface ICreatableSingleInternalProps
  extends ICreatableSingleProps {
  departments: IDepartment[];
  companyId: string;
}

interface IOptions {
  value: string;
  label: string;
  __isNew__?: boolean;
}

const CreatableSingle = (props: ICreatableSingleInternalProps) => {
  const [departmentOptions, setDepartmentOptions] = React.useState<
    IOptions[]
  >([]);

  const [selectedDepartment, setSelectedDepartment] = React.useState<
    IOptions[]
  >([]);

  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      color: 'black',
    }),
  };

  const handleChange = async (newValue: any, actionMeta: any) => {
    if (actionMeta.action === 'create-option') {
      newValue.map(async (val) => {
        setDepartmentOptions([...departmentOptions, val]);
      });
    }
    setSelectedDepartment(newValue);
  };

  React.useEffect(() => {
    if (props.departments) {
      const deptOptions = Array.from(props.departments, (dept) => {
        return { value: dept._id, label: dept.name };
      });
      setDepartmentOptions(deptOptions);
    }
  }, [props.departments]);

  React.useEffect(() => {
    if (departmentOptions) {
      departmentOptions.map(async (dept) => {
        if (dept.__isNew__) {
          try {
            const headers = tokenConfig();
            if ((headers as any).headers.Authorization) {
              const response = await tigrowApi.post(
                `company/${props.companyId}/departments`,
                { name: dept.label },
                headers,
              );
              const tempDept = {
                value: response.data.department._id,
                label: response.data.department.name,
              };
              setDepartmentOptions(
                departmentOptions.map((d) =>
                  d.label.toLowerCase() ===
                  response.data.department.name.toLowerCase()
                    ? tempDept
                    : d,
                ),
              );
              setSelectedDepartment(
                selectedDepartment.map((d) =>
                  d.label.toLowerCase() ===
                  response.data.department.name.toLowerCase()
                    ? tempDept
                    : d,
                ),
              );
            }
          } catch (error) {
            errorMessgeHandler(error);
          }
        }
      });
    }
  }, [departmentOptions]);

  React.useEffect(() => {
    if (selectedDepartment) {
      props.input.onChange(
        selectedDepartment.map((dept: any) => dept.value),
      );
    }
  }, [selectedDepartment]);

  return (
    <CreatableSelect
      isClearable
      isMulti
      onChange={handleChange}
      options={departmentOptions}
      styles={customStyles}
      placeholder="Select Department"
    />
  );
};

const mapStateToProps = (state: any) => {
  return {
    departments: state.companyReducer.currentCompany.departments,
    companyId: state.companyReducer.currentCompany._id,
  };
};

export default connect(mapStateToProps)(CreatableSingle);
