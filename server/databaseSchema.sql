CREATE DATABASE devicesdb;

CREATE TABLE devices(
    id SERIAL PRIMARY KEY,
    serialNumber VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(50) NOT NULL,
    latitude DECIMAL NOT NULL,
    longitude DECIMAL NOT NULL,
    functional_status VARCHAR(50) NOT NULL
);
CREATE TABLE measurments (
    measurment_id SERIAL PRIMARY KEY,
    device_id int NOT NULL,
    measure_time timestamp default (now() at time zone 'utc-2'),
    co SMALLINT NOT NULL,
    pm25 SMALLINT NOT NULL,
    pm10 SMALLINT NOT NULL,
    no2 SMALLINT NOT NULL,
    so2 SMALLINT NOT NULL,
    temperature SMALLINT NOT NULL,
    humidity SMALLINT NOT NULL,
    FOREIGN KEY (device_id) REFERENCES devices(id)
);





/*Examples of Database handling */

/*Drop a table */
DROP TABLE measurments; 
/*Insert into measurments table the various environmental and air quality properties */
INSERT INTO measurments (co, pm25, pm10,no2,so2,temperature,humidity,device_id) values(34,22,92,1,22,13,213,1);

/* Returns the Device information from the serial number 'WQESADZZSA'*/
SELECT * FROM devices WHERE serialNumber = 'WQESADZZSA' ;

/* Returns the device_id from table measurments where the co <=40 and the temperature > 10 */
SELECT device_id FROM measurments WHERE co <=40 AND temperature > 10;

/*Returns all the devices that tthey have AVG(co)>490 the last hour */
SELECT device_id, AVG(co) FROM measurments WHERE measure_time  >= (now() + INTERVAL'2 hours'  - INTERVAL '2 hours') GROUP BY 1 HAVING AVG(co)>490 ;

/* Returns all the environmental and air quality properties from the table measurments for the last 3 hours /GREEK TIME */
SELECT measure_time  FROM measurments WHERE measure_time  >= (now() + INTERVAL'2 hours'  - INTERVAL '1 weeks');

/* Returns all information from devices where the id of device is 2 or 5 */
SELECT * FROM devices where id = ANY('{2,5}'::int[])

/* Returns the Hourly Average co for the past 24 hours for the device with id=1 */
SELECT  date_trunc('hour', measure_time) , AVG(co) as average_co FROM measurments WHERE device_id = 1 AND measure_time  >= (now() + INTERVAL'2 hours'  - INTERVAL '24 hour')  group by 1  order by 1;


/* Returns the Daily Average co between two times or dates */
SELECT date_trunc('hour', ( measure_time at time zone 'utc')) , AVG(co) as average_co FROM measurments where measure_time::time between '13:00' and '19:00' group by 1 order by 1;
SELECT date_trunc('hour',( measure_time at time zone 'utc')) , AVG(co) as average_co FROM measurments where measure_time::timestamp between '2021/01/23' and '2021/01/24' group by 1 order by 1;
