import React, { useState, useEffect } from 'react';
import {
  SuggestField,
  ItemEntityProps,
} from 'components/fields/SuggestField';
import { connect } from 'react-redux';
import { tokenConfig } from 'stores/UtilsActions';
import { Button } from '@blueprintjs/core';
import { addAssociate } from 'stores/associate/Actions';
import { server } from 'config';
import { useLiveSearch } from 'components/useLiveSearch';
import { isEmpty, map } from 'lodash';

interface AddAssociateEditorProps {
  companyId: string;
  showDialog: boolean;
  setShowDialog: (val: boolean) => void;
  sendingRequestSuccess: boolean;
}

interface AddAssociateEditorInternalProps
  extends AddAssociateEditorProps {
  addAssociate: (
    associateWith: ItemEntityProps,
    companyId: string,
  ) => any;
}

const AssociateFormEditorComponent = (
  props: AddAssociateEditorInternalProps,
) => {
  const [associates, setAssociates]: any = useState([]);
  const [selectedAssociate, setSelectedAssociate] = useState(
    {} as ItemEntityProps,
  );
  const [query, setQuery] = useState('');
  const [error] = useState('');
  const userRequestFactory = (value: string): Promise<any> => {
    const headers = tokenConfig();
    return fetch(
      `${server}company/search?name=${value}&companyId=${props.companyId}`,
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
    <div className="pa3 mt5 mt0-ns">
      <div className=" w-100">
        <h1 className="f5 tigrow-lightBlue">Add Associate</h1>
        <SuggestField
          onChange={(value: string) => {
            setQuery(value);
          }}
          items={associates}
          selectedItems={selectedAssociate}
          setSelectedItems={setSelectedAssociate}
        />
        <small className="white">{error}</small>
      </div>
      <div className="flex justify-end mt4">
        <Button
          className="grow h2 pointer white bp3-minimal w4 mr3"
          style={{
            background: '#fff',
            outline: 'none',
            border: '1px solid #0fa3a3',
            color: '#0fa3a3',
          }}
          onClick={(e: any) => props.setShowDialog(!props.showDialog)}
        >
          Cancel
        </Button>
        <Button
          className="grow h2 pointer white bp3-minimal w4"
          style={
            isEmpty(selectedAssociate) === true
              ? {
                  background: '#0fa3a3',
                  outline: 'none',
                  color: 'white',
                }
              : {
                  background: '#0fa3a3',
                  outline: 'none',
                  color: 'white',
                }
          }
          disabled={isEmpty(selectedAssociate)}
          onClick={async () => {
            if (isEmpty(selectedAssociate) === false) {
              props.addAssociate(selectedAssociate, props.companyId);
            }
          }}
        >
          Add
        </Button>
        {props.sendingRequestSuccess &&
          props.setShowDialog(!props.showDialog)}
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
