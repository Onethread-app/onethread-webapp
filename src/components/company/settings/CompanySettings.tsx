import React, { useState, useEffect } from 'react';
import { Button, Dialog, Tabs, Tab } from '@blueprintjs/core';
import { InputGroupField } from 'components/common/field/InputGroup';
import { connect } from 'react-redux';
import { addDepartment, getAllDepartments, clearAddDepartmentError } from '../../../stores/company/Actions'
import { CompanyModel } from 'stores/company/Reducer';
import { Loading } from 'components/common/field/Loading';
import { isEmpty } from 'lodash'
interface DepartmentViewProps {
  company: CompanyModel;
  loading: boolean;
  departmentError: string;
  addDepartment: (name: string) => void;
  getAllDepartments: () => void;
  clearAddDepartmentError: () => void;
}

const DepartmentViewComponent = (props: DepartmentViewProps) => {

  const [showDialogDepartment, setShowDialogDepartment] = useState(false)
  const [departmentName, setDepartmentName] = useState("");

  useEffect(() => {
    props.getAllDepartments();
  }, [])

  return (
    <>
      <div>
        <div className="flex justify-between">
          <h1 className="f6 lh-copy">Department</h1>
          <Button
            type="submit"
            className="grow pointer w-15"
            style={{ background: "#0fa3a3", outline: "none", color: 'white', fontSize: '16px' }}
            onClick={() => setShowDialogDepartment(true)}
          >
            Add
        </Button>
        </div>
        <div className="mt4">
          {props.loading ? <Loading /> :
            props.company.departments && props.company.departments.length > 0 ?
              props.company.departments.map((d: any) => (<p key={d._id}>{d.name}</p>)) : <p>No departments</p>}
        </div>
      </div>
      {showDialogDepartment && (
        <Dialog
          isOpen
          style={{ background: '#fff' }}
        >
          <form className="fl w-100 pa3">
            <h1 className="f6 lh-title tigrow-lightBlue dib mb3">Add Department</h1>
            <div className={`${props.departmentError ? "mb3" : "mb4"}`}>
              <InputGroupField
                id="addDepartment"
                placeHolder="Add Department"
                leftIcon="comparison"
                style={{
                  boxShadow: 'none'
                }}
                className='bb b--lightBlue'
                leftIconColor="#0fa3a3"
                onChange={(event: any) => {
                  setDepartmentName(event.target.value);
                }}
                value={departmentName}
              />
              {props.departmentError ? <small className="red">{props.departmentError}</small> : ""}
            </div>
            <div className="flex justify-end">
              <Button className="w4 grow h2 pointer mr3"
                style={{ background: "#fff", outline: "none", border: "1px solid #0fa3a3", color: "#0fa3a3" }}
                onClick={(e: any) => {
                  e.preventDefault();
                  setShowDialogDepartment(false);
                  props.clearAddDepartmentError();
                  setDepartmentName("");
                }}
              >
                cancel
              </Button>
              <Button
                type="submit"
                className="w4 grow h2 pointer"
                style={{ background: "#0fa3a3", outline: "none", color: 'white' }}
                onClick={async (e: any) => {
                  e.preventDefault();
                  if (isEmpty(departmentName) === false) {
                    const response = await props.addDepartment(departmentName) as any;
                    if (response) {
                      setShowDialogDepartment(false);
                      setDepartmentName("")
                    }
                  }
                }}
              >
                Save
              </Button>
            </div>
          </form>
        </Dialog>
      )}
    </>
  )
}

const mapStateToProps = (state: any) => {
  return {
    company: state.companyReducer.currentCompany,
    loading: state.companyReducer.loading,
    departmentError: state.companyReducer.error
  }
}

const DepartmentView = connect(mapStateToProps, { addDepartment, getAllDepartments, clearAddDepartmentError })(DepartmentViewComponent)

export const CompanySettingsView = () => {
  return (
    <div className="bl b--black-05 bw1 pl4-l pl3-m ml4-l" style={{minHeight: '30em'}}>
      <div>
        <Tabs
          id="TabsExample"
        >
          <Tab
            id="details"
            title="Details"
            panel={<DepartmentView />}
            className="outline-0"
          />
          <Tab
            id="fields"
            title="Fields"
            panel={<DepartmentView />}
            className="outline-0"
          />
        </Tabs>
      </div>
    </div>
  )
}
