import moment from 'moment';

interface IDueDate {
  dueDate: Date;
}

const DueDate = (props: IDueDate) => {
  return (
    <>
      {Math.ceil(
        moment(props.dueDate).diff(moment(), 'days', true),
      ) === 0 ? (
        <p
          className="bg-washed-red ph2 pv1 red br2 mv1"
          style={{
            fontSize: '12px',
          }}
        >
          Deadline ends today
        </p>
      ) : Math.ceil(
          moment(props.dueDate).diff(moment(), 'days', true),
        ) < 0 ? (
        <p
          className="ph2 pv1 br2 mv1"
          style={{
            color: '#e5e5e5',
            background: '#FF725C',
            fontSize: '12px',
          }}
        >
          Expired
        </p>
      ) : Math.ceil(
          moment(props.dueDate).diff(moment(), 'days', true),
        ) === 1 ? (
        <p
          className="ph2 pv1 br2 mv1"
          style={{
            color: '#3a844a',
            background: '#c2eacb',
            fontSize: '12px',
          }}
        >
          {Math.ceil(
            moment(props.dueDate).diff(moment(), 'days', true),
          )}{' '}
          day remaining
        </p>
      ) : (
        <p
          className="ph2 pv1 br2 mv1"
          style={{
            color: '#3a844a',
            background: '#c2eacb',
            fontSize: '12px',
          }}
        >
          {Math.ceil(
            moment(props.dueDate).diff(moment(), 'days', true),
          )}{' '}
          days remaining
        </p>
      )}
    </>
  );
};

export default DueDate;
