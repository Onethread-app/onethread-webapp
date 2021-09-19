import { useState } from 'react';
import { Popover } from '@blueprintjs/core/lib/esm/components/popover/popover';
import { Tooltip } from '@blueprintjs/core/lib/esm/components/tooltip/tooltip';

import { ICompany } from 'stores/company/Reducer';
import { ISubtaskMember } from 'stores/subtask/Reducer';
import { IPayloadForDeletingMember } from 'stores/subtask/Actions';
import { projectPermit } from 'stores/UtilsActions';

interface ISubtaskMemberIcon {
  member: ISubtaskMember;
  subTaskId?: string;
  company?: ICompany;
  deleteSubTaskMember: (payload: IPayloadForDeletingMember) => void;
  deletingMember: boolean;
  errorOnDeletingMember: string;
}

const SubTaskMemberIcon = (props: ISubtaskMemberIcon) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleRemove = async () => {
    if (props.subTaskId) {
      const payload = {
        _id: props.subTaskId,
        memberId: props.member._id,
      };
      await props.deleteSubTaskMember(payload);
      if (
        !props.deletingMember &&
        props.errorOnDeletingMember === ''
      ) {
        setIsOpen(false);
      }
    }
  };
  return (
    <Popover
      isOpen={isOpen}
      content={
        <div className="pa3 cf bg-white">
          <h3>Remove User</h3>
          <button
            type="button"
            className="bp3-button bp3-intent-danger mr2"
            onClick={handleRemove}
          >
            Yes, Delete
          </button>
          <button
            type="button"
            className="bp3-button bp3-intent-primary"
            onClick={() => setIsOpen(!isOpen)}
          >
            No, Keep
          </button>
        </div>
      }
    >
      <Tooltip
        content={
          <div>
            <h3
              style={{
                fontSize: '12px',
                lineHeight: '14px',
                textTransform: 'capitalize',
              }}
            >
              {props.member.firstName} {props.member.lastName}
            </h3>
            {props.company && projectPermit(props.company.role) && (
              <p
                style={{
                  fontSize: '11px',
                }}
              >
                Click To Remove User
              </p>
            )}
          </div>
        }
      >
        <img
          src={
            props.member.profileImage
              ? props.member.profileImage
              : 'https://tigrowresources.s3-ap-southeast-1.amazonaws.com/profilePhoto.svg'
          }
          alt=""
          style={{
            width: '16px',
            height: '16px',
            borderRadius: '10px',
          }}
          onClick={() =>
            props.company &&
            projectPermit(props.company.role) &&
            setIsOpen(!isOpen)
          }
          className="fr pointer mr1"
        />
      </Tooltip>
    </Popover>
  );
};

export default SubTaskMemberIcon;
