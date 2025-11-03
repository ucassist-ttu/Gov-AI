-- database: UCAssist.db
CREATE TABLE tblUsers (
    OrganizationName TEXT PRIMARY KEY,
    OrganizationDescription TEXT NOT NULL,
    Website TEXT NOT NULL,
    MinorityOwned TEXT NOT NULL,
    FaithBasedProvider TEXT NOT NULL,
    NonProfitProvider TEXT NOT NULL,
    ProviderLogo TEXT NOT NULL,
    NameofSevice TEXT NOT NULL,
    ServiceDescription TEXT NOT NULL,
    ProgramCriteria TEXT NOT NULL,
    Keywords TEXT NOT NULL,
    CountiesAvailable TEXT NOT NULL,
    TelephoneContact TEXT NOT NULL,
    EmailContact TEXT NOT NULL,
    ServiceAddress TEXT NOT NULL,
    CityStateZip TEXT NOT NULL,
    Hoursofoperation TEXT NOT NULL
);