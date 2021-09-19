import { MobileView, isMobileOnly } from 'react-device-detect';

import FeedbackForm from 'components/feedback/FeedbackForm';
import Navbar from 'components/navbar/Navbar';

const Feedback = () => {
  return (
    <>
      <MobileView>
        <Navbar type="company" />
      </MobileView>
      <div
        className={`flex flex-column w-100 pl4-ns pr2-ns ph3 pb4 mt5 mt0-ns ${
          isMobileOnly ? 'mb4' : ''
        }`}
      >
        <div className="flex items-center justify-center w-100">
          <FeedbackForm />
        </div>
      </div>
    </>
  );
};

export default Feedback;
