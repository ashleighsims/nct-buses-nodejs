const moment = require('moment');
const { formatTime } = require('../helpers');

class Timetable {
  constructor(properties, line, name) {
    this.pickup = name;
    this.destination = properties.destinationName;
    this.line = line;
    this.aimedArrival = properties.aimedArrivalTime ? formatTime(properties.aimedArrivalTime) : 'No time provided';
    this.expectedArrival = properties.expectedArrivalTime ? formatTime(properties.expectedArrivalTime) : 'No time provided';
    this.aimedDeparture = properties.aimedDepartureTime ? formatTime(properties.aimedDepartureTime) : 'No time provided';
    this.expectedDeparture = properties.expectedDepartureTime ? formatTime(properties.expectedDepartureTime) : 'No time provided';
    this.displayTime = properties.displayTime;
    this.isRealTime = properties.isRealTime ? 'Yes' : 'No';

    this.late = this.isLate(properties.aimedArrivalTime, properties.expectedArrivalTime);
  }

  isLate = (aimedArrival, expectedArrival) => {
    const expected = moment(expectedArrival);
    const aimed = moment(aimedArrival);

    let lateString = "";
    let lateDuration = "";

    if(moment(expectedArrival).isAfter(aimedArrival)) {
      lateDuration = expected.diff(aimed, 'minutes');
      lateString = `${lateDuration} ${lateDuration > 1 ? 'minutes' : 'minute'}`;
    }

    return moment(expectedArrival).isAfter(aimedArrival) ? `Running Late by ${lateString} (aimed: ${formatTime(expectedArrival)})` : 'On Time';
  };
}

module.exports = Timetable;