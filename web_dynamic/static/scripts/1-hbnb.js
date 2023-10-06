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
});
