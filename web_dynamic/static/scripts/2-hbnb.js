const $ = window.$;

$(document).ready(function () {
  const amenityIds = {};

  $('input[type="checkbox"]').change(function () {
    const checkbox = $(this);
    const amenId = checkbox.data('amenity-id');

    if (checkbox.is(':checked')) {
      amenityIds[amenId] = true;
    } else {
      delete amenityIds[amenId];
    }
    const amenHeader = $('div.amenities h4');
    if (Object.keys(amenityIds).length === 0) {
      amenHeader.text('\u00A0');
    } else {
      amenHeader.text(Object.keys(amenityIds).join(', '));
    }
  });

  function checkAPIStatus () {
    $.get('http://0.0.0.0:5001/api/v1/status/', function (data) {
      if (data.status === 'OK') {
        if (!$('div#api_status').hasClass('available')) {
          $('div#api_status').addClass('available');
        }
      } else {
        $('div#api_status').removeClass('available');
      }
    });
  }
  checkAPIStatus();
});
