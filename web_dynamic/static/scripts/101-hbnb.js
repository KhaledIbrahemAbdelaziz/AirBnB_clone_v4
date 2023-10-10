const $ = window.$;

$(document).ready(function () {
  const amenityIDs = [];
  const myUrl = 'http://0.0.0.0:5001/api/v1';
  const stateIds = [];
  const cityIds = [];

  $('.amenities input[type="checkbox"]').change(function () {
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
    const amenityNames = amenityIDs.map(item => item.name);
    amenitiesHeader.html(Object.keys(amenityIDs).length === 0 ? '&nbsp;' : amenityNames.join(', '));
  });

  $('.locations h2 input[type="checkbox"]').change(function () {
    const stateCheckbox = $(this);
    const stateId = stateCheckbox.attr('data-id');
    const stateName = stateCheckbox.attr('data-name');

    if (stateCheckbox.is(':checked')) {
      stateIds.push({
        id: stateId,
        name: stateName
      });
    } else {
      const index = stateIds.findIndex(item => item.id === stateId);
      if (index !== -1) { stateIds.splice(index, 1); }
    }
    const stateHeader = $('div.locations h4');
    const sNames = stateIds.map(n => n.name);
    stateHeader.html(Object.keys(stateIds).length === 0 ? '&nbsp;' : sNames.join(', '));
  });

  $('.locations .city_locations input[type="checkbox"]').change(function () {
    const cityCheckbox = $(this);
    const cityId = cityCheckbox.attr('data-id');
    const cityName = cityCheckbox.attr('data-name');
    if (cityCheckbox.is(':checked')) {
      cityIds.push({
        id: cityId,
        name: cityName
      });
    } else {
      const index = cityIds.findIndex(item => item.id === cityId);
      if (index !== -1) { cityIds.splice(index, 1); }
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

  function getAllPlaces (amenitysId, city, state) {
    const amenityIdDict = {};
    amenityIdDict.amenities = amenitysId;
    amenityIdDict.states = state;
    amenityIdDict.cities = city;
    const url = myUrl + '/places_search/';
    $.ajax({
      url,
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(amenityIdDict),
      success: function (data) {
        for (const p of data) {
          const userUrl = myUrl + '/users';
          $.ajax({
            url: userUrl,
            type: 'GET',
            success: function (u) {
              $.ajax({
                url: myUrl + `/places/${p.id}/reviews`,
                type: 'GET',
                success: function (r) {
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
                   <b>Owner:</b> ${u.map(it => it.id === p.user_id ? it.first_name + ' ' + it.last_name : '').join(' ')}
                   </div>
                   <div class="description">${p.description}</div>
                   <div class="reviews">
                   <h2>${r.length} Review${r.length > 1 ? 's' : ''}<span id="toggleReviews"> ${r.length > 1 ? 'show' : ''}</span></h2>
                   <ul style="list-style: none;">
                   ${r.map(review => {
                   const user = u.find(user => user.id === review.user_id);
                   return user
? `
                   <li>
                   <h3>From ${user.first_name} ${user.last_name}</h3>
                   <p>${review.text}</p>
                   </li>
                   `
: '';
                   }).join('')}
                   </ul>
                   </div>
                   </article>`;
                  $('section.places').append(article);
                },
                error: function (err) { console.log(err); }
              });
            },
            error: function (err) { console.log(err); }
          });
        }
      },
      error: function (err) { console.log(err); }
    });
  }

  $('button').click(function () {
    $('section.places article').remove();
    const selectedIds = amenityIDs.map(items => items.id);
    const selectedCities = cityIds.map(items => items.id);
    const selectedStates = stateIds.map(items => items.id);
    getAllPlaces(selectedIds, selectedCities, selectedStates);
  });

  checkAPIStatus();
  getAllPlaces();
});
