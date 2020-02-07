class BusStop {
  constructor(properties) {
    this.name = properties.commonName;
    this.locality = properties.localityName;
    this.code = properties.atcoCode;
    this.stopType = properties.stopType;
    this.coordinates = properties.location.coordinates;
    this.bearing = properties.bearing;
  }
}

module.exports = BusStop;