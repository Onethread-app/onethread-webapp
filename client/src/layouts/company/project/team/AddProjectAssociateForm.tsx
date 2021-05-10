import React, { useState, useEffect } from 'react';
import {
  SuggestField,
  ItemEntityProps,
} from 'components/fields/SuggestField';
import { connect } from 'react-redux';
import { tokenConfig } from 'stores/UtilsActions';
import { Button, Tag } from '@blueprintjs/core';
import { addProjectAssociate } from 'stores/project/Actions';
import { tigrowApi } from 'config';
import { ICompany } from 'stores/company/Reducer';
import { useLiveSearch } from 'components/useLiveSearch';
import { isEqual } from 'lodash';
interface ProjectAssociateProps {
  showDialog: boolean;
  setShowDialog: (val: boolean) => void;
}

interface ProjectAssociateInternalProps
  extends ProjectAssociateProps {
  company: ICompany;
  projectId: string;
  // tslint:disable-next-line: max-line-length
  addProjectAssociate: (
    data: {
      project: string;
      company: string;
      associates: Array<{ _id: string; size: number }>;
    },
    selectedAssociate: any,
  ) => void;
  isLoading: boolean;
}

const AddProjectAssociateFormComponent = (
  props: ProjectAssociateInternalProps,
) => {
  const [associates, setAssociates] = useState([]);
  const [selectedAssociate, setSelectedAssociate] = useState(
    [] as ItemEntityProps[],
  );
  const [searchAssociate, setSearchAssociate] = useState('');

  const userRequestFactoryAssociate = async (userName: string) => {
    const headers = tokenConfig();
    const response = await tigrowApi.get(
      `projects/associate-company-search/${
      props.company._id
      }?name=${searchAssociate}&companyName=${props.company.name}`,
      headers,
    );

    // return response.data.data.map((e: any) => {
    //   return {
    //     _id: e._source.mongo_id,
    //     name: e._source.associateCompanyName,
    //     size: 5
    //   };
    // });
    const asso = response.data.data.map((e: any) =>
      isEqual(props.company._id, e._source.company_id) === true ?
        {
          _id: e._source.mongo_id,
          name: e._source.associateCompanyName,
          size: 5
        }
        :
        {
          _id: e._source.mongo_id,
          name: e._source.companyName,
          size: 5
        }
    );
    return asso;
  };

  let resultAssociate: any = [];
  resultAssociate = useLiveSearch(searchAssociate, userRequestFactoryAssociate, 0);
  // const getSuggestionsForProjectAssociate = async () => {
  //   try {
  //     const headers = tokenConfig();
  //     if ((headers as any).headers.Authorization) {
  //       const response = await tigrowApi.get(
  //         `/associate/${props.companyId}`,
  //         headers,
  //       );
  //       const formatResponse = response.data.map((assoc: any) =>
  //         isEqual(props.companyId, assoc.company._id) === true
  //           ? {
  //               ...assoc.associateCompany,
  //               createdAt: assoc.createdAt,
  //               size: 5,
  //             }
  //           : {
  //               ...assoc.company,
  //               createdAt: assoc.createdAt,
  //               size: 5,
  //             },
  //       );
  //       console.log(formatResponse);

  //       setSuggestedAssociate(formatResponse);
  //     } else {
  //       // tslint:disable-next-line: no-console
  //       console.log('no headers');
  //     }
  //   } catch (error) {
  //     if (isEqual(error.message, 'Network Error')) {
  //       // tslint:disable-next-line: no-console
  //       console.log('network error');
  //     } else {
  //       // tslint:disable-next-line: no-console
  //       console.log(error.response);
  //     }
  //   }
  // };

  useEffect(() => {
    setAssociates(resultAssociate);
  }, [resultAssociate]);

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
          onChange={(query: string) => {
            setSearchAssociate(query);
          }}
          items={associates}
          selectedItems={selectedAssociate}
          setSelectedItems={setSelectedAssociate}
          multipleItemSelect={true}
        />
      </div>

      <div className="w-100 mb2">
        {selectedAssociate.map((item, index) => (
          <>
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
              <span
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <span>{item.name}</span>
              </span>
            </Tag>
            <span style={{ padding: 3 }}>
              <select
                onChange={(e: any) => {
                  const sa = [...selectedAssociate];
                  sa[index].size = e.target.value;
                  setSelectedAssociate(sa);
                }}
                className="pa1" 
              >
                <option selected value="">No. of employee</option>
                {teamSizes.map((t) => {
                  return (
                    <option key={t.label + t.value} value={t.value}>
                      {t.label}
                    </option>
                  );
                })}
              </select>
            </span>
          </>
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
              company: props.company._id,
              associates: selectedAssociate.map((m: any) => {
                return {
                  _id: m._id,
                  size: m.size,
                  name: m.name
                };
              }),
            };
            const response: any = await props.addProjectAssociate(
              data,
              selectedAssociate,
            );

            if (response && props.isLoading === false) {
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
    company: state.companyReducer.currentCompany,
    projectId: state.projectReducer.pid,
    associates: state.associateReducer.associatesList,
    isLoading: state.projectReducer.projectLoading,
  };
};

export const AddProjectAssociateForm = connect(mapStateToProps, {
  addProjectAssociate,
})(AddProjectAssociateFormComponent);
