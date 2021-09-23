import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { server, tigrowApi } from 'config';
import { isEmpty, isEqual, map } from 'lodash';

import { Toaster } from '@blueprintjs/core/lib/esm/components/toast/toaster';
import { Position } from '@blueprintjs/core/lib/esm/common/position';
import { Tag } from '@blueprintjs/core/lib/esm/components/tag/tag';
import { Button } from '@blueprintjs/core/lib/esm/components/button/buttons';

import { ICompany } from 'stores/company/Reducer';
import { tokenConfig, isEmail } from 'stores/UtilsActions';
import {
  addTeamMembers,
  getCompanyMembers,
} from 'stores/company/Actions';

import {
  SuggestField,
  ItemEntityProps,
} from 'components/fields/SuggestField';
import { useLiveSearch } from 'components/useLiveSearch';

interface TeamMembersViewProps {
  showDialog: boolean;
  setShowDialog: (val: boolean) => void;
}

interface TeamMembersViewInternalProps extends TeamMembersViewProps {
  company: ICompany;
  addTeamMembers: (
    members: Array<{ account: string | undefined; company: string }>,
    pendingTeamMembers: string[],
    companyId: string,
  ) => void;
  getCompanyMembers: () => void;
}

const AddColleaguesFormComponent = (
  props: TeamMembersViewInternalProps,
) => {
  const [teamMembers, setTeamMembers]: any = useState(
    [] as ItemEntityProps[],
  );

  const [selectedTeamMember, setSelectedTeamMember] = useState(
    [] as ItemEntityProps[],
  );

  const [pendingTeamMembers, setPendingTeamMembers] = useState(
    [] as string[],
  );

  const [email, setEmail] = useState('');

  const userRequestFactory = (name: string): Promise<any> => {
    const headers = tokenConfig();
    return fetch(
      `${server}company/${props.company._id}/members/search?name=${name}`,
      headers,
    )
      .then((res) => res.json())
      .then((res) => map(res.data, '_source'))
      .catch((err) => []);
  };

  let result: any = [];
  result = useLiveSearch(email, userRequestFactory, 0);

  useEffect(() => {
    setTeamMembers(result);
  }, [result]);

  const checkPendingMemberStatus = async (_email: string) => {
    try {
      const headers = tokenConfig();
      if ((headers as any).headers.Authorization) {
        const response = await tigrowApi.get(
          `company/${props.company._id}/members/pending/status?email=${_email}`,
          headers,
        );
        return response.data;
      }
      // tslint:disable-next-line: no-console

      return { status: false, message: 'Authorization Error' };
    } catch (error: any) {
      // tslint:disable-next-line: no-console

      return {
        status: false,
        message: isEqual(error.message, 'Network Error')
          ? 'Network Error'
          : 'Server Error',
      };
    }
  };

  const addNewUser = async (newUser: ItemEntityProps) => {
    if (
      props.company.members.some(
        (member) => member.account.email === email,
      )
    ) {
      Toaster.create({
        position: Position.TOP,
      }).show({
        message: 'Already exist in this company.',
        intent: 'danger',
      });
    } else {
      const res = await checkPendingMemberStatus(email);
      if (res.status) {
        setPendingTeamMembers([...pendingTeamMembers, newUser.name!]);
      } else {
        Toaster.create({
          position: Position.TOP,
        }).show({
          message: res.message,
          intent: 'danger',
        });
      }
    }
  };

  return (
    <div className='pa3'>
      <div className=' w-100'>
        <h1 className='f5 tigrow-lightBlue'>Add members</h1>
        <SuggestField
          onChange={(query: string) => {
            setEmail(query);
          }}
          items={teamMembers}
          selectedItems={selectedTeamMember}
          setSelectedItems={setSelectedTeamMember}
          multipleItemSelect
          isCreatable={
            !!(isEmpty(teamMembers) && isEmail(email))
          }
          isCreatableAPI={addNewUser}
        />
      </div>
      <div className='w-100'>
        {selectedTeamMember.map((item) => (
          <Tag
            key={item._id}
            className='ma1 pa2'
            interactive
            onRemove={(e) => {
              const filteredItems = selectedTeamMember.filter(
                (selectedItem) => item.name !== selectedItem.name,
              );
              setSelectedTeamMember([...filteredItems]);
            }}
            large
            intent='primary'
          >
            {item.name}
          </Tag>
        ))}
      </div>
      {pendingTeamMembers.length ? (
        <small>Invited Members:</small>
      ) : undefined}
      <div className='w-100'>
        {pendingTeamMembers.map((item, index) => (
          <Tag
            key={index}
            className='ma1 pa2'
            interactive
            onRemove={(e) => {
              const filteredItems = pendingTeamMembers.filter(
                (selectedItem) => item !== selectedItem,
              );
              setPendingTeamMembers([...filteredItems]);
            }}
            large
            intent='primary'
          >
            {item}
          </Tag>
        ))}
      </div>

      {selectedTeamMember.length + pendingTeamMembers.length > 20 ? (
        <small className='red'>
          Could not add more than 20 members at a time.
        </small>
      ) : undefined}

      <div className='flex justify-end mt4'>
        <Button
          className='grow h2 pointer white bp3-minimal w4 mr3'
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
        <Button
          className='grow h2 pointer white bp3-minimal w4'
          style={
            selectedTeamMember.length + pendingTeamMembers.length
              > 0
            && selectedTeamMember.length + pendingTeamMembers.length
              <= 20
              ? {
                background: '#34b3e9',
                outline: 'none',
                color: 'white',
              }
              : {
                background: '#011b1b2e',
                outline: 'none',
                color: 'white',
              }
          }
          disabled={
            !(selectedTeamMember.length + pendingTeamMembers.length
              > 0
            && selectedTeamMember.length + pendingTeamMembers.length
              <= 20)
          }
          onClick={async () => {
            const userIdWithCompany = selectedTeamMember.map(
              (selected: any) => ({
                account: selected.mongo_id,
                company: props.company._id,
              }),
            );

            if (userIdWithCompany || pendingTeamMembers) {
              await props.addTeamMembers(
                userIdWithCompany,
                pendingTeamMembers,
                props.company._id,
              );
            }
            await props.getCompanyMembers();
            props.setShowDialog(!props.showDialog);
          }}
        >
          Add
        </Button>
      </div>
    </div>
  );
};

const mapStateToProps = (state: any) => ({
  company: state.companyReducer.currentCompany,
});

export const AddColleaguesForm = connect(mapStateToProps, {
  addTeamMembers,
  getCompanyMembers,
})(AddColleaguesFormComponent);
