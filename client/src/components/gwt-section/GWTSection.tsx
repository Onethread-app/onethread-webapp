import smile from './../../resources/LandingImages/Smile.png';

import { TiButton } from 'components/button/Button';

export const GWTSection = () => {
  return (
    <div
      className="mw9-l companiesMaxWidth mw8-m center
      ph5-ns flex flex-column-reverse flex-row-ns items-center tc tl-ns mb4"
    >
      <div className="w-50-l w-80">
        <h1 className="f2-l f3-m f5" style={{ color: '#0FB7A0' }}>
          Start Growing With TiGrow Today
        </h1>
        <h1
          className="f4-ns f6 fw4 lh-2-ns"
          style={{ color: '#0FB7A0' }}
        >
          With tools to plan and collaborate while having a seamless
          user experience that keeps everyone in the loop and focuses
          on the necessary with little to no learning curve, and a
          support team excited to help you, getting started with this
          comprehensive tool has become even easier.
        </h1>
        <TiButton to="/signup">Get TiGrow FREE</TiButton>
        <h1
          className="f4-ns f6 fw4 lh-2-ns"
          style={{ color: '#707070' }}
        >
          Get started with FREE tools, and upgrade as you grow.
        </h1>
      </div>
      <div className="w-50-l ml6-l">
        <img className="w-80-l w-100-m w-60" src={smile} />
      </div>
    </div>
  );
};
