import React, { useState, useEffect } from 'react';
import { Button, Dialog } from '@blueprintjs/core';
import { InputGroupField } from 'components/common/field/InputGroup';
import { connect } from 'react-redux';
import { addDepartmentAction, getAllDepartments } from '../../../stores/company/Actions'
import { Entity } from 'stores/UtilsActions';
import { CompanyModel } from 'stores/company/Reducer';
import { Loading } from 'components/common/field/Loading';
interface DepartmentViewProps {
  company: CompanyModel;
  loading: boolean;
  addDepartmentAction: (name: Entity) => void;
  getAllDepartments: () => void;
}

const DepartmentViewComponent = (props: DepartmentViewProps) => {

  const [showDialogDepartment, setShowDialogDepartment] = useState(false)
  const [values, setValues] = useState({
    name: ""
  });

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
            className="grow pointer"
            style={{ background: "#0fa3a3", outline: "none", color: 'white' }}
            onClick={() => setShowDialogDepartment(true)}
          >
            Add/Change
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
            <h1 className="f6 lh-copy">Add Department</h1>
            <div className="mb4">
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
                  const value = event.target.value;
                  setValues({ name: value });
                }}
                value={values.name}
              />
            </div>
            <div className="flex justify-end">
              <Button className="w4 grow h2 pointer mr3"
                style={{ background: "#fff", outline: "none", border: "2px solid #0fa3a3", color: "#0fa3a3" }}
                onClick={(e: any) => {
                  e.preventDefault();
                  setShowDialogDepartment(false);
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
                  await props.addDepartmentAction(values);
                  setShowDialogDepartment(false);
                  setValues({ name: '' })
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
    loading: state.companyReducer.loading
  }
}

const DepartmentView = connect(mapStateToProps, { addDepartmentAction, getAllDepartments })(DepartmentViewComponent)

export const CompanySettingsView = () => {
  return (
    <div className="bl b--black-05 bw1 pl3">
      <DepartmentView />
    </div>
  )
}
