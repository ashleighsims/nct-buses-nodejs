const inputs = require('./config/core/inputs');
const config = require('./config/config');
const Timetable = require('./models/Timetable');
const axios = require('axios');
const prompt = require('prompt');

console.log("[NCTBuses]");

let line = null;
let stops = null;
let timetable = [];

prompt.start();
prompt.get(inputs.busTimes, (error, result) => {
    if (error) {
        console.error(error);
        return 1;
    }

    line = result.line;

    console.log('Command line received results...');
    console.log(`Line: ${result.line}`);
    console.log(`Direction: ${result.direction}`);

    if(result.line === "" || result.direction === "") {
        console.error("Error: No values supplied. Please try again.");
        return;
    }

    getLineStops(result.line, result.direction);
});

const getLineStops = (line, direction) => {
    axios.get(`https://nctx.arcticapi.com/network/operators/NCT/lines/${line}/waypoints?direction=${direction.toLowerCase()}`)
        .then((response) => {
            if(response.data.length <= 0) {
                throw new Error("Unable to find stops on route provided. Please try again.");
            }

            stops = response.data['_embedded']['naptan:stop'];
        })
        .then(() => {
            getStopTimes(config[direction.toLowerCase()][line]);
            // getStopTimes(config[direction.toLowerCase()]);
        })
        .catch((error) => {
            console.log(`An error occurred: ${error.message}`);
        })
};

const getStopTimes = (preference) => {
    if(! preference) {
        console.log('Error: no favourite stops found for this line and direction. Please add a favourite stop using - FindMyBustStop');
        return;
    }

    axios.get(`https://nctx.arcticapi.com/network/stops/${preference.code}/visits`)
        .then((response) => {
            if(response.data.length <= 0) {
                throw new Error("Unable to find times for the stop. Please check your stop in the config and try again.");
            }

            const timetableResponse = response.data['_embedded']['timetable:visit'];

            for(let i = 0; i < timetableResponse.length; i++) {
                if(timetableResponse[i]['_links']['transmodel:line'].name === `${line}`) {
                    timetable.push(new Timetable(timetableResponse[i], line, preference.name));
                }
            }
        })
        .then(() => {
            displayTimes();
        })
        .catch((error) => {
            console.error(`An error occurred: ${error.message}`);
        });
};

const displayTimes = () => {
    const busTimes = [...timetable];

    if(config.results && config.results.filter) {
        busTimes.splice(config.results.filter, busTimes.length - config.results.filter);
    }

    console.log('--------');
    console.log('Results:');
    // Format the headings array.
    console.table(busTimes, ['pickup', 'destination', 'line', 'expectedArrival', 'expectedDeparture', 'displayTime', 'late', 'isRealTime'])
};