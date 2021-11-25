import { useMemo, useState } from 'react';
import { connect, useSelector } from 'react-redux';
import { useHistory } from 'react-router';

import { IRoom } from 'stores/room/Reducer';
import { List } from './ProjectDiscussion.styles';
import addMembers from 'resources/images/addMembers.png';
import { Dialog } from '@blueprintjs/core';
import { MembersList } from 'layouts/company/room/chatLayout/members/MembersList';
import useQuery from 'helpers/hooks/useQuery';

interface Props {
  discussion: IRoom;
  changeRoom: (discussionId: string) => void;
  active: boolean;
  users: any;
}

const DiscussionItem = (props: Props) => {
  const { active, discussion, changeRoom } = props;
  const unreadCount = useSelector(
    (state: any) =>
      state.roomReducer.roomNotification.roomsUnreadCount &&
      state.roomReducer.roomNotification.roomsUnreadCount[
        discussion._id
      ],
  );
  const [showMemberListDialog, setShowMemberListDialog] =
    useState(false);
  const history = useHistory();
  const query = useQuery();
  const tabValue = useMemo(() => {
    return query.get('tab') || '0';
  }, [query]);
  const threadId = useMemo(() => {
    return query.get('thread') || '0';
  }, [query]);

  return (
    <List
      to={`${history.location.pathname}?tab=${tabValue}&discussion=${discussion._id}&thread=${threadId}`}
      key={discussion._id}
      onClick={() => changeRoom(discussion._id)}
      active={active}
    >
      <span className="black flex">
        {discussion.name}{' '}
        {unreadCount > 0 ? (
          <h6
            className="bg-tigrowLightBlue white fw8 ma0 ml1"
            style={{
              padding: '3px 6px',
              borderRadius: '50%',
            }}
          >
            {unreadCount}
          </h6>
        ) : null}
      </span>
      <span>
        <img
          src={addMembers}
          alt=""
          className="mr1"
          onClick={() =>
            setShowMemberListDialog(!showMemberListDialog)
          }
        />
        {discussion.memberCount}
      </span>
      {showMemberListDialog && (
        <Dialog
          onClose={() =>
            setShowMemberListDialog(!showMemberListDialog)
          }
          isOpen={showMemberListDialog}
          style={{ background: '#fff' }}
        >
          <MembersList users={props.users} />
        </Dialog>
      )}
    </List>
  );
};

const mapStateToProps = (state: any) => ({
  users: state.roomReducer.users,
});

export default connect(mapStateToProps)(DiscussionItem);
