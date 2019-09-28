import React from 'react'
import { CompanyInfoDetailsView } from 'components/company/profile/view/CompanyInfoDetailsView'
import { CompanyProductDetailsView } from 'components/company/profile/view/CompanyProductDetailsView'

export const CompanyProfilePage = () => {
  return (
    <div>
      <CompanyInfoDetailsView />
      <CompanyProductDetailsView/>
    </div>
  )
}
