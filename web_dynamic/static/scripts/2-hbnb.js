const $ = window.$;

$(document).ready(function () {
  const amenityIDs = [];

  $('input[type="checkbox"]').change(function () {
    const checkbox = $(this);
    const amenityID = checkbox.attr('data-id');
    const amenityName = checkbox.attr('data-name');

    if (checkbox.is(':checked')) {
      amenityIDs.push({
        id: amenityID,
        name: amenityName
      });
    } else {
      const index = amenityIDs.findIndex(it => it.id === amenityID);
      if (index !== -1) {
        amenityIDs.splice(index, 1);
      }
    }

    const amenitiesHeader = $('div.amenities h4');
    if (Object.keys(amenityIDs).length === 0) {
      amenitiesHeader.html('&nbsp');
    } else {
      const amenityNames = amenityIDs.map(item => item.name);
      amenitiesHeader.html(amenityNames.join(', '));
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
