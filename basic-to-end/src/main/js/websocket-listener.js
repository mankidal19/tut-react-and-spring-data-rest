'use strict';

const SockJS = require('sockjs-client'); // <1>
require('stompjs'); // <2>

function register(registrations) {
	const socket = SockJS('/payroll'); // <3> Point the WebSocket at the application’s /payroll endpoint.
	const stompClient = Stomp.over(socket);
	stompClient.connect({}, function(frame) {
		registrations.forEach(function (registration) { // <4>
			// Iterate over the array of registrations supplied so that each can subscribe for callback as messages arrive.
			stompClient.subscribe(registration.route, registration.callback);
		});
	});
}

module.exports.register = register;
