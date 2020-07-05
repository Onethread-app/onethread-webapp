import React from 'react';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

interface IPortwalletCardSaction {
  handleSubmit: (e: any) => void;
  getPortWalletFormData: (e: any) => void;
}

export default function PortwalletCardSaction(
  props: IPortwalletCardSaction,
) {
  const handleChange = (e) => {
    props.getPortWalletFormData(e);
  };
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
                      </div>
                      <div className="mb3">
                        <TextField
                          id="phone"
                          placeholder="Phone"
                          variant="outlined"
                        />
                      </div>

                      <div className="mb3">
                        <TextField
                          id="city"
                          placeholder="City"
                          variant="outlined"
                        />
                      </div>

                      <div className="mb3">
                        <TextField
                          id="state"
                          placeholder="State"
                          variant="outlined"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="mb3">
                        <TextField
                          id="email"
                          placeholder="Email"
                          variant="outlined"
                        />
                      </div>

                      <div className="mb3">
                        <TextField
                          id="zipCode"
                          placeholder="ZipCode"
                          variant="outlined"
                        />
                      </div>

                      <div className="mb3">
                        <TextField
                          id="house"
                          placeholder="House"
                          variant="outlined"
                        />
                      </div>
                    </div>
                  </div>
                </form>
                <Button
                  style={{ marginTop: '15px' }}
                  fullWidth
                  onClick={(e) => props.handleSubmit(e)}
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
