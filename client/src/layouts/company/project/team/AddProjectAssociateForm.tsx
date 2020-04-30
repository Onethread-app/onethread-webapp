import React, { useState, useEffect } from 'react';
// import Select from 'react-select';
import {
  SuggestField,
  ItemEntityProps,
} from 'components/fields/SuggestField';
import { connect } from 'react-redux';
import { tokenConfig } from 'stores/UtilsActions';
import { Button, Tag } from '@blueprintjs/core';
import { addProjectAssociate } from 'stores/project/Actions';
import { tigrowApi } from 'config';
import { isEmpty, isEqual } from 'lodash';

interface ProjectAssociateProps {
  showDialog: boolean;
  setShowDialog: (val: boolean) => void;
}

interface ProjectAssociateInternalProps
  extends ProjectAssociateProps {
  companyId: string;
  projectId: string;
  // tslint:disable-next-line: max-line-length
  addProjectAssociate: (
    data: {
      project: string;
      company: string;
      associates: Array<{ _id:string, size:number }>;
    },
    selectedAssociate: any,
  ) => void;
}

const AddProjectAssociateFormComponent = (
  props: ProjectAssociateInternalProps,
) => {
  const [suggestedAssociate, setSuggestedAssociate]: any = useState([]);
  const [selectedAssociate, setSelectedAssociate] = useState(
    [] as ItemEntityProps[],
  );

  const getSuggestionsForProjectAssociate = async () => {
    try {
      const headers = tokenConfig();
      if ((headers as any).headers.Authorization) {
        const response = await tigrowApi.get(
          `/associate/${props.companyId}`,
          headers,
        );
        const formatResponse = response.data.map((assoc: any) => 
          isEqual(props.companyId, assoc.company._id) === true
          ? {
              ...assoc.associateCompany,
              createdAt: assoc.createdAt,
              size: 5,
            }
          : {
              ...assoc.company,
              createdAt: assoc.createdAt,
              size: 5,
            }
        );
        setSuggestedAssociate(formatResponse);
      } else {
        // tslint:disable-next-line: no-console
        console.log('no headers');
      }
    } catch (error) {
      if (isEqual(error.message, 'Network Error')) {
        // tslint:disable-next-line: no-console
        console.log('network error');
      } else {
        // tslint:disable-next-line: no-console
        console.log(error.response);
      }
    }
  };

  useEffect(() => {
    if (
      isEmpty(props.projectId) === false &&
      isEmpty(props.companyId) === false
    ) {
      getSuggestionsForProjectAssociate();
    }
  }, []);

  const teamSizes = [
    { value: 5, label: '1-5' },
    { value: 10, label: '6-10' },
    { value: 15, label: '11-15' },
  ];

  return (
    <div className="pa3">
      <div className="w-100">
        <h1 className="f5 tigrow-darkBlue">Add Associates</h1>
        <SuggestField
          items={suggestedAssociate}
          selectedItems={selectedAssociate}
          setSelectedItems={setSelectedAssociate}
          multipleItemSelect={true}
        />
      </div>

      <div className="w-100 mb2">
        {selectedAssociate.map((item, index) => (
          <Tag
            key={item._id}
            className="ma1 pa2"
            style={{ backgroundColor: '#3b5998', color: 'white' }}
            interactive={true}
            onRemove={(e) => {
              const filteredItems = selectedAssociate.filter(
                (selectedItem) => item.name !== selectedItem.name,
              );
              setSelectedAssociate([...filteredItems]);
            }}
            large={true}
          >
            <span style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
              <span>
                {item.name}
              </span>
              <span style={{padding: 3}}>
                <select value={item['size']} onChange={(e:any) => {
                  let sa = [...selectedAssociate];
                  sa[index]['size'] = e.target.value;
                  console.log(sa);
                  setSelectedAssociate(sa);
                }}>
                  {
                    teamSizes.map(t=>{
                      return <option key={t.label+t.value} value={t.value}>{t.label}</option>
                    })
                  }
                </select>
              </span>
            </span>

            
          </Tag>
        ))}
      </div>

      <div className="flex justify-end mt3">
        <Button
          className="grow h2 pointer white bp3-minimal w4 mr3"
          style={{
            background: '#fff',
            outline: 'none',
            border: '1px solid #3b5998',
            color: '#3b5998',
          }}
          onClick={(e: any) => props.setShowDialog(!props.showDialog)}
        >
          Cancel
        </Button>
        <Button
          className="grow h2 pointer white bp3-minimal w4 outline-0"
          style={{ backgroundColor: '#3b5998', color: 'white' }}
          disabled={selectedAssociate.length === 0}
          onClick={async () => {
            const data = {
              project: props.projectId,
              company: props.companyId,
              associates: selectedAssociate.map((m: any) => {
                return {
                  _id: m._id,
                  size: m.size,
                };
              }),
            };

            const response: any = await props.addProjectAssociate(
              data,
              selectedAssociate,
            );

            if (response.status === 200) {
              props.setShowDialog(!props.showDialog);
            }
          }}
        >
          Add
        </Button>
      </div>
    </div>
  );
};

const mapStateToProps = (state: any) => {
  return {
    companyId: state.companyReducer.currentCompany._id,
    projectId: state.projectReducer.pid,
    associates: state.associateReducer.associatesList,
  };
};

export const AddProjectAssociateForm = connect(mapStateToProps, {
  addProjectAssociate,
})(AddProjectAssociateFormComponent);
