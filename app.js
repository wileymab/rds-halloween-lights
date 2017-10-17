const request = require('request')


/**
 * 
 */
const PRIMES = [
    7, 3, 5, 1
]

/**
 * 
 */
const SWITCH_NAMES = [
    'switch.switch',
    'switch.switch_2',
    'switch.switch_3',
];


/**
 * 
 */
const HEADERS = {
    'x-ha-access': 'password',
    'Content-Type': 'application/json'
}

/**
 * 
 */
let baseOptions = {
    method: 'POST',
    url: 'http://192.168.0.106:8123/api/services/switch/toggle',
    headers: HEADERS,
    json: true
}

console.log('Press any key to stop ...');
process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.on('data', process.exit.bind(process, 0));


function Flicker(switchName) {
    let zSwitch = switchName;

    let privateApi = {
        randomWaitTime: function() {
            return PRIMES[Math.floor(Math.random()*PRIMES.length)] * 1000;
        }
    }

    let api = {
        hasCycled: false,
        turnOn: function() {
            let opts = {
                method: 'POST',
                url: 'http://192.168.0.106:8123/api/services/switch/turn_on',
                headers: HEADERS,
                json: true,
                body: {
                    entity_id: switchName
                }
            };
            setTimeout(
                function() {
                    request(opts, function(error, response, body) {
                        if ( !error && !api.hasCycled ) {
                            api.hasCycled = true;
                            setTimeout(
                                function() {
                                    api.turnOff();
                                },
                                privateApi.randomWaitTime()
                            )
                        }
                    });
                },
                privateApi.randomWaitTime()
            );
        },
        turnOff: function() {
            let opts = {
                method: 'POST',
                url: 'http://192.168.0.106:8123/api/services/switch/turn_off',
                headers: HEADERS,
                json: true,
                body: {
                    entity_id: switchName
                }
            };
            setTimeout(
                function() {
                    request(opts, function(error, response, body) {
                        if ( !error && api.hasCycled ) {
                            api.hasCycled = false;
                            setTimeout(
                                function() {
                                    api.turnOn();
                                },
                                privateApi.randomWaitTime()
                            );
                        }
                    });
                },
                privateApi.randomWaitTime()
            );
        },
        start: function() {
            api.turnOn();
        }
    };
    return api;
}

for( let i = 0; i < SWITCH_NAMES.length; i++ ) {
    setTimeout(
        function() {
            let flicker = new Flicker(SWITCH_NAMES[i])
            flicker.start();
        },
        PRIMES[Math.floor(Math.random()*PRIMES.length)] * 1000
    );
}
