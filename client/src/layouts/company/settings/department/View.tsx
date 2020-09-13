import React, { useState, useEffect } from 'react';
import { Button, Dialog } from '@blueprintjs/core';
import { connect } from 'react-redux';
import {
  addDepartment,
  getAllDepartments,
  clearAddDepartmentError,
} from '../../../../stores/company/Actions';
import moment from 'moment';
import 'moment/locale/en-gb';
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
  const [showDialogDepartment, setShowDialogDepartment] = useState(
    false,
  );

  useEffect(() => {
    props.getAllDepartments();
  }, []);

  return (
    <>
      <div className="pr6">
        <div className="flex-ns justify-between pv3">
          <h1 className="f3 lh-copy mid-gray b">Departments</h1>
          <Button
            type="submit"
            className="grow pointer addDepartment h2"
            style={{
              background: '#0fa3a3',
              outline: 'none',
              color: 'white',
            }}
            onClick={() => setShowDialogDepartment(true)}
          >
            Add Department
          </Button>
        </div>
        <div className="mt4">
          {props.loading ? (
            <Loading />
          ) : props.company.departments &&
            props.company.departments.length > 0 ? (
            props.company.departments.map((d: any) => (
              <div className="fl w-third-l w-100 ml0-l ml5 pa2">
                <div>
                  <p key={d._id} className="br2 shadow-3 h5-l h4 flex justify-center items-center mid-gray b">
                    <p className="tc" style={{overflow: 'hidden'}}>
                      <p className="f2-l f4-m f5 pb5-l mt5-l pb4 mt4 w5-l">{d.name}</p>
                      <p className="f4-l f5-m f6" style={{ color: '#0FA3A3'}}> 
                        Added on {moment(d.createdAt).format('ll')}
                      </p>
                    </p>
                  </p>
                  </div>
                </div>

             /*  <p key={d._id}>
                {d.name}
              </p> */
            ))
          ) : (
            <p>No departments</p>
          )}
        </div>
      </div>
      {showDialogDepartment && (
        <Dialog isOpen style={{ background: '#fff' }} className="pa2">
          <DepartmentEditor setShowDialog={setShowDialogDepartment} />
        </Dialog>
      )}
    </>
  );
};
const mapStateToProps = (state: any) => {
  return {
    company: state.companyReducer.currentCompany,
    loading: state.companyReducer.loading,
  };
};
export const DepartmentView = connect(mapStateToProps, {
  addDepartment,
  getAllDepartments,
  clearAddDepartmentError,
})(DepartmentViewComponent);
