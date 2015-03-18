app.controller('ClockController', ['$scope', '$log', '$timeout', 'DatetimeResource', function($scope, $log, $timeout, DatetimeResource) {
	
	$scope.server = {
		hours: 00,
		minutes: 00,
		seconds: 00
	};

	var reloadClock = function ()
	{
		$scope.server.seconds += 1;
		if($scope.server.seconds == 60)
		{
			$scope.server.minutes += 1;
			$scope.server.seconds = 0;
		}

		if($scope.server.minutes == 60)
		{
			$scope.server.hours += 1;
			$scope.server.minutes = 0;

			if($scope.server.hours == 24)
			{
				$scope.server.hours = 0;
			}
		}

		$timeout(reloadClock, 1000);
	}

	DatetimeResource.query({}, function (datetime) {
		var datestring = datetime.date;

		var date = new Date(datestring.substring(0, 4), datestring.substring(5, 7), datestring.substring(8, 10), datestring.substring(11, 13), datestring.substring(14, 16), datestring.substring(17, 19));
		
		$scope.server.hours = date.getHours();
		$scope.server.minutes = date.getMinutes();
		$scope.server.seconds = date.getSeconds();
		$scope.server.time = date.getTime();
	});

	reloadClock();
}])