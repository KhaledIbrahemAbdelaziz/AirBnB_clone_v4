const $ = window.$;

$(document).ready(function () {
  const amenityIds = {};

  $('input[type="checkbox"]').change(function () {
    const checkbox = $(this);
    const amenId = checkbox.data('amenity_id');

    if (checkbox.is(':checked')) {
      amenityIds[amenId] = true;
    } else {
      delete amenityIds[amenId];
    }
    const amenHeader = $('div.amenities h4');
    if (Object.keys(amenityIds).length === 0) {
      amenHeader.text('&nbsp');
    );
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
    const selectedAmen = Object.keys(amenityIds);
    
    $.ajax({
      url: 'http://0.0.0.0:5001/api/v1/places_search/',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({ amenities: selectedAmen }),
      success: function (data){},
      error: function (err) {
        console.log(err);
        }
      });
  });
  checkAPIStatus();
  getAllPlaces();
});
