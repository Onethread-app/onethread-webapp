import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import CreatableSelect from 'react-select/creatable';
import { tigrowApi } from 'config';

import { tokenConfig } from 'stores/UtilsActions';

import { errorMessgeHandler } from 'components/final-form/utils';

// import { IDepartment } from 'layouts/company/project/CreateProjectForm';

// interface ICreatableSingleProps {
//   // setSelectedCompany: ([]) => void;
//   input: FieldInputProps<string, HTMLElement>;
// }
// interface ICreatableSingleInternalProps
//   extends ICreatableSingleProps {
//   // departments: IDepartment[];
//   companyId: string;
// }

interface IOptions {
  value: string;
  label: string;
  __isNew__?: boolean;
}

const CreatableSingle = (props) => {
  const [companyOptions, setCompanyOptions] = useState<IOptions[]>(
    [],
  );

  const [selectedCompany, setSelectedCompany] = useState<IOptions[]>(
    [],
  );

  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      color: 'black',
    }),
  };

  const handleChange = async (newValue: any, actionMeta: any) => {
    if (actionMeta.action === 'create-option') {
      newValue.map(async (val) => {
        setCompanyOptions([...companyOptions, val]);
      });
    }
    setSelectedCompany(newValue);
  };

  // useEffect(() => {
  //   if (props.departments) {
  //     const deptOptions = Array.from(props.departments, (company) => {
  //       return { value: company._id, label: company.name };
  //     });
  //     setCompanyOptions(deptOptions);
  //   }
  // }, [props.departments]);

  useEffect(() => {
    if (props.companies.length > 0) {
      const options = props.companies.map((c: any) => ({
        value: c.company._id,
        label: c.company.name,
      }));
      setCompanyOptions(options);
    }
  }, [props.companies]);

  useEffect(() => {
    if (companyOptions) {
      companyOptions.map(async (company) => {
        if (company.__isNew__) {
          try {
            const headers = tokenConfig();
            if ((headers as any).headers.Authorization) {
              const response = await tigrowApi.post(
                `company`,
                { name: company.label },
                headers,
              );
              const tempCompany = {
                value: response.data.company._id,
                label: response.data.company.name,
              };
              setCompanyOptions(
                companyOptions.map((c) =>
                  c.label.toLowerCase() ===
                  response.data.company.name.toLowerCase()
                    ? tempCompany
                    : c,
                ),
              );
              setSelectedCompany(
                selectedCompany.map((c) =>
                  c.label.toLowerCase() ===
                  response.data.company.name.toLowerCase()
                    ? tempCompany
                    : c,
                ),
              );
            }
          } catch (error) {
            errorMessgeHandler(error);
          }
        }
      });
    }
  }, [companyOptions]);

  return (
    <CreatableSelect
      value={props.value}
      onChange={handleChange}
      options={companyOptions}
      styles={customStyles}
      placeholder="Select Department"
    />
  );
};

const mapStateToProps = (state: any) => {
  return {
    companies: state.userReducer.user.companies,
  };
};

export default connect(mapStateToProps)(CreatableSingle);
