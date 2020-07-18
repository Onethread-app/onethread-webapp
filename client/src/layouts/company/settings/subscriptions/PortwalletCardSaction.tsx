import React from 'react';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import NumberFormat from 'react-number-format';

interface NumberFormatCustomProps {
  inputRef: (instance: NumberFormat | null) => void;
  onChange: (event: {
    target: { name: string; value: string };
  }) => void;
  name: string;
}
interface IState {
  name: string;
  email: string;
  phone: string;
  zipCode: string;
  city: string;
  state: string;
  house: string;
}

function NumberFormatCustom(props: NumberFormatCustomProps) {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      isNumericString
    />
  );
}

interface IPortwalletCardSaction {
  handleSubmit: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => void;
  getPortWalletFormData: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => void;
}

const ErrorLabel = () => {
  return (
    <div style={{ margin: '5px', color: 'red' }}>
      <label>Required</label>
    </div>
  );
};

export default function PortwalletCardSaction(
  props: IPortwalletCardSaction,
) {
  const [formValues, setFormValues] = React.useState({
    name: '',
    email: '',
    phone: '',
    zipCode: '',
    city: '',
    state: '',
    house: '',
  });
  const [error, setError] = React.useState(false);
  const [emailValidation, setEmailValidation] = React.useState(false);
  const handleChange = (e) => {
    const { id, value } = e.target;
    props.getPortWalletFormData(e);
    setFormValues((prevState: IState) => ({
      ...prevState,
      [id]: value,
    }));
  };
  function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
  function checkAllInput() {
    if (
      formValues.name === '' ||
      formValues.email === '' ||
      formValues.phone === '' ||
      formValues.zipCode === '' ||
      formValues.city === '' ||
      formValues.state === '' ||
      formValues.house === ''
    ) {
      setError(true);
      return false;
    } else {
      if (!validateEmail(formValues.email)) {
        setEmailValidation(true);
        return false;
      } else {
        setEmailValidation(false);
      }
      return true;
    }
  }

  return (
    <div style={{ marginTop: '10px' }}>
      <label className="b mt5">Card Details</label>
      <div className="mt3">
        <Grid container>
          <Grid item xs={6}>
            <Card style={{ marginTop: '10px' }}>
              <CardContent style={{ marginTop: '12px' }}>
                <h3 style={{ textAlign: 'center' }}>PortWallet</h3>
                <form onChange={handleChange}>
                  <div className="flex justify-center">
                    <div className="mr4">
                      <div className="mb3">
                        <TextField
                          id="name"
                          placeholder="Name"
                          variant="outlined"
                        />
                        {error && formValues.name === '' && (
                          <ErrorLabel />
                        )}
                      </div>
                      <div className="mb3">
                        <TextField
                          id="phone"
                          placeholder="Phone, Ex. 01700000000"
                          variant="outlined"
                          InputProps={{
                            inputComponent: NumberFormatCustom as any,
                          }}
                        />
                        {error && formValues.phone === '' && (
                          <ErrorLabel />
                        )}
                      </div>

                      <div className="mb3">
                        <TextField
                          id="city"
                          placeholder="City"
                          variant="outlined"
                        />
                        {error && formValues.city === '' && (
                          <ErrorLabel />
                        )}
                      </div>

                      <div className="mb3">
                        <TextField
                          id="state"
                          placeholder="State"
                          variant="outlined"
                        />
                        {error && formValues.state === '' && (
                          <ErrorLabel />
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="mb3">
                        <TextField
                          id="email"
                          placeholder="Email, Ex.jon@gmail.com"
                          variant="outlined"
                        />
                        {error && formValues.email === '' && (
                          <ErrorLabel />
                        )}
                        {emailValidation && (
                          <div
                            style={{ margin: '5px', color: 'red' }}
                          >
                            Please Enter a valid email
                          </div>
                        )}
                      </div>

                      <div className="mb3">
                        <TextField
                          id="zipCode"
                          placeholder="ZipCode, Ex. 1207"
                          variant="outlined"
                          InputProps={{
                            inputComponent: NumberFormatCustom as any,
                          }}
                        />
                        {error && formValues.zipCode === '' && (
                          <ErrorLabel />
                        )}
                      </div>

                      <div className="mb3">
                        <TextField
                          id="house"
                          placeholder="House"
                          variant="outlined"
                        />
                        {error && formValues.house === '' && (
                          <ErrorLabel />
                        )}
                      </div>
                    </div>
                  </div>
                </form>
                <Button
                  style={{ marginTop: '15px' }}
                  fullWidth
                  onClick={(e) =>
                    checkAllInput() && props.handleSubmit(e)
                  }
                  variant="contained"
                  color="primary"
                >
                  Pay Now
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}
