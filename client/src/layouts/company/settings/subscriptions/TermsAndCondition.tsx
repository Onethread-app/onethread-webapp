export const TermsAndCondition = () => (
  <div>
    <div
      style={{
        maxHeight: '400px',
        maxWidth: '500px',
        overflowY: 'auto',
      }}
    >
      <div className='b'>1.1 Cancellation and Termination</div>
      <ol>
        <li>
          You are solely responsible for properly canceling your
          account. An email to support or phone request to cancel
          your account is considered cancellation for now. From next
          release, you can cancel your account at any time by
          clicking on the settings in the drawer at the left of the
          screen. The Billing and Payment screen provides a simple
          no-questions-asked cancellation link.
        </li>
        <li>
          All of your content will be immediately be inaccessible
          from the Service upon cancellation. Within 60 days, all
          this content will be permanently deleted from all backups
          and logs. This information cannot be recovered once it has
          been permanently deleted.
        </li>
        <li>
          If you cancel the Service before the end of your current
          paid up month, your cancellation will take effect
          immediately, and you will not be charged again. But there
          will not be any prorating of unused time in the last
          billing cycle.
        </li>
        <li>
          The Company, in its sole discretion, has the right to
          suspend or terminate your account and refuse any and all
          current or future use of the Service for any reason at any
          time. Such termination of the Service will result in the
          deactivation or deletion of your Account or your access to
          your Account, and the forfeiture and relinquishment of all
          content in your account. The Company reserves the right to
          refuse service to anyone for any reason at any time.
        </li>
      </ol>
      <div className='b'>1.2 Billing </div>
      <ol>
        <li>
          {' '}
          Subscription Fees. The Subscription Fee will remain fixed
          during the Subscription Term unless you (i) exceed your
          Maximum Projects; Message History Limit; Premium Video
          Conferencing minutes limit, Storage limit, Colleague
          limit, Associate limit or other applicable limits, (ii)
          change products or base packages. Where a price change
          applies to you, we will charge or invoice you under the
          new price structure, starting with the next Billing Period
          in the Subscription Term, except as provided below under
          'Fee Adjustments During a Billing Period'. In order to
          avoid additional charges, you should purchase the
          appropriate tier of Subscription Service for your
          anticipated needs.
        </li>

        <li>
          {' '}
          Fee Adjustments in Next Billing Period. If you exceed your
          Maximum Projects, Storage limit, Colleague limit,
          Associate limit or other applicable limits in a Billing
          Period, then your Subscription Fee will be adjusted at the
          beginning of the next Billing Period up to the current
          base package and tier price which corresponds with the
          maximum number of Colleagues/Projects or other limits from
          the prior Billing Period. This process will continue for
          each Billing Period during the Subscription Term. Our
          pricing and limits will be as set forth at
          https://www.tigrow.co/pricing. At your request, we will
          provide you with the detail we used to reach our
          conclusion.
          {' '}
        </li>

        <li>
          {' '}
          Fee Adjustments During a Billing Period. The Subscription
          Fee will increase during the course of a Billing Period if
          you exceed your Maximum Projects, Storage limit, Colleague
          limit, Associate limit or other applicable limits in a
          Billing Period. The Subscription Fee will be adjusted up
          to the tier price which corresponds with your maximum
          monthly limits from the current Billing Period. The
          Subscription Fee will also increase during a Billing
          Period if you add Billable Users, change products or
          subscribe to additional features for use during the
          Billing Period.
          {' '}
        </li>
      </ol>

      <div className='b'>1.3 Free Trial</div>
      <ol>
        <li>
          Subscriptions to the Services may begin with a free trial
          period during which you can try out the Services for 30
          days from the date you register ("Free Trial Period").
        </li>

        <li>
          While you may not be required to enter your billing
          information in order to sign up for the Free Trial Period,
          you may provide such information at any point during the
          Free Trial Period. If you do so, you will not be charged
          until the Free Trial Period ends. If you have not provided
          billing information by the time the Free Trial Period
          ends, you will lose all access to the Services.
        </li>

        <li>
          There will be a sixty (60) day grace period during which
          we will continue to record Events on your profile. You
          will have the option of entering billing information and
          subscribing during this grace period. If you do not do so,
          your account will be cancelled at the end of the grace
          period.
        </li>
        <li>
          TiGrow reserves the right to modify, cancel and/or limit
          the Free Trial Period without notice at any time.
        </li>
      </ol>
    </div>
  </div>
);
