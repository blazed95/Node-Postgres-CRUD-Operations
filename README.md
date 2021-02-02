# Wings-ICT-Solutions Back End Project by Vlasis Ioannidis

## First - Install Dependencies 
`$ npm install`

## Then - Run the Front-End side
`$ npm start` <br />
Open [http://localhost:3000] -- Client Side. This project was created with Create React App.<br />
Here we can create some DUMMY Devices. Choose name, serialNumber, latitude and longitude and then Sumbit. <br />
First Create some Devices and then run the Back-End side.
The DUMMY devices are stored in my postgres sql database (devicesdb) in the devices table.
You can find the Front-end code in the src file.

## Create the Database
The code that i used to create my database (devicesdb) and my tables(devices and measurments) are in the databaseSchema.sql file.<br />
`$ psql -U postgres` 
Put the password for your postgres user.<br />
`$ \c devicesdb`
Run the commands in the databaseSchema.sql file.<br />
Our database is ready now. <br />



## Run the Back-end side 
`$ npm run server` 
For the best visualisation of the data use Postman platform for the GET requests. <br />
When we start our server - my code automaticaly, will produce DUMMY measurments for every device per minute.
Open [http://localhost:4000] -- Server Side. <br />
In the [http://localhost:4000/devices] we can see all the DUMMY devices that are stored in the database. <br />
<br />
In the Index.js is the core of our server.<br />
You can find the postgres-node.js connection and the creation of the dummy measurments in the database/psql.js file.<br />
The routes handling (API-CRUD operations) is in the devicesRoutes.js file.<br />
You can find the Back-end code in the server file.

### CRUD OPERATIONS-HANDLING THE MEASUREMENTS

1. To Return a device given the serial number: [http://localhost:4000/devices/serialNumber={serialNumber}]  <br /> 
-The serialNumber must be in uppercase.
For example: Filter an return a device with serialNumber RXATRABTIM <br />
[http://localhost:4000/devices/serialNumber=RXATRABTIM] <br />
<br />
2. To return all the devices with with a given average measurement that pass a given threshold for a given time interval <br />
[http://localhost:4000/devices//propertie={propertie}&threshold={threshold}&hours={hours}] <br />
For example: FIlter and return the devices with  <br />
[http://localhost:4000/devices/propertie=co&threshold=986&hours=1]
-The propertie can be only = co, pm25, pm10, no2, so2, temperature, humidity. <br />
<br />
3. To return average measurements for a given device based on a given time interval and detail. <br />
[http://localhost:4000/devices/serialNumber={serialNumber}/interval={interval}&detail={detail}] <br />
For example: Filter and return the measurments per hour for the RXATRABTIM the last 12 hours. <br />
[http://localhost:4000/devices/serialNumber=SADZXCASD/interval=12_hours&detail=hour]. <br />
-The serialNumber must be in uppercase.
-The interval must be Number_TimeInterval... :
• 2_weeks (last 2 weeks)
• 5_hours (last 5 hours)
• 32_minutes (last 32 minutes)...
-The Detail must be :
• day (per day)
• week (per week)
• hour (per hour)...
<br />
4. Filter and return average measurements for a given device between two given dates in the given time detail, 
[http://localhost:4000/devices/serialNumber={serialNumber}/date1={date1}&date2={date2}&detail={detail}]
-The serialNumber must be in uppercase.
-Both date1 and date2 must be :
• 2021-01-22 (year/month/day)
-The Detail must be :
• day (per day)
• week (per week)
• hour (per hour)...
