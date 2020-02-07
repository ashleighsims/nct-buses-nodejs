const inputs = require('./config/core/inputs');
const BusStop = require('./models/BusStop');
const axios = require('axios');
const findBusPrompt = require('prompt');
const addStopToJson = require('prompt');
const fs = require('fs');

console.log("[NCTBuses][FindMyBusStop]");

let line = null;
let searchFor = "";
let direction = "";
let stops = null;

findBusPrompt.start();
findBusPrompt.get(inputs.findMyBusStop, (error, result) => {
    if (error) {
        console.log(error);
        return 1;
    }

    line = result.line;
    searchFor = result.stop;
    direction = result.direction;

    console.log('Command line received results...');
    console.log(`Line: ${result.line}`);
    console.log(`Stop: ${result.stop}`);
    console.log(`Direction: ${result.direction}`);

    if(result.line === "" || result.direction === "") {
        console.log("Error: No values supplied. Please try again.");
        return 1;
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
            findStop();
        })
        .catch((error) => {
            console.log(`An error occurred: ${error.message}`);
        })
};

const findStop = () => {
    const searchArray = [
        searchFor.toLowerCase(), // all lowercase
        searchFor.toUpperCase(), // ALL UPPERCASE
        searchFor.replace(/^\w/, c => c.toUpperCase()) // Capitalise first letter
    ];

    const results = stops.filter(stop => {
        let found = false;

        searchArray.forEach((query, index) => {
            if(stop.commonName.search(query) !== -1) {
                found = true
            }
        });

        return found;
    });

    if(results && results.length > 0) {
        processMatches(results);
        return;
    }

    console.log("Error: No stops found. Please try again.");
};

const processMatches = (matches) => {
    let formattedMatch = [];

    matches.forEach((match, index) => {
        formattedMatch.push(new BusStop(match));
    });

    console.log('Results:');
    console.table(formattedMatch);

    if(formattedMatch.length === 1) {
        addStopToFavouritesPrompt(formattedMatch);
    }
};

const addStopToFavouritesPrompt = (matches) => {
    addStopToJson.start();
    addStopToJson.get(inputs.addStopToFavourites, (error, result) => {
        if (error) {
            console.log(error);
            return 1;
        }

        const answer = result.addToFavourites.toLowerCase();

        if(answer === "yes" || answer === "y" || answer === "ye") {
            return addStopToFavourites(matches);
        }
    });
};

const addStopToFavourites = (matches) => {
    fs.readFile('./config/config.json', (error, data) => {
        if (error) {
            console.error("Error: Could not write to file. Error message - ", error);
            return;
        }

        let json = JSON.parse(data);
        json[direction] = {
            ...json[direction],
            [line]: {
                name: matches[0].name,
                code: matches[0].code
            }
        };

        writeToFile(json);
    })
};

const writeToFile = (data) => {
    fs.writeFile('./config/config.json', JSON.stringify(data), (error) => {
        if (error) {
            console.error("Error: Could not write to file. Error message - ", error);
            return;
        }

        console.log("Successfully saved stop to config.");
    });
};