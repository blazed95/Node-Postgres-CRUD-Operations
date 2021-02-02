const { Pool } = require('pg')

//Password - Pass is stored in a .env file for security reasons 
const pass = process.env.PASSWORD

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'devicesdb',
    password: pass,
    port: 5432,
})

//Promise for my connection
pool.connect()
    //Calculate Dummy measurments per minute for each device in the database
    .then(() => console.log("Connected to Postgress database")).then(async () => {
        const devices = await pool.query("SELECT * FROM devices")
        if (devices.rows.length > 0) {
            console.log("Hello First Measurment!", devices.rows.length, "measurments for this minute");
            devices.rows.map(async (device) => {
                let pm10 = Math.floor(Math.random() * 51); //Random number between 0-50
                let pm25 = Math.floor(Math.random() * 31); //Random number between 0-30
                let no2 = Math.floor(Math.random() * 41); //Random number between 0-40
                let co = Math.floor(Math.random() * 1001) //Random number between 0-1000
                let so2 = Math.floor(Math.random() * 41) //Random number between 0-40
                let humidity = Math.floor(Math.random() * 31) //Random number between 0-30
                let temperature = Math.floor(Math.random() * 16) + 10 //Random number between 10-25 
                await pool.query("INSERT INTO measurments (co, pm25, pm10,no2,so2,temperature,humidity,device_id) VALUES($1,$2,$3,$4,$5,$6,$7,$8)", [co, pm25, pm10, no2, so2, temperature, humidity, device.id])
            })
            let interval = setInterval(() => {
                devices.rows.map(async (device) => {
                    let pm10 = Math.floor(Math.random() * 51); //Random number between 0-50
                    let pm25 = Math.floor(Math.random() * 31); //Random number between 0-30
                    let no2 = Math.floor(Math.random() * 41); //Random number between 0-40
                    let co = Math.floor(Math.random() * 1001) //Random number between 0-1000
                    let so2 = Math.floor(Math.random() * 41) //Random number between 0-40
                    let humidity = Math.floor(Math.random() * 31) //Random number between 0-30
                    let temperature = Math.floor(Math.random() * 16) + 10 //Random number between 10-25 
                    await pool.query("INSERT INTO measurments (co, pm25, pm10,no2,so2,temperature,humidity,device_id) VALUES($1,$2,$3,$4,$5,$6,$7,$8)", [co, pm25, pm10, no2, so2, temperature, humidity, device.id])
                    //console.log(device.id)
                })
                console.log("Hello!", devices.rows.length, "more measurments for this minute");
            }, 60 * 1000);
        }
        //If we need to stop the measurments
        //clearInterval(interval);
    })
    .catch((e) => console.log(e))




module.exports = pool;

