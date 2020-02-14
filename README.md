# NCT Buses Node App
This was developed for when working late I could just quickly check with a console command when the next 6 buses would be coming to my defined stop.

## Setup
Change the name of `config.example.json` to `config.json`. Add values to the `outbound` and `inbound` properties. These are required to be the stop objects. Examples can be seen in the config example for formatting reference. If you don't know it, you can search for your stop using `node FindMyBusStop`. If a result is found it will produce a table of possible stops that match your search. When choosing your stop, you just need to copy the 'code' and paste that into the favourites for your stop. If the stop finder gets one match it will ask you if you want it to add to the config for you.

#### Sample Result from FindMyBusStop

| (index) | stop                   | line     | expectedArrival     | expectedDeparture | displayTime | late         | isRealTime |
|---------|:----------------------:|:--------:|:-------------------:|:-----------------:|------------:|------------:|------------:|
|    0    | 'City, King Street K3' |   '27'   |     '17:42:03'      |   '17:42:03'      | '15 mins'   | 'On Time'   | 'Yes'       |
|    1    | 'City, King Street K3' |   '27'   |     '17:45:00'      |   '17:45:00'      | '18 mins'   | 'On Time'   | 'Yes'       |
|    2    | 'City, King Street K3' |   '27'   |     '17:55:00'      |   '17:55:00'      | '28 mins'   | 'On Time'   | 'Yes'       |
|    3    | 'City, King Street K3' |   '27'   |     '18:05:00'      |   '18:05:00'      | '38 mins'   | 'On Time'   | 'Yes'       |
|    4    |          'City'        |   '27'   |  'No time provided' |   '17:42:03'      | '18:35'     | 'On Time'   | 'Yes'       |
|    5    |          'City'        |   '27'   |  'No time provided' |   '17:42:03'      | '18:35'     | 'On Time'   | 'Yes'       |

#### Sample Result from BusTimes

| (index) | name                   | locality     | code     | stopType | coordinates                      | bearing |
|---------|:----------------------:|:------------:|:--------:|:--------:|:--------------------------------:|--------:|
|    0    | 'City, King Street K3' | 'Nottingham' | '3390K3' | 'bus'    | [ -1.1494517435, 52.9544498114 ] |   'S'   |

## Scripts

#### Bash Script

Add the following bash script to your `.bashrc` or `.zshrc` or where you put aliases on your machine.

```bash
function bus() {
    if [ $1 = "times" ]
    then
        node ~/<YOUR SCRIPTS LOCATION>/NCTBuses/BusTimes
    fi

    if [ $1 = "stops" ]
    then
    	node ~/<YOUR SCRIPTS LOCATION>/NCTBuses/FindMyBusStop
    fi
}
```

**Note: You'll need to change the location of where your storing this script.**