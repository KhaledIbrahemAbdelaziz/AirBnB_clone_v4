const $ = window.$;

$(document).ready(function () {
	const amenityIds = {};

	$('input[type="checkbox"]').change(function () {
		const checkbox = $(this);
		const amenId = checkbox.data('amenity-id');

		if (checkbox.is(':checked')) {
			amenityIds.push(amenId);
		} else {
			const index = amenityIds.indexOf(amenId);
			if (index !== -1) {
				amenityIds.splice(index, 1);
			}
		}
		const amenHeader = $('div.amenities h4');
		if (amenityIds.length === 0) {
			amenHeader.text('\u00A0');
		} else {
			amenHeader.text(amenityIds.join(', '));
		}
	});

	function checkAPIStatus() {
		$.get('http://0.0.0.0:5001/api/v1/status/', function (data) {
			if (data.status === 'OK') {
				$('div#api_status').addClass('available');
			} else {
				$('div#api_status').removeClass('available');
			}
		});
	};
	checkAPIStatus();
	setInterval(checkAPIStatus, 5000);
});
