import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import { Button } from '@blueprintjs/core/lib/esm/components/button/buttons';
import { Dialog } from '@blueprintjs/core/lib/esm/components/dialog/dialog';

import { ICompany } from 'stores/company/Reducer';
import {
  addDepartment,
  getAllDepartments,
  clearAddDepartmentError,
} from '../../../../stores/company/Actions';

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
  const { t } = useTranslation();
  const [showDialogDepartment, setShowDialogDepartment] =
    useState(false);

  useEffect(() => {
    props.getAllDepartments();
  }, []);

  return (
    <>
      <div className="pr6">
        <div className="flex-ns justify-between pv3">
          <h1 className="f6 lh-copy">
            {t('app.company.Departments.Departments')}
          </h1>
          <Button
            type="submit"
            className="grow pointer addDepartment h2"
            style={{
              background: '#34b3e9',
              outline: 'none',
              color: 'white',
            }}
            onClick={() => setShowDialogDepartment(true)}
          >
            {t('app.company.Departments.Add-department')}
          </Button>
        </div>
        <div className="mt4">
          {props.loading ? (
            <Loading />
          ) : props.company.departments &&
            props.company.departments.length > 0 ? (
            props.company.departments.map((d: any) => (
              <p key={d._id}>{d.name}</p>
            ))
          ) : (
            <p>{t('app.company.Departments.No-departments')}</p>
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
