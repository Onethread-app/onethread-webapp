import { useEffect, useState } from 'react';
import { tigrowApi } from 'config';

import { Button } from '@blueprintjs/core/lib/esm/components/button/buttons';

import './ContactUs.styles.scss';

// Todo: Replace snackbar with toaster

interface IContactUs {
  setShowContactUs: React.Dispatch<React.SetStateAction<boolean>>;
  setShowSnackbar: React.Dispatch<React.SetStateAction<boolean>>;
  setResponse: React.Dispatch<
    React.SetStateAction<{ status: number; message: string }>
  >;
}

const ContactUs = (props: IContactUs) => {
  const [values, setValues] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: '',
  });

  const handleChange = (event: any) => {
    const { value, name } = event.target;
    setValues({ ...values, [name]: value });
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const payload = {
      name: `${values.firstName} ${values.lastName}`,
      email: values.email,
      message: values.message,
      subject: `Query from ${values.email}`,
    };
    const response = await tigrowApi.post(
      `/contact/contact-sale`,
      payload,
    );
    props.setResponse({
      status: response.status,
      message: response.data.message,
    });
  };

  useEffect(() => {
    if (
      values.firstName &&
      values.lastName &&
      values.email &&
      values.message
    ) {
      // setIsSubmitDisabled(false);
    }
  }, [values]);

  return (
    <div className="flex flex-column" style={{ padding: '6%' }}>
      <h3
        className="mt0 self-center"
        style={{
          color: '#3484f0',
          fontSize: '22px',
        }}
      >
        Contact Us
      </h3>
      <form className="contact-form flex flex-column">
        <div className="flex" style={{ gap: '.5rem' }}>
          <input
            type="text"
            name="firstName"
            id=""
            placeholder="First Name"
            required
            value={values.firstName}
            onChange={handleChange}
            style={{ width: '50%' }}
          />
          <input
            type="text"
            name="lastName"
            id=""
            placeholder="Last Name"
            required
            value={values.lastName}
            onChange={handleChange}
            style={{ width: '50%' }}
          />
        </div>
        <input
          type="email"
          name="email"
          id=""
          placeholder="Your Email Here"
          required
          value={values.email}
          onChange={handleChange}
        />
        <textarea
          placeholder="Write your message here"
          required
          name="message"
          maxLength={5000}
          value={values.message}
          onChange={handleChange}
        ></textarea>
        <div className="center contact-form-buttons">
          <Button
            type="submit"
            style={{
              backgroundColor: '#3484f0',
              color: '#fff',
            }}
            // disabled={isSubmitDisabled}
            onClick={handleSubmit}
          >
            Submit
          </Button>
          <Button
            style={{ backgroundColor: 'salmon', color: '#fff' }}
            onClick={() => props.setShowContactUs(false)}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ContactUs;
