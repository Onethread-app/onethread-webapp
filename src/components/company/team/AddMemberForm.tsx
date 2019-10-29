import React, { useState } from 'react'
import { CompanyModel, ICompanyMembers } from 'stores/company/Reducer';
import { SuggestField, ItemEntityProps } from 'components/common/field/SuggestField';
import { useStore, connect } from 'react-redux';
import { tokenConfig } from 'stores/UtilsActions';
import tigrowApi from 'tigrowApi';
import { isEqual } from 'lodash';
import { Button, Tag } from '@blueprintjs/core';
import { addTeamMembers, getCompanyMembers } from 'stores/company/Actions';
// import { InputGroupField } from 'components/common/field/InputGroup';

interface TeamMembersViewProps {
  showDialog: boolean;
  setShowDialog: (val: boolean) => void;
  members: ICompanyMembers[];
}

interface TeamMembersViewInternalProps extends TeamMembersViewProps {
  company: CompanyModel;
  addTeamMembers: (members: { account: string | undefined, company: string }[], name: string) => void;
  getCompanyMembers: () => void;
}

const AddMemberFormComponent = (props: TeamMembersViewInternalProps) => {

  const [teamMembers, setTeamMembers]: any = useState([]);
  // const [allDivisions, setAllDivisions]: any = useState([]);
  // const [allDepartments, setAllDepartments]: any = useState([]);
  // const [addTeamMemberForm, setAddTeamMemberForm] = useState({
  //   name: {} as ItemEntityProps,
  //   division: "",
  //   department: "",
  //   position: ""
  // })

  const [selectedTeamMember, setSelectedTeamMember] = useState([] as ItemEntityProps[]);

  const store = useStore();

  const fetchTeamMembersByUsername = async (userName: string) => {
    try {
      const headers = tokenConfig(store.getState);
      if ((headers as any).headers.Authorization) {
        const response = await tigrowApi.get(`account/search?username=${userName}`, headers);
        setTeamMembers(response.data.employees.data);
      } else {
        console.log('no headers')
      }
    } catch (error) {
      if (isEqual(error.message, 'Network Error')) {
        console.log('network error')
      }
      else {
        console.log(error.response);
      }
    }
  }

  // const fetchDivisions = async () => {
  //   try {
  //     const headers = tokenConfig(store.getState);
  //     let companyName = store.getState().companyReducer.currentCompany.name;
  //     if ((headers as any).headers.Authorization) {
  //       const response = await tigrowApi.get(`/company/${companyName}/divisions`, headers);

  //       setAllDivisions(response.data.divisions);
  //     } else {
  //       console.log('no headers')
  //     }
  //   } catch (error) {
  //     if (isEqual(error.message, 'Network Error')) {
  //       console.log('network error')
  //     }
  //     else {
  //       console.log(error.response);
  //     }
  //   }
  // }

  // const fetchDepartments = async () => {
  //   try {
  //     const headers = tokenConfig(store.getState);
  //     let companyName = store.getState().companyReducer.currentCompany.name;
  //     if ((headers as any).headers.Authorization) {
  //       const response = await tigrowApi.get(`/company/${companyName}/departments`, headers);
  //       setAllDepartments(response.data.departments);
  //     } else {
  //       console.log('no headers')
  //     }
  //   } catch (error) {
  //     if (isEqual(error.message, 'Network Error')) {
  //       console.log('network error')
  //     }
  //     else {
  //       console.log(error.response);
  //     }
  //   }
  // }

  // const handleChange = (name: string) => (event: any) => {
  //   const value = event.target.value;
  //   setAddTeamMemberForm({ ...addTeamMemberForm, [name]: value });
  // };

  // const onChangeSelectField = (name: string) => (event: any) => {
  //   const value = event.currentTarget.value;
  //   setAddTeamMemberForm({ ...addTeamMemberForm, [name]: value });
  //   // setErrors({...errors, [name]: ""})
  // }

  // useEffect(() => {
  //   fetchDivisions();
  //   fetchDepartments();
  // }, [])

  return (
    <div className="pa3">
      <div className=" w-100">
        <h1 className="f5">Add members</h1>
        <SuggestField
          onChange={(query: string) => { fetchTeamMembersByUsername(query) }}
          items={teamMembers}
          selectedItems={selectedTeamMember}
          setSelectedItems={setSelectedTeamMember}
          multipleItemSelect={true}
        // selectedItems={addTeamMemberForm.name}
        // setSelectedItems={e => {
        //   setAddTeamMemberForm({
        //     ...addTeamMemberForm,
        //     name: e
        //   });
        // }}
        />
      </div>

      {/* <div className=" w-100">
        <h1 className="f5">Division</h1>
        <HTMLSelect
          fill={true}
          minimal={true}
          onChange={onChangeSelectField('division')}
          className=" bb b--lightBlue"
          style={{
            boxShadow: 'none',
            borderRadius: '0px',
            backgroundColor: 'white',
            flex: '1',
            outline: 'none'
          }}
        >
          <option selected value=''>Select division</option>
          {allDivisions.length > 0 && allDivisions.map((t: any) => (
            <option value={t._id}>{t.name}</option>
          ))}
        </HTMLSelect>
      </div>

      <div className=" w-100">
        <h1 className="f5">Departments</h1>
        <HTMLSelect
          fill={true}
          minimal={true}
          onChange={onChangeSelectField('department')}
          className=" bb b--lightBlue"
          style={{
            boxShadow: 'none',
            borderRadius: '0px',
            backgroundColor: 'white',
            flex: '1',
            outline: 'none'
          }}
        >
          <option selected value=''>Select department</option>
          {allDepartments.length > 0 && allDepartments.map((t: any) => (
            <option value={t._id}>{t.name}</option>
          ))}
        </HTMLSelect>
      </div>

      <div className=" w-100">
        <h1 className="f5">Position</h1>
        <InputGroupField
          id="companyPosition"
          value={addTeamMemberForm.position}
          onChange={handleChange("position")}
          placeHolder="Company Name"
          style={{
            boxShadow: 'none'
          }}
          className={`br0 bb b--lightBlue`}
          leftIconColor={`#0fa3a3`}
          // validationOnBlur={() => {
          //   if (isEmpty(values.name)) {
          //     const companyNameError = { ...errors, name: "Please enter company name" };
          //     setErrors(companyNameError);
          //   } else {
          //     const companyNameError = { ...errors, name: "" }
          //     setErrors(companyNameError);
          //   }
          // }}
        />
      </div> */}

      <div className="w-100 mb2">
        {selectedTeamMember.map(item => (
          <Tag
            key={item._id}
            className="ma1 pa2"
            interactive={true}
            onRemove={e => {
              const filteredItems = selectedTeamMember.filter(selectedItem => (
                item.name !== selectedItem.name
              ));
              setSelectedTeamMember([
                ...filteredItems
              ])
            }}
            large={true}
          >
            {item.name}
          </Tag>
        ))}
      </div>

      <div className="flex justify-end mt2">
        <Button className="grow h2 pointer white bp3-minimal w4 mr3"
          style={{ background: "#fff", outline: "none", border: "1px solid #0fa3a3", color: "#0fa3a3" }}
          onClick={(e: any) => props.setShowDialog(!props.showDialog)}
        >
          Cancel
          </Button>
        <Button className="grow h2 pointer white bp3-minimal w4"
          style={{ background: "#0fa3a3", outline: "none", color: 'white' }}
          onClick={async () => {
            // let teamMemberInfo: any = {
            //   ...addTeamMemberForm,
            //   account: addTeamMemberForm.name._id
            // }
            // teamMemberInfo = omit(teamMemberInfo, ['name'])
            // console.log(teamMemberInfo);
            // if (isEmpty(teamMemberInfo.account) === false) {
            //   props.addTeamMembers(teamMemberInfo, props.company.name);
            // }
            const userIdWithCompany = selectedTeamMember.map(selected => {
              return {
                account: selected._id,
                company: props.company._id
              }
            })
            if (userIdWithCompany) {
              await props.addTeamMembers(userIdWithCompany, props.company.name);
            }
            await props.getCompanyMembers();
            props.setShowDialog(!props.showDialog);
            // console.log(`userIds: `, userIdWithCompany);
            // if (!isEmpty(selectedTeamMember)) {
            //   if (selectedTeamMember._id) {
            //     props.addTeamMembers(selectedTeamMember._id, props.company.name);
            //     // setAddTeamMemberForm({
            //     //   ...addTeamMemberForm,
            //     //   name: selectedTeamMember._id
            //     // });
            //   }
            //   // setShowDialog(!showDialog)
            //   props.setShowDialog(!props.showDialog);
            // }
          }
          }
        >
          Add
          </Button>
      </div>
    </div>
  )
}

const mapStateToProps = (state: any) => {
  return {
    company: state.companyReducer.currentCompany
  }
}

export const AddMemberForm = connect(mapStateToProps, { addTeamMembers, getCompanyMembers })(AddMemberFormComponent)
