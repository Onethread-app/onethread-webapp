import React from 'react';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';

function BkashCard(props: any) {
  return (
    <div className="BkashCard">
      <div className="box">{props.children}</div>
      <p className="footLine">{props.footLine}</p>
    </div>
  );
}

export default function BkashCards() {
  return (
    <div className="BkashCards">
      <p className="b mb3">Pay with Bkash using your Phone</p>

      <div className="BkashCardsFlexbox">
        <BkashCard footLine="Dial *247#">
          <p className="f3 fw7">*247#</p>
        </BkashCard>

        <ArrowForwardIcon
          className="ArrowForwardIcon"
          style={{ color: 'f41f8b' }}
        />

        <BkashCard footLine="Dial '3' for payment">
          <div className="Dial3">
            <p>1. Send Money</p>
            <p>2. Buy Airtime</p>
            <p
              style={{
                backgroundColor: '#f41f8b',
                color: 'white',
                padding: '1vh 8px',
              }}
            >
              3. Payment
            </p>
            <p>4. Cashout</p>
            <p>5. My Bkash</p>
            <p>6. Helpline</p>
          </div>
        </BkashCard>

        <ArrowForwardIcon
          className="ArrowForwardIcon"
          style={{ color: 'f41f8b' }}
        />

        <BkashCard footLine="Enter your MerchantBkash Wallet No.">
          <div>
            <p>Enter Merchant Bkash Wallet No.</p>
            <p style={{ color: '#f41f8b' }}>01XXXXXXXXX</p>
          </div>
        </BkashCard>

        <ArrowForwardIcon
          className="ArrowForwardIcon"
          style={{ color: 'f41f8b' }}
        />

        <BkashCard footLine="Enter amount">
          <div>
            <p>Enter Amount</p>
            <p style={{ color: '#f41f8b' }}>254</p>
          </div>
        </BkashCard>

        <ArrowForwardIcon
          className="ArrowForwardIcon"
          style={{ color: 'f41f8b' }}
        />

        <BkashCard footLine="Enter your Reference Number">
          <div>
            <p>Enter Reference:</p>
            <p style={{ color: '#f41f8b' }}>COMPANY NAME</p>
          </div>
        </BkashCard>

        <ArrowForwardIcon
          className="ArrowForwardIcon"
          style={{ color: 'f41f8b' }}
        />

        <BkashCard footLine="Enter Counter numberas '1'">
          <div>
            <p>Enter Counter No.:</p>
            <p style={{ color: '#f41f8b' }}>1</p>
          </div>
        </BkashCard>

        <ArrowForwardIcon
          className="ArrowForwardIcon"
          style={{ color: 'f41f8b' }}
        />

        <BkashCard footLine="Enter your 4 digit secret Bkash PIN">
          <div>
            <p>
              Payment To: <br /> 01XXXXXXXXX <br />
              Amount: Tk 256.00 <br />
              Reference: COMPANYNAME Counter: 1 Enter Menu PIN
              toConfirm:
            </p>
            <p style={{ color: '#f41f8b' }}>XXXX</p>
          </div>
        </BkashCard>

        <ArrowForwardIcon
          className="ArrowForwardIcon"
          style={{ color: 'f41f8b' }}
        />

        <BkashCard footLine="You'll see your successful payment information">
          <div>
            <p>
              Payment Tk 256.00To: 01XXXXXXXXX Successful. Ref COMPANY
              NAME Counter 1 Fee Tk 0 Balance Tk XXX.XX TrxID
              <span style={{ color: '#f41f8b' }}>XXXXXXXX</span>
              at 05/03/2020 13:11
            </p>
          </div>
        </BkashCard>
      </div>
    </div>
  );
}
