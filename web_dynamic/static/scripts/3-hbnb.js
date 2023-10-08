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

  function Get_All_Places () {
	  const url = `http://0.0.0.0:5001/api/v1/places_search/`;
	  $.post(url, {
		  heaaders: { "Content-Type": "application/json" },
		  data: JSON.stringify({})},
		  function (data) {
			  for (const d of data) {
				  const art = [
					  "<article>",
					  "<div class="title_box">",
					  "<h2>${d.name}</h2>",
					  "<div class="price_by_night">$${d.price_by_night}</div>",
					  "</div>",
					  "<div class="information">",
					  "<div class="max_guest">${d.max_guest} Guest</div>",
					  "<div class="number_rooms">${d.number_rooms} Bedroom</div>",
					  "<div class="number_bathrooms">${d.number_bathrooms} Bathroom</div>",
					  "</div>",
					  "<div class="description">",
					  "${d.description}",
					  "</div>",
					  "</article>"
				  ];
				  $("section.places").append(art.join(""));
			  }
		  },
		  function (err) {
			  console.log(err);
		  });
  }

