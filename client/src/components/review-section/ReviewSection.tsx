interface IReviewProps {
  customerReview: {
    customer: string;
    position: string;
    company: string;
    review: string;
  };
  bgBlue?: boolean;
}

export const ReviewSection = ({
  customerReview,
  bgBlue,
}: IReviewProps) => {
  if (bgBlue) {
    return (
      <section
        className='tc flex flex-column justify-center'
        style={{ height: '450px', backgroundColor: '#0FB7A0' }}
      >
        <h1 className='white f2-ns f5'>Why People Choose TiGrow</h1>
        <div className='flex flex-column items-center'>
          <h1 className='white f3-ns f6 fw4 w-40-l w-80 colorfulWidth tl lh-2'>
            <span
              className='f1 fw9 i'
              style={{ fontFamily: 'cambria', marginLeft: '-1.2rem' }}
            >
              "
            </span>
            {customerReview.review}
            <span
              className='f1 fw9 i'
              style={{ fontFamily: 'cambria' }}
            >
              "
            </span>
          </h1>
          <h1 className='white f3-ns f6 fw4 w-40-l w-80 colorfulWidth tl'>
            {customerReview.customer}
          </h1>
          <h1 className='white f5-ns f7 fw4 w-40-l w-80 colorfulWidth tl ma0'>
            {`${customerReview.position} | ${customerReview.company}`}
          </h1>
        </div>
      </section>
    );
  }
  return (
    <section className='tc flex flex-column justify-center ph5-l ph4 mv5-l mv4'>
      <div className='flex flex-column items-center'>
        <h1
          className='f3-ns f6 fw4 w-60-l w-80 colorfulWidth quote tl lh-2'
          style={{ color: '#43466D' }}
        >
          {customerReview.review}
        </h1>
        <h1
          style={{ color: '#707070' }}
          className='f3-ns f6 fw4 w-60-l w-80 colorfulWidth tl'
        >
          {customerReview.customer}
        </h1>
        <h1
          style={{ color: '#707070' }}
          className='f5-ns f7 fw4 w-60-l w-80 colorfulWidth tl ma0'
        >
          {`${customerReview.position} | ${customerReview.company}`}
        </h1>
      </div>
    </section>
  );
};
