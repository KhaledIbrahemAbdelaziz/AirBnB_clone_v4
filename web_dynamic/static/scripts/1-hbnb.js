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
    } else {
      amenHeader.text(Object.keys(amenityIds).join(', '));
    }
  });
});
