import moment from 'moment';

import { ITrack } from 'stores/time-tracker/Reducer';

import { msToTime } from 'helpers/utils';
import useWindowSize from 'helpers/hooks/useWindowSize';
// import TaskStatusTag from 'components/task/TaskStatusTag';
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
        <p>{moment(item.startTime).format('MMM DD, hh:mm a')}</p>
      </TrackPart>
      <TrackPart>
        {/* <TaskStatusTag status={item.column.name.replace(/ /g, '-')} /> */}
        <MemberIcon
          _id={item.task.account._id}
          name={`${item.task.account.firstName} ${item.task.account.lastName}`}
          profileImage={item.task.account.profileImage}
          small
        />
      </TrackPart>
    </TrackItemContainer>
  );
};

export default TrackItem;
