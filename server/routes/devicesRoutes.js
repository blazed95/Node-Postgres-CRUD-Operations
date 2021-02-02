//const router = require("express").Router();
const express = require('express');
const pool = require('../database/psql');
const router = express.Router();

//Return all the devices
router.get("/", async (req, res) => {
    try {
        console.log(req.body)
        const devices = await pool.query("SELECT * FROM devices")
        res.json(devices.rows)
    }
    catch (e) {
        console.log(e)
    }
})
//1st-Bullet - Return a device and its measurments based on the given serial number
router.get("/serialNumber=:serialNumber", async (req, res) => {
    try {
        let serialNumber = req.params.serialNumber
        await pool.query("SET TIMEZONE ='Europe/Athens'");
        const device = await pool.query("SELECT * FROM devices WHERE serialNumber = $1", [serialNumber])
        const device_id = device.rows[0].id;
        const measurments = await pool.query("SELECT * FROM  measurments WHERE device_id = $1", [device_id])
        res.status(200).json({
            device: device.rows[0],
            measurments: measurments.rows
        })
    }
    catch (err) {
        res.status(500).json({
            error: err,
            device: "There is no device with this serialNumber"
        })
    }
})
//2cd-Bullet - Filter and return all devices with a given average measurement that pass a given threshold for a given time interval
router.get("/propertie=:propertie&threshold=:threshold&hours=:hours", async (req, res) => {
    try {
        let hours = parseInt(req.params.hours)
        let propertie = req.params.propertie
        let threshold = req.params.threshold
        //Inside the query i have 2 interval hours plus , so it syncs with the greek time
        const measurments = await pool.query(`SELECT device_id, AVG(${propertie}) FROM measurments WHERE measure_time > (now() + interval '2 hours' - interval '${hours} hours') GROUP BY 1 HAVING AVG(${propertie})>${threshold} ORDER BY 1`);

        res.status(200).json({
            detail: `Devices with ${propertie} > ${threshold} the last ${hours} hours`,
            devices_Information: measurments.rows,
        })
    }
    catch (err) {
        res.status(500).json({
            error: err,
            device: "Something went wrong - Propably, there is no device with this serialNumber"
        })
    }
})



//3rd Bullet - Return average measurements for a given device based on the past n hours
router.get("/serialNumber=:serialNumber/interval=:interval&detail=:detail", async (req, res) => {
    try {
        let interval = req.params.interval.replace("_", " ");
        let serialNumber = req.params.serialNumber;
        let detail = req.params.detail;
        const device = await pool.query("SELECT * FROM devices WHERE serialNumber = $1", [serialNumber])
        const device_id = device.rows[0].id;
        //Inside the query i have 2 interval hours plus , so it syncs with the greek time
        const measurments = await pool.query(`SELECT date_trunc('${detail}', ( measure_time at time zone 'utc')), AVG(co) as average_co,AVG(pm25) as average_pm25,AVG(pm10) as average_pm10,AVG(no2) as average_no2,AVG(so2) as average_so2,AVG(temperature) as average_temp,AVG(humidity) as average_humidity  
        FROM  measurments WHERE device_id = $1 AND measure_time > (now() + INTERVAL '2 hours' - INTERVAL '${interval}') GROUP BY 1 ORDER BY 1`, [device_id]);
        res.status(200).json({
            details: `The average  measurments per ${detail} for the ${serialNumber} the last ${interval} are...:`,
            measurments: measurments.rows
        })
    }
    catch (err) {
        res.status(500).json({
            error: err,
            device: "Something went wrong"
        })
    }
})

//4th Bullet - Filter and return average measurements for a given device between two given dates in the given time detail
router.get("/serialNumber=:serialNumber/date1=:date1&date2=:date2&detail=:detail", async (req, res) => {
    try {
        let serialNumber = req.params.serialNumber;
        let date1 = req.params.date1.replace(/-/g, "/");
        let date2 = req.params.date2.replace(/-/g, "/");
        let detail = req.params.detail;
        const device = await pool.query("SELECT * FROM devices WHERE serialNumber = $1", [serialNumber])
        const device_id = device.rows[0].id;
        const measurments = await pool.query(`SELECT date_trunc('${detail}', ( measure_time at time zone 'utc')), AVG(co) as average_co,AVG(pm25) as average_pm25,AVG(pm10) as average_pm10,AVG(no2) as average_no2,AVG(so2) as average_so2,AVG(temperature) as average_temp,AVG(humidity) as average_humidity  
        FROM  measurments WHERE device_id = $1 AND  measure_time::date between '${date1}' and '${date2}' group by 1 order by 1`, [device_id]);
        res.status(200).json({
            details: `The average  measurments per ${detail} for the ${serialNumber} between the ${date1} and ${date2} are...:`,
            measurments: measurments.rows
        })
    }
    catch (err) {
        res.status(500).json({
            error: err,
            device: "Something went wrong - Propably, there is no device with this serialNumber"
        })
    }
})

//Create a new device
router.post("/", async (req, res) => {
    try {
        const { serialNumber, name, longitude, latitude } = req.body;
        const newDevice = await pool.query("INSERT INTO devices (serialNumber, name, latitude, longitude ,functional_status ) VALUES($1,$2,$3,$4,'active')", [serialNumber, name, longitude, latitude])
        console.log(newDevice.rows)
        res.status(200).json({
            type: "success",
            msg: "Process Succesful",
            data: newDevice.rows
        })
    }
    catch (err) {
        console.log(err)
        res.status(500).json({
            error: err,
        })
    }
})

module.exports = router;