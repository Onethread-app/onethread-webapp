import { Alignment, Button, ButtonGroup } from '@blueprintjs/core';
import { isEqual } from 'lodash';
import { connect } from 'react-redux';
import {
  addDesignation,
  changeMemberRole,
  deleteCompanyMember,
  editDesignation,
  getAllDepartments,
} from 'stores/company/Actions';

import { ICompany } from 'stores/company/Reducer';
import { User } from 'stores/user/Reducer';
import { companyPermit } from 'stores/UtilsActions';

interface Props {
  row: any;
  company: ICompany;
  user: User;
  setEditMember: React.Dispatch<React.SetStateAction<undefined>>;
  setShowDialogEdit: React.Dispatch<React.SetStateAction<boolean>>;
  setShowDialogAdd: React.Dispatch<React.SetStateAction<boolean>>;
  getAllDepartments: () => void;
  addDesignation: (values: any, memberId: string) => void;
  editDesignation: (values: any, memberId: string) => void;
  changeMemberRole: (
    values: { role: string },
    memberId: string,
  ) => void;
  deleteCompanyMember: (accountId: string) => void;
}

const ColleaguesOptions = (props: Props) => {
  const { row, setEditMember, setShowDialogEdit, setShowDialogAdd } =
    props;
  return (
    <>
      {companyPermit(props.company.role) ||
      isEqual(row.original.m.account._id, props.user._id) ? (
        <ButtonGroup
          alignText={Alignment.LEFT}
          className="bp3-minimal bp3-vertical bp3-fill"
        >
          {row.original.m.designations &&
          row.original.m.designations.length ? (
            <Button
              className="outline-0 bp3-large bp3-popover-dismiss"
              onClick={async () => {
                setEditMember(row.original.m);
                props.getAllDepartments();
                setShowDialogEdit((prevValue) => !prevValue);
              }}
            >
              <span>Edit Designation</span>
            </Button>
          ) : (
            <Button
              className="outline-0 bp3-large bp3-popover-dismiss"
              onClick={async () => {
                setEditMember(row.original.m);
                props.getAllDepartments();
                setShowDialogAdd((prevValue) => !prevValue);
              }}
            >
              <span>Add Designation</span>
            </Button>
          )}
          {companyPermit(props.company.role) &&
          isEqual(row.original.m.role, 'superAdmin') === false ? (
            isEqual(row.original.m.role, 'admin') === true ? (
              props.company.role === 'superAdmin' ||
              props.company.role === 'admin' ? (
                <Button
                  className="outline-0 bp3-large bp3-popover-dismiss"
                  onClick={async () => {
                    props.changeMemberRole(
                      {
                        role: 'employee',
                      },
                      row.original.m._id,
                    );
                  }}
                >
                  <span className="red">Remove from Admin</span>
                </Button>
              ) : null
            ) : props.company.role === 'superAdmin' ||
              props.company.role === 'admin' ? (
              <Button
                className="outline-0 bp3-large bp3-popover-dismiss"
                onClick={async () => {
                  props.changeMemberRole(
                    { role: 'admin' },
                    row.original.m._id,
                  );
                }}
              >
                <span>Make Admin</span>
              </Button>
            ) : null
          ) : null}
          {companyPermit(props.company.role) &&
            row.original.role !== 'superAdmin' &&
            props.user._id !== row.original.accountId && (
              <Button
                className="outline-0 bp3-large bp3-popover-dismiss"
                onClick={async () => {
                  props.deleteCompanyMember(row.original.id);
                }}
              >
                <span className="red">Remove Member</span>
              </Button>
            )}
        </ButtonGroup>
      ) : null}
    </>
  );
};

const mapStateToProps = (state: any) => ({
  company: state.companyReducer.currentCompany,
  user: state.userReducer.user,
});

export default connect(mapStateToProps, {
  getAllDepartments,
  addDesignation,
  editDesignation,
  changeMemberRole,
  deleteCompanyMember,
})(ColleaguesOptions);
