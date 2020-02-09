import React, { useState } from 'react';
import { Button, Dialog } from '@blueprintjs/core';
import { InputGroupField } from 'components/fields/InputGroupField';
import { connect } from 'react-redux';
import { changeCompanyName, clearChangeCompanyNameError } from '../../../stores/company/Actions';
import { CompanyModel } from 'stores/company/Reducer';
import { RouteComponentProps, withRouter } from 'react-router';
import { isEqual, isEmpty } from 'lodash';
import { History } from 'history';

interface DetailsViewProps {
  company: CompanyModel;
  changeCompanyName: (name: string) => void;
  clearChangeCompanyNameError: () => void;
  errorCompanyName: string;
  history: History;
}

const GeneralViewComponent = (props: DetailsViewProps & RouteComponentProps) => {

  const [companyName, setCompanyName] = useState(props.company.name);
  const [errors, setErrors] = useState('');

  const [showDialog, setShowDialog] = useState(false);
  return (
    <div>
      <Button
        type="submit"
        className="grow pointer outline-0 shadow-0 h2"
        style={{ background: '#0fa3a3', color: 'white', fontSize: '16px' }}
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
                : ''}
              <div className={`${errors ? 'mb3' : 'mb4'}`}>
                <div className="flex">
                  <InputGroupField
                    id="companyName"
                    value={companyName}
                    leftIcon="envelope"
                    className={`br0 ${errors || props.errorCompanyName ? 'bb b--red' : 'bb b--lightBlue'}`}
                    leftIconColor={`${errors || props.errorCompanyName ? 'red' : '#0fa3a3'}`}
                    style={{
                      boxShadow: 'none'
                    }}
                    onChange={(event: any) => {
                      setCompanyName(event.target.value);
                    }}
                    validationOnBlur={() => {
                      if (isEmpty(companyName)) {
                        setErrors('Required');
                      } else if (companyName.length > 32) {
                        setErrors('Company name must be less than 32 character.');
                      } else {
                        setErrors('');
                      }
                    }}
                  />
                </div>
                {errors ? <small className="red">{errors}</small> : ''}
              </div>
            </div>
            <div className="flex justify-end">
              <Button className="w4 grow h2 pointer mr3"
                style={{ background: '#fff', outline: 'none', border: '1px solid #0fa3a3', color: '#0fa3a3' }}
                onClick={(e: any) => {
                  e.preventDefault();
                  setShowDialog(false);
                  setErrors('');
                  setCompanyName(props.company.name);
                  props.clearChangeCompanyNameError();
                }}
              >
                cancel
              </Button>
              <Button
                type="submit"
                className="w4 grow h2 pointer"
                style={{ background: '#0fa3a3', outline: 'none', color: 'white' }}
                onClick={async (e: any) => {
                  e.preventDefault();
                  if (isEqual(props.company.name, companyName) === true) {
                    props.clearChangeCompanyNameError();
                    setShowDialog(false);
                  } else if ((isEmpty(errors))) {
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
  );
};
const mapStateToProps = (state: any) => {
  return {
    company: state.companyReducer.currentCompany,
    errorCompanyName: state.companyReducer.error
  };
};

export const GeneralView = connect(mapStateToProps, {
  changeCompanyName,
  clearChangeCompanyNameError
})(withRouter(GeneralViewComponent));
