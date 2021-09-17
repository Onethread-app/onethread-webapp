import React from 'react';
import moment from 'moment';

import { ITrack } from 'stores/time-tracker/Reducer';

import { msToTime } from 'helpers/utils';
import useWindowSize from 'helpers/hooks/useWindowSize';
import TaskStatusTag from 'components/task/TaskStatusTag';
import MemberIcon from 'components/member/MemberIcon';

import {
  TrackItemContainer,
  TrackPart,
} from './TrackedListDialog.styles';

interface ITrackItem {
  item: ITrack;
}

const TrackItem = (props: ITrackItem) => {
  const { item } = props;
  const windowSize = useWindowSize();

  return (
    <TrackItemContainer
      height={windowSize.height}
      width={windowSize.width}
    >
      <TrackPart>
        <p>{msToTime(item.duration)}</p>
        <p>{moment(item.start_time).format('MMM DD, hh:mm a')}</p>
      </TrackPart>
      <TrackPart>
        <TaskStatusTag status={item.column.name.replace(/ /g, '-')} />
        <MemberIcon
          _id={item.account._id}
          name={`${item.account.firstName} ${item.account.lastName}`}
          profileImage={item.account.profileImage}
          small
        />
      </TrackPart>
    </TrackItemContainer>
  );
};

export default TrackItem;
