import { Button } from '@blueprintjs/core/lib/esm/components/button/buttons';

interface ICgcProps {
  setShowContactUs: (val: boolean) => void;
}

export const CGCSection = ({ setShowContactUs }: ICgcProps) => (
  <div className='LandingSecondBackground w-100'>
    <div className='mh6-ns mh4 tc pt4-ns pt3'>
      <h1 className='f2-l f3-m f5 fw7 white mt6-l mt4-m'>
        Connect, Grow and Collaborate with Tigrow and find a
        thriving community behind you.
      </h1>
      <h1 className='f3-l f4-m f5 fw4 white'>
        From Managing Multiple Teams To Effortless Communication
        Channels, We've Got You Covered. we're working relentlessly
        to provide you with best customer support so that you can
        get the most out of your tools.
      </h1>
      <Button
        className='f4-ns fw6 bp3-minimal pa3-ns br2 mb5 requestDemoBtn'
        style={{
          color: 'WHITE',
          border: 'solid 2px WHITE',
          backgroundColor: '#0FB7A0',
        }}
        onClick={() => setShowContactUs(true)}
      >
        Request For A Demo
      </Button>
    </div>
  </div>
);
