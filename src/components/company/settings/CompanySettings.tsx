import React, { useState, useEffect } from 'react';
import { Button, Dialog, Tabs, Tab } from '@blueprintjs/core';
import { InputGroupField } from 'components/common/field/InputGroup';
import { connect } from 'react-redux';
import { addDepartment, getAllDepartments, changeCompanyName, clearChangeCompanyNameError, clearAddDepartmentError } from '../../../stores/company/Actions'
import { CompanyModel } from 'stores/company/Reducer';
import { Loading } from 'components/common/field/Loading';
import { RouteComponentProps, withRouter } from 'react-router';
import { isEqual, isEmpty } from 'lodash';
import { History } from 'history';
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

interface DetailsViewProps {
  company: CompanyModel;
  changeCompanyName: (name: string) => void;
  clearChangeCompanyNameError: () => void;
  errorCompanyName: string;
  history: History;
}

const GeneralViewComponent = (props: DetailsViewProps & RouteComponentProps) => {

  const [companyName, setCompanyName] = useState(props.company.name)
  const [errors, setErrors] = useState("")

  const [showDialog, setShowDialog] = useState(false)
  return (
    <div>
      <Button
        type="submit"
        className="grow pointer outline-0 shadow-0 h2"
        style={{ background: "#0fa3a3", color: 'white', fontSize: '16px' }}
        onClick={() => setShowDialog(true)}
      >
        Change CompanyName
      </Button>
      {showDialog && (
        <Dialog
          onClose={() => setShowDialog(!showDialog)}
          isOpen
          style={{ background: '#fff' }}
          canOutsideClickClose={false}
        >
          <form className="pa4">
            <h1 className="f5 lh-title ml2 tigrow-lightBlue mb4">Change CompanyName</h1>
            <div>
              {props.errorCompanyName ?
                <small className="red">{props.errorCompanyName}</small>
                : ""}
              <div className={`${errors ? "mb3" : "mb4"}`}>
                <div className="flex">
                  <InputGroupField
                    id="companyName"
                    value={companyName}
                    leftIcon="envelope"
                    className={`br0 ${errors || props.errorCompanyName ? 'bb b--red' : 'bb b--lightBlue'}`}
                    leftIconColor={`${errors || props.errorCompanyName ? 'red' : "#0fa3a3"}`}
                    style={{
                      boxShadow: 'none'
                    }}
                    onChange={(event: any) => {
                      setCompanyName(event.target.value);
                    }}
                    validationOnBlur={() => {
                      if (isEmpty(companyName)) {
                        setErrors("Required");
                      } else {
                        setErrors("");
                      }
                    }}
                  />
                </div>
                {errors ? <small className="red">{errors}</small> : ""}
              </div>
            </div>
            <div className="flex justify-end">
              <Button className="w4 grow h2 pointer mr3"
                style={{ background: "#fff", outline: "none", border: "1px solid #0fa3a3", color: "#0fa3a3" }}
                onClick={(e: any) => {
                  e.preventDefault();
                  setShowDialog(false);
                  setErrors("")
                  setCompanyName(props.company.name)
                  props.clearChangeCompanyNameError();
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
                  if (isEqual(props.company.name, companyName) === true) {
                    props.clearChangeCompanyNameError();
                    setShowDialog(false);
                  }
                  else if ((isEmpty(errors))) {
                    const response = await props.changeCompanyName(companyName) as any;
                    if (response) {
                      props.history.push(`/company/${companyName}/settings`);
                      setShowDialog(false);
                    }
                  }
                }
                }
              >
                Change
                </Button>
            </div>
          </form>
        </Dialog>
      )}
    </div>
  )
}

const mapStateToProps = (state: any) => {
  return {
    company: state.companyReducer.currentCompany,
    loading: state.companyReducer.loading,
    errorCompanyName: state.companyReducer.error,
    departmentError: state.companyReducer.error
  }
}

const DepartmentView = connect(mapStateToProps, { addDepartment, getAllDepartments, clearAddDepartmentError })(DepartmentViewComponent)
const GeneralView = connect(mapStateToProps, { changeCompanyName, clearChangeCompanyNameError })(withRouter(GeneralViewComponent))

export const CompanySettingsView = () => {
  return (
    <div className="bl b--black-05 bw1 pl4-l pl3-m ml4-l" style={{minHeight: '30em'}}>
      <div>
        <Tabs
          id="TabsExample"
        >
          <Tab
            id="General"
            title="General"
            panel={<GeneralView />}
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


