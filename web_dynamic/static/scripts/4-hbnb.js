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
      amenitiesHeader.text('&nbsp');
    } else {
      const amenityNames = amenityIDs.map(item => item.name);
      amenitiesHeader.text(amenityNames.join(', '));
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

  function getAllPlaces () {
    const url = 'http://0.0.0.0:5001/api/v1/places_search/';
    $.ajax({
      url,
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({}),
      success: function (data) {
        for (const p of data) {
          const article = `
            <article>
            <div class="title_box">
            <h2>${p.name}</h2>
            <div class="price_by_night">$${p.price_by_night}</div>
            </div>
            <div class="information">
            <div class="max_guest">${p.max_guest} Guest</div>
            <div class="number_rooms">${p.number_rooms} Bedroom</div>
            <div class="number_bathrooms">${p.number_bathrooms} Bathroom</div>
            </div>
            <div class="description">${p.description}</div>
            </article>`;
          $('section.places').append(article);
        }
      },
      error: function (err) {
        console.log(err);
      }
    });
  }

  $('button').click(function () {
    const selectedAmen = amenityIDs;
    $('section.places').empty();

    $.ajax({
      url: 'http://0.0.0.0:5001/api/v1/places_search/',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({ amenities: selectedAmen }),
      success: function (data) {},
      error: function (err) {
        console.log(err);
      }
    });
  });
  checkAPIStatus();
  getAllPlaces();
});
