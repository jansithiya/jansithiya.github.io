var workData = {"job": [], "education": []};


var jobs = workData.job.push({
        "jobID": 1,
        "role": "Independent Consultant",
        "company": "Freelance",
        "from": "April 2017",
        "to": "July 2017",
        "place": "Madurai",
        "country": "India",
        "field": ["Business Intelligence", "Data Visualization", "Data Analytics"],
        "Description1": "Design and develop BI dashboard and reporting solutions based on open source libraries and commercial tools",
        "Description2": "Prototype design and build advanced front-end web based data visualisation and visual analytics app"
    }, {
        "jobID": 2,
        "role": "Research Assistant - Visual Analytics",
        "company": "KU Leuven",
        "from": "June 2015",
        "to": "March 2017",
        "place": "Leuven",
        "country": "Belgium",
        "field": ["Data Visualization", "Data Mining", "Data Analytics"],
        "Description1": "Data Mining on Electronic Health Records (EHR) such as comorbidity pattern mining, detection of correlations, scenario analysis leveraging association rule mining and network analysis using R",
        "Description2": "Scalable and large data visualization: Developed scalable visualisation solution to explore large hierarchical data, temporal and textual data based on degree of interest and focus + context approach",
    },
    {
        "jobID": 3,
        "role": "Sales Analytics Consultant",
        "company": "FICO",
        "from": "March 2014",
        "to": "May 2015",
        "place": "Bangalore",
        "country": "India",
        "field": ["Business Intelligence", "Data Visualization", "Data Analytics"],
        "Description1": "Built semi-automated tools for wrangling, aggregating and scaling large data sets using R",
        "Description2": "Designed UI and developed multiple BI dashboard and reporting solution using Tableau for APAC Customer Communication Services division",
    },
    {
        "jobID": 4,
        "role": "BI Support Consultant",
        "company": "Freelance",
        "from": "October 2013",
        "to": "January 2014",
        "place": "Paris",
        "country": "France",
        "field": ["Business Intelligence"],
        "Description1": "Collaborated with a startup named Slemma and built uses cases for their BI tool targeting diverse industries",
        "Description2": "Led 2 BI migration projects from Excel and BO to Tableau "

    },
    {
        "jobID": 5,
        "role": "B2B Marketing Analyst",
        "company": "PayPal",
        "from": "April 2013",
        "to": "September 2013",
        "place": "Paris",
        "country": "France",
        "field": ["Data Analytics", "Data Mining"],
        "Description1": "Deep dive analysis of B2B data from multiple sources involving customer life cycle",
        "Description2": "Designed and automated excel based marketing engagement dashboards that tracked key performance metrics"
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
        "Description1": "Analyzed periodic sales and developed sales forecast for global clients",
        "Description2": "Product gap analysis and conducted market research on potential for cruise IT solutions in APAC",
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

