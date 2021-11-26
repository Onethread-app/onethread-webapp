import { Fragment } from 'react';
import Skeleton from '@material-ui/lab/Skeleton';

const DiscussionSkeleton = () => {
  return (
    <>
      {[...Array(window.innerHeight > 1079 ? 6 : 3)].map((x, i) => (
        <Fragment key={i}>
          <Skeleton className={`w-100`} height={50} />
        </Fragment>
      ))}
    </>
  );
};

export default DiscussionSkeleton;
