import React, { useState } from 'react';
import { CustomView, isMobileOnly, MobileOnlyView } from 'react-device-detect';
import { Button, Dialog } from '@blueprintjs/core';
import { ExpansionPanel, ExpansionPanelSummary, Typography, ExpansionPanelDetails } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import fb from './../../resources/LandingImages/fbIcon.png';
import youtubeIcon from './../../resources/LandingImages/youtubeIcon.png';
import linkedInIcon from './../../resources/LandingImages/linkedInIcon.png';
import tigrowFooter from './../../resources/LandingImages/tigrowFooter.png';
import { ContactSupportForm } from './ContactSupportForm';

export const LandingFooter = (
) => {
  const [showForm1, setShowForm1] = useState(false);
  return (
    <div>
      <CustomView condition={!isMobileOnly}>
        <div className="ph6-l ph4 pv4 paddingFooter" style={{ background: '#43466D' }}>
          <div className="flex-ns w-100">
            <div className="w-25">
              <h1 className="f4-l f5-m white">Manage Your Projects</h1>
              <h1 className="f5-l f6-m fw3 white">Project Management Tool</h1>
              <h1 className="f5-l f6-m fw3 white">Video Conferencing Tool</h1>
              <h1 className="f5-l f6-m fw3 white">Kanban Board</h1>
              <h1 className="f5-l f6-m fw3 white">Agile Way</h1>
            </div>
            <div className="w-25 ml2-ns">
              <h1 className="f4-l f5-m white">Manage Your Vendors</h1>
              <h1 className="f5-l f6-m fw3 white">Vendor Management Tool</h1>
              <h1 className="f5-l f6-m fw3 white">Quotation Revealing</h1>
              <h1 className="f5-l f6-m fw3 white">Smart Contract</h1>
            </div>
            <div className="w-25 ml2-ns">
              <h1 className="f4-l f5-m white">Find New Partners</h1>
              <h1 className="f5-l f6-m fw3 white">Technological Vendors</h1>
              <h1 className="f5-l f6-m fw3 white">Digital Marketing</h1>
              <h1 className="f5-l f6-m fw3 white">Channel Partners</h1>
            </div>
            <div className="w-25 ml2-ns">
              <h1 className="f4-l f5-m white">Find New Teammates</h1>
              <h1 className="f5-l f6-m fw3 white">Remote Team Hiring</h1>
              <h1 className="f5-l f6-m fw3 white">Request For Teammates</h1>
              <h1 className="f5-l f6-m fw3 white">How To Be A Teammate?</h1>
              <h1 className="f5-l f6-m fw3 white">Post Your Portfolio/Services</h1>
            </div>
          </div>
          <div className="w-100">
            <h1 className="f4-l f5-m white">Support And Tools</h1>
            <h1 className="f5-l f6-m fw3 white">TiGrow Partners</h1>
            <h1 className="f5-l f6-m fw3 white">Join A Local User Group</h1>
          </div>
          <Button
            className="f4 fw6 bp3-minimal pa3 br2 mv4"
            style={{ color: '#43466D', backgroundColor: 'white' }}
            onClick={() => {
              setShowForm1(true);
            }}
          >
            Contact TiGrow Support
          </Button>
          <div className="flex items-center">
            <a href="https://web.facebook.com/TiGrow2020/" rel="noopener noreferrer" >
              <img src={fb} />
            </a>
            <a 
            href="https://www.youtube.com/channel/UCJSox3eBrv-L5JP33Grp0NQ" rel="noopener noreferrer" 
            >
              <img className="mh4" src={youtubeIcon} />
            </a>
            <a href="https://www.linkedin.com/company/tigrowlimited" rel="noopener noreferrer" >
              <img src={linkedInIcon} />
            </a>
          </div>
          <div className="tc bb b--white mt5 flex justify-center">
            <p className="white fw6 f5">English</p>
            <p className="white f5 ml4">বাংলা</p>
          </div>
          <div className="flex justify-between mv4">
            <div>
              <img src={tigrowFooter} />
              <p className="white">Copyright&copy; 2020 TiGrow Technologies llc.</p>
            </div>
            <div className="flex">
              <p className="white fw6">Legal Stuff</p>
              <p className="white ml4 fw6">Privacy Policy</p>
            </div>
          </div>
        </div>
      </CustomView>
      <MobileOnlyView>
        <div className="tc ph4 pv4" style={{ background: '#43466D' }}>
          <ExpansionPanel style={{ background: '#43466D', boxShadow: 'none' }}>
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon style={{ color: 'white' }} />}
              aria-controls="panel1a-content"
              id="panel1a-header"
              style={{ background: '#43466D' }}
            >
              <Typography style={{ background: '#43466D', color: 'white' }}>
                Manage Your Projects
                </Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails 
            style={{ display: 'flex', flexDirection: 'column', color: 'white', textAlign: 'left' }}
            >
              <Typography>Project Management Tool</Typography>
              <Typography>Video Conferencing Tool</Typography>
              <Typography>Kanban Board</Typography>
              <Typography>Agile Way</Typography>
            </ExpansionPanelDetails>
          </ExpansionPanel>
          <ExpansionPanel style={{ background: '#43466D', boxShadow: 'none' }}>
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon style={{ color: 'white' }} />}
              aria-controls="panel1a-content"
              id="panel1a-header"
              style={{ background: '#43466D' }}
            >
              <Typography style={{ background: '#43466D', color: 'white' }}>
                Manage Your Vendors
                </Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails 
            style={{ display: 'flex', flexDirection: 'column', color: 'white', textAlign: 'left' }}
            >
              <Typography>Vendor Management Tool</Typography>
              <Typography>Quotation Revealing</Typography>
              <Typography>Smart Contract</Typography>
            </ExpansionPanelDetails>
          </ExpansionPanel>
          <ExpansionPanel style={{ background: '#43466D', boxShadow: 'none' }}>
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon style={{ color: 'white' }} />}
              aria-controls="panel1a-content"
              id="panel1a-header"
              style={{ background: '#43466D' }}
            >
              <Typography style={{ background: '#43466D', color: 'white' }}>
                Find New Partners
                </Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails 
            style={{ display: 'flex', flexDirection: 'column', color: 'white', textAlign: 'left' }}
            >
              <Typography>Technological Vendors</Typography>
              <Typography>Digital Marketing</Typography>
              <Typography>Channel Partners</Typography>
            </ExpansionPanelDetails>
          </ExpansionPanel>
          <ExpansionPanel style={{ background: '#43466D', boxShadow: 'none' }}>
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon style={{ color: 'white' }} />}
              aria-controls="panel1a-content"
              id="panel1a-header"
              style={{ background: '#43466D' }}
            >
              <Typography style={{ background: '#43466D', color: 'white' }}>
                Find New Teammates
                </Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails 
            style={{ display: 'flex', flexDirection: 'column', color: 'white', textAlign: 'left' }}
            >
              <Typography>Remote Team Members</Typography>
              <Typography>Request For Teammates</Typography>
              <Typography>How To Be A Teammate?</Typography>
              <Typography>Post Your Portfolio Or Services</Typography>
            </ExpansionPanelDetails>
          </ExpansionPanel>
          <ExpansionPanel className="mv2" style={{ background: '#43466D', boxShadow: 'none' }}>
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon style={{ color: 'white' }} />}
              aria-controls="panel1a-content"
              id="panel1a-header"
              style={{ background: '#43466D' }}
            >
              <Typography style={{ background: '#43466D', color: 'white' }}>
                Support & Tools
                </Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails 
            style={{ display: 'flex', flexDirection: 'column', color: 'white', textAlign: 'left' }}
            >
              <Typography>Tigrow Partners</Typography>
              <Typography>Join A Local User Group</Typography>
            </ExpansionPanelDetails>
          </ExpansionPanel>
          <Button
            className="f4-ns f5 fw6 bp3-minimal pa3-ns pa2 br2 mv4"
            style={{ color: '#43466D', backgroundColor: 'white' }}
            onClick={() => {
              setShowForm1(true);
            }}
          >
            Contact Tigrow Support
          </Button>
          <div className="flex items-center tc">
            <a href="https://web.facebook.com/TiGrow2020/" rel="noopener noreferrer" >
              <img src={fb} />
            </a>
            <a 
            href="https://www.youtube.com/channel/UCJSox3eBrv-L5JP33Grp0NQ" rel="noopener noreferrer" 
            >
              <img className="mh4" src={youtubeIcon} />
            </a>
            <a href="https://www.linkedin.com/company/tigrowlimited" rel="noopener noreferrer" >
              <img src={linkedInIcon} />
            </a>
          </div>
          <div className="tc bb b--white mt3 flex justify-center">
            <p className="white fw6 f7">English</p>
            <p className="white fw6 f7 ml3">বাংলা</p>
          </div>
          <div className="flex justify-between pt2">
            <p className="white fw6 f7">Legal Stuff</p>
            <p className="white fw6 f7">Privacy Policy</p>
          </div>
          <div>
            <p className="white f7">Copyright&copy; 2020 TiGrow Technologies llc.</p>
          </div>
        </div>
      </MobileOnlyView>
      {showForm1 && (
        <Dialog
          icon="briefcase"
          onClose={() => setShowForm1(!showForm1)}
          isOpen
          style={{ background: '#fff' }}
        >
          <ContactSupportForm setShowDialog={setShowForm1} title="Contact Tigrow Support" />
        </Dialog>
      )}
    </div>
  );
};