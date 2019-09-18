import React, { useState } from 'react'
import { CompanyListItem } from './CompanyListItem';
import { Dialog } from '@blueprintjs/core';
import { CompanySignupForm } from './SignupForm';

export const CompanyList = () => {
  const [showDialog, setShowDialog] = useState(false);
  return (
    <>
      <main className="mw6 center">
        <CompanyListItem
          imageSrc="http://mrmrs.github.io/photos/p/2.jpg"
          listTitle="Young Gatchell"
          listDescription="@yg"
        />
        <CompanyListItem
          imageSrc="http://mrmrs.github.io/photos/p/3.jpg"
          listTitle="Arnoldo Degraff"
          listDescription="@99xx88randomhandle"
        />
        <CompanyListItem
          imageSrc="http://mrmrs.github.io/photos/p/4.jpg"
          listTitle="Deirdre Lachance"
          listDescription="@favfavfav"
        />
      </main>
      <button onClick={() => setShowDialog(!showDialog)}
        className="b--none w-100 br3 grow h2 ph5 pointer pv2 white outline-0 bg-tigrowLightBlue ma2"
      >Create Company</button>
      {showDialog && (
        <Dialog
          icon="briefcase"
          onClose={() => setShowDialog(!showDialog)}
          title="Company Sign Up"
          isOpen
          style={{ background: '#fff' }}
        >
          <div>
            <CompanySignupForm />
          </div>
        </Dialog>
      )}
    </>
  )
}