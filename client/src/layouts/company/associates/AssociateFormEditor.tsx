import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { isEmpty, map } from 'lodash';
import { connect } from 'react-redux';

import { Button } from '@blueprintjs/core/lib/esm/components/button/buttons';

import { tokenConfig } from 'stores/UtilsActions';
import { addAssociate } from 'stores/associate/Actions';
import { server } from 'config';
import { ICompany } from 'stores/company/Reducer';

import { useLiveSearch } from 'components/useLiveSearch';
import {
  SuggestField,
  ItemEntityProps,
} from 'components/fields/SuggestField';

interface AddAssociateEditorProps {
  company: ICompany;
  showDialog: boolean;
  setShowDialog: (val: boolean) => void;
  sendingRequestSuccess: boolean;
}

interface AddAssociateEditorInternalProps
  extends AddAssociateEditorProps {
  addAssociate: (
    associateWith: ItemEntityProps,
    company: ICompany,
  ) => any;
}

const AssociateFormEditorComponent = (
  props: AddAssociateEditorInternalProps,
) => {
  const { t } = useTranslation();
  const [associates, setAssociates]: any = useState([]);
  const [selectedAssociate, setSelectedAssociate] = useState(
    {} as ItemEntityProps,
  );
  const [query, setQuery] = useState('');
  const [error] = useState('');
  const userRequestFactory = (value: string): Promise<any> => {
    const headers = tokenConfig();
    return fetch(
      `${server}company/search?name=${value}&companyId=${props.company._id}`,
      headers,
    )
      .then((res) => res.json())
      .then((res) => map(res.data, '_source'))
      .catch((err) => []);
  };

  let result: any = [];
  result = useLiveSearch(query, userRequestFactory, 800);

  useEffect(() => {
    setAssociates(result);
  }, [result]);

  return (
    <div className='pa3 mt5 mt0-ns'>
      <div className=' w-100'>
        <h1 className='f5 tigrow-lightBlue'>
          {t('app.company.Partners.Add-Partners')}
        </h1>
        <SuggestField
          onChange={(value: string) => {
            setQuery(value);
          }}
          items={associates}
          selectedItems={selectedAssociate}
          setSelectedItems={setSelectedAssociate}
        />
        <small className='white'>{error}</small>
      </div>
      <div className='flex justify-end mt4'>
        <Button
          className='grow h2 pointer white bp3-minimal w4 mr3'
          style={
            isEmpty(selectedAssociate) === true
              ? {
                background: '#34b3e9',
                outline: 'none',
                color: 'white',
              }
              : {
                background: '#34b3e9',
                outline: 'none',
                color: 'white',
              }
          }
          disabled={isEmpty(selectedAssociate)}
          onClick={async () => {
            if (isEmpty(selectedAssociate) === false) {
              const response = await props.addAssociate(
                selectedAssociate,
                props.company,
              );
              if (response === 201) {
                props.setShowDialog(!props.showDialog);
              }
            }
          }}
        >
          Add
        </Button>
        <Button
          className='grow h2 pointer white bp3-minimal w4'
          style={{
            background: '#fff',
            outline: 'none',
            border: '1px solid #34b3e9',
            color: '#34b3e9',
          }}
          onClick={(e: any) => props.setShowDialog(!props.showDialog)}
        >
          Cancel
        </Button>

        {props.sendingRequestSuccess
          && props.setShowDialog(!props.showDialog)}
      </div>
    </div>
  );
};

const mapStateToPropd = (state) => ({
  sendingRequestSuccess: state.associateReducer.sendingRequestSuccess,
});

export const AssociateFormEditor = connect(mapStateToPropd, {
  addAssociate,
})(AssociateFormEditorComponent);
