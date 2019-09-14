import React, { useState } from 'react';
import { isEmpty } from 'lodash';
import { InputGroupField } from 'components/common/InputGroup';
import {
  Alignment, Button, Navbar, Dialog, Classes, Popover, PopoverInteractionKind, Position, HTMLSelect, Collapse, ButtonGroup
} from "@blueprintjs/core";

export const LandingPage = () => {

  const [values, setValues] = useState({
    companyName: "",
    companyEmailAddress: "",
    legalOwnersName: "",
    legalOwnersEmailAddress: "",
    location: ""

  });

  const emailValidation = (email: string) => {
    const regexForEmailValidation = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (email.match(regexForEmailValidation)) {
      return true;
    } else {
      return false;
    }
  }

  const { companyName, companyEmailAddress, legalOwnersName, legalOwnersEmailAddress } = values;

  const [errors, setErrors] = useState({
    companyName: "",
    companyEmailAddress: "",
    legalOwnersName: "",
    legalOwnersEmailAddress: "",
    locationName: ""

  });

  const handleChange = (name: string) => (event: any) => {
    const value = event.target.value;
    setValues({ ...values, [name]: value });
  };

  const onChange = (name: string) => (event: any) => {
    const value = event.currentTarget.value;
    setValues({ ...values, [name]: value });

  }
  const [showCollapse, setShowCollapse] = useState(false);
  const [showDialog, setShowDialog] = useState(false);


  return (
    <div className="bg-near-white vh-100">
      <Navbar>
        <Navbar.Group align={Alignment.LEFT}>
          <Button onClick={() => setShowCollapse(!showCollapse)}><div className="bp3-icon-menu" /></Button>
          <Navbar.Heading>TiGrow</Navbar.Heading>
        </Navbar.Group>

        <Navbar.Group align={Alignment.RIGHT}>
          <Popover
            interactionKind={PopoverInteractionKind.CLICK}
            popoverClassName="bp3-popover-content-sizing"
            position={Position.BOTTOM}
          >
            <Button className="bp3-minimal">Company</Button>
            <div>
              <h5>Company List</h5>
              <p>Currently you have no company</p>
              <Button onClick={() => setShowDialog(!showDialog)} className="" text="Create A Company" />
              <Button className="bp3-popover-dismiss">Dismiss</Button>
            </div>
          </Popover>
        </Navbar.Group>
      </Navbar>

      {showDialog && (
        <Dialog
          icon="briefcase"
          onClose={() => setShowDialog(!showDialog)}
          title="Company Sign Up"
          isOpen
          style={{ background: '#fff' }}
        >
          <div className={Classes.DIALOG_BODY}>
            <form className="fl w-100 pa2">

              <div className={` ${errors.companyName ? "mb3" : "mb4"}`}>
                <div className="flex">
                  <InputGroupField
                    value={companyName}
                    onChange={handleChange("companyName")}
                    placeHolder="Company Name"
                    leftIcon="briefcase"
                    leftIconColor="#0fa3a3"
                    style={{
                      borderBottom: "1px solid #0fa3a3",
                      boxShadow: 'none',
                      borderRadius: '0px',
                      backgroundColor: 'none'
                    }}
                    validationOnBlur={() => {
                      if (isEmpty(companyName)) {
                        const companyNameError = { ...errors, companyName: "Please enter company name" };
                        setErrors(companyNameError);
                      } else {
                        const companyNameError = { ...errors, companyName: "" }
                        setErrors(companyNameError);
                      }
                    }}
                  />
                </div>
                {errors.companyName ? <small style={{ color: 'red' }}>{errors.companyName}</small> : ""}
              </div>
              <div className="flex mb4">
                <div className=" bp3-icon-map-marker f5 pa1 bb b--lightBlue"
                  style={{
                    color: "#0fa3a3",
                  }}
                ></div>
                <HTMLSelect
                  fill={true}
                  minimal={true}
                  onChange={onChange('location')}
                  className=" bb b--lightBlue"
                  style={{
                    boxShadow: 'none',
                    flex: '1',
                    outline: 'none',
                    borderRadius: "0px",
                    background: "white"
                  }}
                >
                  <option selected value="Dhaka">Dhaka</option>
                  <option value="Chittagong">Chittagong</option>
                  <option value="Khulna">Khulna</option>
                  <option value="Rajshahi">Rajshahi</option>
                  <option value="Barishal">Barishal</option>
                  <option value="Sylhet">Sylhet</option>
                </HTMLSelect>

              </div>

              <div className="flex mb4">
                <div className=" bp3-icon-briefcase f5 pa1 bb b--lightBlue"
                  style={{
                    color: "#0fa3a3"
                  }}
                ></div>
                <HTMLSelect
                  fill={true}
                  minimal={true}
                  onChange={onChange('companyType')}
                  className=" bb b--lightBlue"
                  style={{
                    boxShadow: 'none',
                    borderRadius: '0px',
                    backgroundColor: 'white',
                    flex: '1',
                    outline: 'none'
                  }}
                >
                  <option selected value="Industrial">Industrial</option>
                  <option value="Agricultural">Agricultural</option>
                </HTMLSelect>
              </div>

              <div className={` ${errors.companyEmailAddress ? "mb3" : "mb4"}`}>
                <div className="flex">
                  <InputGroupField
                    value={companyEmailAddress}
                    onChange={handleChange("companyEmailAddress")}
                    placeHolder="Company Email Address"
                    leftIcon="envelope"
                    leftIconColor="#0fa3a3"
                    style={{
                      borderBottom: "1px solid #0fa3a3",
                      boxShadow: 'none',
                      borderRadius: '0px'
                    }}
                    validationOnBlur={() => {
                      if (isEmpty(companyEmailAddress)) {
                        const companyEmailError = { ...errors, companyEmailAddress: "Please enter company email" };
                        setErrors(companyEmailError);
                      } else if (!emailValidation(companyEmailAddress)) {
                        const companyEmailError = { ...errors, companyEmailAddress: "Invalid email address!" };
                        setErrors(companyEmailError);
                      } else {
                        const companyEmailError = { ...errors, companyEmailAddress: "" };
                        setErrors(companyEmailError);
                      }
                    }}
                  />
                </div>
                {errors.companyEmailAddress ? <small style={{ color: 'red' }}>{errors.companyEmailAddress}</small> : ""}
              </div>

              <div className={` ${errors.legalOwnersName ? "mb3" : "mb4"}`}>
                <div className="flex">
                  <InputGroupField
                    value={legalOwnersName}
                    onChange={handleChange("legalOwnersName")}
                    placeHolder="Legal Owner's Name"
                    leftIcon="mugshot"
                    leftIconColor="#0fa3a3"
                    style={{
                      borderBottom: "1px solid #0fa3a3",
                      boxShadow: 'none',
                      borderRadius: '0px'
                    }}
                    validationOnBlur={() => {
                      if (isEmpty(legalOwnersName)) {
                        const ownerNameError = { ...errors, legalOwnersName: "Please enter legal owner's name" };
                        setErrors(ownerNameError);
                      } else {
                        const ownerNameError = { ...errors, legalOwnersName: "" }
                        setErrors(ownerNameError);
                      }
                    }}
                  />
                </div>
                {errors.legalOwnersName ? <small style={{ color: 'red' }}>{errors.legalOwnersName}</small> : ""}
              </div>

              <div className={` ${errors.legalOwnersEmailAddress ? "mb3" : "mb4"}`}>
                <div className="flex">
                  <InputGroupField
                    value={legalOwnersEmailAddress}
                    onChange={handleChange("legalOwnersEmailAddress")}
                    placeHolder="Legal Owner's Email Address"
                    leftIcon="envelope"
                    leftIconColor="#0fa3a3"
                    style={{
                      borderBottom: "1px solid #0fa3a3",
                      boxShadow: 'none',
                      borderRadius: '0px'
                    }}
                    validationOnBlur={() => {
                      if (isEmpty(legalOwnersEmailAddress)) {
                        const ownerEmailError = { ...errors, legalOwnersEmailAddress: "Please enter legal owner's email address" };
                        setErrors(ownerEmailError);
                      } else if (!emailValidation(legalOwnersEmailAddress)) {
                        const emailError = { ...errors, legalOwnersEmailAddress: "Invalid email address!" };
                        setErrors(emailError);
                      } else {
                        const ownerEmailError = { ...errors, legalOwnersEmail: "" }
                        setErrors(ownerEmailError);
                      }
                    }}
                  />
                </div>
                {errors.legalOwnersEmailAddress ? <small style={{ color: 'red' }}>{errors.legalOwnersEmailAddress}</small> : ""}
              </div>
              <div className="tc">
                <button className="b--none w4 br3 grow h2  pointer pv2 white tc "
                  style={{ background: "#0fa3a3", outline: "none" }}
                  onClick={e => {
                    e.preventDefault();
                  }}
                >
                  Submit
                </button>
              </div>

            </form>
          </div>
        </Dialog>
      )
      }
      {showCollapse && <Collapse isOpen keepChildrenMounted>
        <div className=" bg-white br4 mv4 pv3 w5 ">
          <ButtonGroup style={{ minWidth: 200 }} alignText={Alignment.LEFT} className="bp3-minimal bp3-vertical bp3-large bp3-fill" >
            <Button icon="control">Workplace</Button>
            <Button icon="user">Profile</Button>
            <Button icon="briefcase">Product</Button>
            <Button icon="properties">About</Button>
            <Button icon="function">Expo</Button>
            <Button icon="people">Admin panel</Button>
          </ButtonGroup>
        </div>
      </Collapse>}
      <p>asdfasdfasdf asdf asdf asdf sadf asd fasdf asdfasd fasdfasdf asdfasdf asdfasdf </p>
    </div >
  )
}
