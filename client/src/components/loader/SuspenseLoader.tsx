import './SuspenseLoader.styles.scss';

interface ISuspenseLoader {
  insideComponent?: boolean;
}

const SuspenseLoader = (props: ISuspenseLoader) => (
  <div
    className='w-100 flex items-center justify-center'
    style={{
      height: props.insideComponent ? '100%' : '100vh',
    }}
  >
    <div className='lds-grid'>
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
    </div>
  </div>
);

export default SuspenseLoader;
