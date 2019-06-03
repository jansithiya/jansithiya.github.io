var workData = {"job": [], "education": []};


var jobs = workData.job.push({
    "jobID": 1,
    "role": "Business Intelligence Developer",
    "company": "Chegg",
    "from": "September 2017",
    "to": "July 2019",
    "place": "New Delhi",
    "country": "India",
    "field": ["Business Intelligence","Data Visualization", "Data Analytics"],
    "Description": "Build scalable ETL pipeline leverging spark, python and data integration tools, Build and institutionalize Tableau/Domo dashboards "
    },
    
    {
        "jobID": 2,
        "role": "Data Visualization Consultant",
        "company": "Freelance",
        "from": "April 2017",
        "to": "July 2017",
        "place": "Madurai",
        "country": "India",
        "field": ["Business Intelligence", "Data Visualization", "Data Analytics"],
        "Description": "Design UI and develop Business Intelligence dashboards and Visualization web app leveraging open source and commercial tools. Provide Web Analytics consulting for an emerging Entertainment & Lifestyle platform"
    }, {
        "jobID": 3,
        "role": "Research Assistant - Visual Analytics",
        "company": "KU Leuven",
        "from": "June 2015",
        "to": "March 2017",
        "place": "Leuven",
        "country": "Belgium",
        "field": ["Data Visualization", "Data Mining", "Data Analytics"],
        "Description": "Data Mining and visual exploration of Flanders Electronic Health Records (EHR) data and built scalable visualization web applicaton for visualizing large hierarchical and textual data based on degree of interest approach"
    },
    {
        "jobID": 4,
        "role": "Data Analytics Consultant APAC",
        "company": "FICO",
        "from": "March 2014",
        "to": "May 2015",
        "place": "Bangalore",
        "country": "India",
        "field": ["Business Intelligence", "Data Visualization", "Data Analytics"],
        "Description": "Developed multiple Tableau BI dashboards for APAC Sales division and developed predictive modeling for customer communication strategy based on consumer behavior/interaction with system",
    },
    {
        "jobID": 5,
        "role": "B2B Marketing Analyst (Internship)",
        "company": "PayPal",
        "from": "April 2013",
        "to": "November 2013",
        "place": "Paris",
        "country": "France",
        "field": ["Data Analytics", "Data Mining"],
        "Description": "Deep dive analysis of merchant life cycle from on-boarding to experience and engagement. Designed and automated excel based marketing engagement dashboards that tracked key performance metrics"

    },
    {
        "jobID": 6,
        "role": " Intern - Distribution Marketing",
        "company": "Amadeus",
        "from": "June 2012",
        "to": "December 2012",
        "place": "Nice",
        "country": "France",
        "field": ["Data Analytics", "Market Research"],
        "Description": "Analyzed periodic sales and developed sales forecast to drive Ferry IT sales and conducted market research on potential for cruise IT in APAC"
    });


var education = workData.education.push({
        "eduID": 1,
        "degree": "Master in International Business",
        "School": "Grenoble Graduate School of Business",
        "Major": "Economics and Business Statistics",
        "from": "September 2011",
        "to": "September 2013",
        "place": "Grenoble",
        "country": "France",
        "field": ["Economics", "Statistics", "Finance Management"]
    },
    {
        "eduID": 2,
        "degree": "Bachelor of Engineering",
        "School": "Anna University",
        "Major": "Electrical and Electronics",
        "from": "September 2007",
        "to": "May 2011",
        "place": "Chennai",
        "country": "India"
    }
);


var dateParse = d3.timeParse("%B %Y");

workData.education.forEach(function (d) {

    d.from = dateParse(d.from);
    d.to = dateParse(d.to);
});
workData.job.forEach(function (d) {

    d.from = dateParse(d.from);
    d.to = dateParse(d.to);
    d.field.sort();
});
