import BlankCompany from 'resources/svg/blank-company.svg';

const CompanyItem = () => {
  return (
    <div className="company-item flex items-center w-100">
      <div className="flex items-center mr2">
        <img src={BlankCompany} alt="company" />
      </div>
      <div className="flex flex-column">
        <h3>Company Name</h3>
        <p>Role: superAdmin</p>
      </div>
    </div>
  );
};

export default CompanyItem;
