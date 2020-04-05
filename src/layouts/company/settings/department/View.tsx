import React, { useState, useEffect } from 'react';
import { Button, Dialog } from '@blueprintjs/core';
import { connect } from 'react-redux';
import {
  addDepartment,
  getAllDepartments,
  clearAddDepartmentError
} from '../../../../stores/company/Actions';
import { ICompany } from 'stores/company/Reducer';
import { Loading } from 'components/Loading';
import { DepartmentEditor } from './Editor';

interface DepartmentViewProps {
  company: ICompany;
  loading: boolean;
  addDepartment: (name: string) => void;
  getAllDepartments: () => void;
  clearAddDepartmentError: () => void;
}

const DepartmentViewComponent = (props: DepartmentViewProps) => {

  const [showDialogDepartment, setShowDialogDepartment] = useState(false);

  useEffect(() => {
    props.getAllDepartments();
  }, []);

  return (
    <>
      <div>
        <div className="flex justify-between">
          <h1 className="f6 lh-copy">Departments</h1>
          <Button
            type="submit"
            className="grow pointer"
            style={{ background: '#0fa3a3', outline: 'none', color: 'white', fontSize: '16px' }}
            onClick={() => setShowDialogDepartment(true)}
          >
            Add Department
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
          <DepartmentEditor setShowDialog={setShowDialogDepartment} />
        </Dialog>
      )}
    </>
  );
};
const mapStateToProps = (state: any) => {
  return {
    company: state.companyReducer.currentCompany,
    loading: state.companyReducer.loading
  };
};
export const DepartmentView = connect(mapStateToProps, {
  addDepartment,
  getAllDepartments,
  clearAddDepartmentError
})(DepartmentViewComponent);
