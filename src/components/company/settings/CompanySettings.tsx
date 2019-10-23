import React, { useState } from 'react';
import { Button, Dialog } from '@blueprintjs/core';
import { InputGroupField } from 'components/common/field/InputGroup';
import { connect, useSelector } from 'react-redux';
import { addDivisionAction } from '../../../stores/company/Actions'
import { addDepartmentAction } from '../../../stores/company/Actions'
import { Entity } from 'stores/UtilsActions';

export const CompanySettingsView = () => {
  return (
    <div className="bl b--black-05 bw1 pl3">
      <DivisionView />
      <DepartmentView />
    </div>
  )
}
interface DivisionViewProps {
  addDivisionAction: (name: Entity) => void
}

const DivisionViewComponent = (props: DivisionViewProps) => {

  const divisions = useSelector((state: any) => state.companyReducer.currentCompany.divisions);
  const [showDialogDivision, setShowDialogDivision] = useState(false)
  const [values, setValues] = useState({
    name: ""
  });
  return (
    <>
      <div className="mb5">
        <div className="flex justify-between">
          <h1 className="f6 lh-copy">Division</h1>
          <Button
            type="submit"
            className="grow pointer"
            style={{ background: "#0fa3a3", outline: "none", color: 'white' }}
            onClick={() => setShowDialogDivision(true)}
          >
            Add/Change
        </Button>
        </div>
        <div className="mt4">
          {divisions.length ? divisions.map((d: any) => (<p key={d._id}>{d.name}</p>)) : <p>No divisions</p>}
        </div>
      </div>
      {showDialogDivision && (
        <Dialog
          isOpen
          style={{ background: '#fff' }}
        >
          <form className="fl w-100 pa3">
            <h1 className="f6 lh-copy">Add Division</h1>
            <div className="mb4">
              <InputGroupField
                id="addDivision"
                placeHolder="Add Division"
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
                  setShowDialogDivision(false);
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
                  await props.addDivisionAction(values);
                  setShowDialogDivision(false);
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

export const DivisionView = connect(null, { addDivisionAction })(DivisionViewComponent)
interface DepartmentViewProps {
  addDepartmentAction: (name: Entity) => void
}

const DepartmentViewComponent = (props: DepartmentViewProps) => {

  const departments = useSelector((state: any) => state.companyReducer.currentCompany.departments);
  const [showDialogDepartment, setShowDialogDepartment] = useState(false)
  const [values, setValues] = useState({
    name: ""
  });

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
          {departments.length ? departments.map((d: any) => (<p key={d._id}>{d.name}</p>)) : <p>No departments</p>}
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

export const DepartmentView = connect(null, { addDepartmentAction })(DepartmentViewComponent)

