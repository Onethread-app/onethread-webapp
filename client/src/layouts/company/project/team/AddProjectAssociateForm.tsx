import React, { useState, useEffect } from 'react';
<<<<<<< HEAD
=======
// import Select from 'react-select';
>>>>>>> c885f026... add associates in the project (#19)
import {
  SuggestField,
  ItemEntityProps,
} from 'components/fields/SuggestField';
import { connect } from 'react-redux';
import { tokenConfig } from 'stores/UtilsActions';
import { Button, Tag } from '@blueprintjs/core';
import { addProjectAssociate } from 'stores/project/Actions';
import { tigrowApi } from 'config';
<<<<<<< HEAD
import { ICompany } from 'stores/company/Reducer';
import { useLiveSearch } from 'components/useLiveSearch';
import { isEqual } from 'lodash';
=======
import { isEmpty, isEqual } from 'lodash';
>>>>>>> c885f026... add associates in the project (#19)

interface ProjectAssociateProps {
  showDialog: boolean;
  setShowDialog: (val: boolean) => void;
}

interface ProjectAssociateInternalProps
  extends ProjectAssociateProps {
<<<<<<< HEAD
  company: ICompany;
=======
  companyId: string;
>>>>>>> c885f026... add associates in the project (#19)
  projectId: string;
  // tslint:disable-next-line: max-line-length
  addProjectAssociate: (
    data: {
      project: string;
      company: string;
<<<<<<< HEAD
      associates: Array<{ _id: string; size: number }>;
=======
      associates: Array<{ _id:string, size:number }>;
>>>>>>> c885f026... add associates in the project (#19)
    },
    selectedAssociate: any,
  ) => void;
}

const AddProjectAssociateFormComponent = (
  props: ProjectAssociateInternalProps,
) => {
<<<<<<< HEAD
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
      isEqual(props.company._id, e._source.company_id ) === true ?
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
=======
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
>>>>>>> c885f026... add associates in the project (#19)

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
<<<<<<< HEAD
          onChange={(query: string) => {
            setSearchAssociate(query);
          }}
          items={associates}
=======
          items={suggestedAssociate}
>>>>>>> c885f026... add associates in the project (#19)
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
<<<<<<< HEAD
            <span
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <span>{item.name}</span>
              <span style={{ padding: 3 }}>
                <select
                  value={item['size']}
                  onChange={(e: any) => {
                    let sa = [...selectedAssociate];
                    sa[index]['size'] = e.target.value;
                    setSelectedAssociate(sa);
                  }}
                >
                  {teamSizes.map((t) => {
                    return (
                      <option key={t.label + t.value} value={t.value}>
                        {t.label}
                      </option>
                    );
                  })}
                </select>
              </span>
            </span>
=======
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

            
>>>>>>> c885f026... add associates in the project (#19)
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
<<<<<<< HEAD
              company: props.company._id,
=======
              company: props.companyId,
>>>>>>> c885f026... add associates in the project (#19)
              associates: selectedAssociate.map((m: any) => {
                return {
                  _id: m._id,
                  size: m.size,
<<<<<<< HEAD
                  name: m.name
                };
              }),
            };
=======
                };
              }),
            };

>>>>>>> c885f026... add associates in the project (#19)
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
<<<<<<< HEAD
    company: state.companyReducer.currentCompany,
=======
    companyId: state.companyReducer.currentCompany._id,
>>>>>>> c885f026... add associates in the project (#19)
    projectId: state.projectReducer.pid,
    associates: state.associateReducer.associatesList,
  };
};

export const AddProjectAssociateForm = connect(mapStateToProps, {
  addProjectAssociate,
})(AddProjectAssociateFormComponent);
