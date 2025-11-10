-- database: UCAssist.db
CREATE TABLE tblServices (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    OrganizationName TEXT NOT NULL,
    OrganizationDescription TEXT NOT NULL,
    Website TEXT NOT NULL,
    MinorityOwned TEXT NOT NULL,
    FaithBasedProvider TEXT NOT NULL,
    NonProfitProvider TEXT NOT NULL,
    ProviderLogo TEXT NOT NULL,
    NameOfService TEXT NOT NULL,
    ServiceDescription TEXT NOT NULL,
    ProgramCriteria TEXT NOT NULL,
    Keywords TEXT NOT NULL,
    CountiesAvailable TEXT NOT NULL,
    TelephoneContact TEXT NOT NULL,
    EmailContact TEXT NOT NULL,
    ServiceAddress TEXT NOT NULL,
    CityStateZip TEXT NOT NULL,
    HoursOfOperation TEXT NOT NULL
);