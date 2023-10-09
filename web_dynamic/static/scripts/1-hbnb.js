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
});
