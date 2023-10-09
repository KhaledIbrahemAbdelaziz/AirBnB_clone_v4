const $ = window.$;

$(document).ready(function () {
  const amenityIDs = [];
  const myUrl = 'http://0.0.0.0:5001/api/v1';

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
    $.get(myUrl + '/status/', function (data) {
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
    const url = myUrl + '/places_search/';
    $.ajax({
      url,
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({}),
      success: function (data) {
        for (const p of data) {
          const userUrl = myUrl + `/users/${p.user_id}`;
          $.ajax({
            url: userUrl,
            type: 'GET',
            success: function (u) {
              const article = `
               <article>
               <div class="title_box">
               <h2>${p.name}</h2>
               <div class="price_by_night">$${p.price_by_night}</div>
               </div>
               <div class="information">
               <div class="max_guest">${p.max_guest} Guest${p.max_guest !== 1 ? 's' : ''}</div>
               <div class="number_rooms">${p.number_rooms} Bedroom${p.number_rooms !== 1 ? 's' : ''}</div>
               <div class="number_bathrooms">${p.number_bathrooms} Bathroom${p.number_bathrooms !== 1 ? 's' : ''}</div>
               </div>
               <div class="user">
               <b>Owner:</b> ${u.first_name} ${u.last_name}
               </div>
               <div class="description">${p.description}</div>
               </article>`;
              $('section.places').append(article);
            },
            error: function (err) {
              console.log(err);
            }
          });
        }
      },
      error: function (err) {
        console.log(err);
      }
    });
  }
  checkAPIStatus();
  getAllPlaces();
});
