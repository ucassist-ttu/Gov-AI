const express = require('express')
const cors = require('cors')
const sqlite3 = require('sqlite3').verbose()

const HTTP_PORT = 5500
const dbSource = 'dummy.db'
const db = new sqlite3.Database(dbSource)

var app = express()
app.use(express.json())
app.use(cors())

// get all services 
app.get('/services', (req, res, next) => {
    let strCommand = "SELECT * FROM tblServices"
    db.all(strCommand, (err, result) => {
        if (err) {
            console.log(err)
            res.status(400).json({
                status: "error",
                message: err.message
            })
        } else {
            res.status(200).json({
                status: "success",
                message: result
            })
        }
    })
})

//Add a new service to the database
app.post('/services', (req, res, next) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let strOrganizationName = req.body.organizationName;
    let strOrganizationDescription = req.body.organizationDescription;
    let strWebsite = req.body.website;
    let strMinorityOwned = req.body.minorityOwned;
    let strFaithBasedProvider = req.body.faithBasedProvider;
    let strNonProfitProvider = req.body.nonProfitProvider;
    let strProviderLogo = req.body.providerLogo;
    let strNameofService = req.body.nameofService;
    let strServiceDescription = req.body.serviceDescription;
    let strProgramCriteria = req.body.programCriteria;
    let strKeywords = req.body.keywords;
    let strCountiesAvailable = req.body.countiesAvailable;
    let strTelephoneContact = req.body.telephoneContact;
    let strEmailContact = req.body.emailContact.toLowerCase();
    let strServiceAddress = req.body.serviceAddress;
    let strCityStateZip = req.body.cityStateZip;
    let strHoursofOperation = req.body.hoursofOperation;
    
    //Check all input
    if (strOrganizationName.length < 1){
        return res.status(400).json({ error: "An organization name is required" });
    }
    if (strOrganizationDescription.length < 1){
        return res.status(400).json({ error: "An organization description is required" });
    }
    if (strWebsite.length < 1){
        return res.status(400).json({ error: "A website is required" });
    }
    if (strMinorityOwned != "Yes" && strMinorityOwned != "No"){
        return res.status(400).json({ error: "Minority Owned is expecting 'Yes' or 'No'" });
    }
    if (strFaithBasedProvider != "Yes" && strFaithBasedProvider != "No"){
        return res.status(400).json({ error: "Faith based provider is expecting 'Yes' or 'No'" });
    }
    if (strNonProfitProvider != "Yes" && strNonProfitProvider != "No"){
        return res.status(400).json({ error: "Non profit provider is expecting 'Yes' or 'No'" });
    }
    if (strProviderLogo.length < 1){
        return res.status(400).json({ error: "A provider logo is required" });
    }
    if (strNameofService.length < 1){
        return res.status(400).json({ error: "A name of service is required" });
    }
    if (strServiceDescription.length < 1){
        return res.status(400).json({ error: "A service description is required" });
    }
    if (strProgramCriteria.length < 1){
        return res.status(400).json({ error: "A program criteria is required" });
    }
    if (strKeywords.length < 1){
        return res.status(400).json({ error: "A keyword is required" });
    }
    if (strCountiesAvailable.length < 1){
        return res.status(400).json({ error: "A county is required" });
    }
    if (strTelephoneContact.length < 1){
        return res.status(400).json({ error: "A telephone number is required" });
    }
    if (!emailRegex.test(strEmailContact)){
        return res.status(400).json({ error: "A real email is required" });
    }
    if (strServiceAddress.length < 1){
        return res.status(400).json({ error: "A service address is required" });
    }
    if (strCityStateZip.length < 1){
        return res.status(400).json({ error: "A city, state, and zip is required" });
    }
    if (strHoursofOperation.length < 1){
        return res.status(400).json({ error: "Hours of operation is required" });
    }

    let strCommand = `INSERT INTO tblServices (organizationName, organizationDescription, website, minorityOwned, faithBasedProvider, nonProfitProvider, providerLogo, nameofService, serviceDescription, programCriteria, keywords, countiesAvailable, telephoneContact, emailContact, serviceAddress, cityStateZip, hoursofOperation) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    db.run(strCommand, [strOrganizationName, strOrganizationDescription, strWebsite, strMinorityOwned, strFaithBasedProvider, strNonProfitProvider, strProviderLogo, strNameofService, strServiceDescription, strProgramCriteria, strKeywords, strCountiesAvailable, strTelephoneContact, strEmailContact, strServiceAddress, strCityStateZip, strHoursofOperation], function (err) {
        if(err){
            console.log(err)
            res.status(400).json({
                status:"error",
                message:err.message
            })
        } else {
            res.status(201).json({
                status:"success"
            })
        }
    })
})

app.listen(HTTP_PORT,() => {
    console.log('App listening on',HTTP_PORT)
})


// Example api calls (web only)
// 
// 
// Get all services:
    // fetch('http://localhost:5500/services', {
    //   method: 'GET',
    //   headers: {
    //   },
    // })
    //   .then(response => response.json())
    //   .then(data => console.log('✅ Success:', data))
    //   .catch(error => console.error('❌ Error:', error));
// 
// 
// Create a new service
    // fetch('http://localhost:5500/services', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({
    //     organizationName: "Community Health Center",
    //     organizationDescription: "Provides free health screenings and clinics for low-income residents.",
    //     website: "https://anexamplewebsite.here",
    //     minorityOwned: "Yes",
    //     faithBasedProvider: "No",
    //     nonProfitProvider: "Yes",
    //     providerLogo: "https://anexamplepnghere.png",
    //     nameofService: "Free Medical Clinic",
    //     serviceDescription: "Offers free primary care and wellness checkups for residents of low income households.",
    //     programCriteria: "Must reside in the county and have income below 200% of federal poverty level.",
    //     keywords: "health, clinic, free, medical",
    //     countiesAvailable: "Greene, Clark",
    //     telephoneContact: "555-555-1212",
    //     emailContact: "contact@communityhealth.org",
    //     serviceAddress: "123 Main Street",
    //     cityStateZip: "Springfield, OH 45502",
    //     hoursofOperation: "Mon–Fri 8am–5pm"
    //   })
    // })
    //   .then(response => response.json())
    //   .then(data => console.log('✅ Success:', data))
    //   .catch(error => console.error('❌ Error:', error));