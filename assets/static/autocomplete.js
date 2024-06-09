function initAutocomplete() {
        // Create the autocomplete object, restricting the search to geographical location types
        const input = document.getElementById('street');
        const autocomplete = new google.maps.places.Autocomplete(input);

        // When the user selects an address from the dropdown, you can get more details about the place
        autocomplete.addListener('place_changed', function () {
          const place = autocomplete.getPlace();
          if (!place.geometry) {
            // User entered the name of a Place that was not suggested and pressed the Enter key
            window.alert("No details available for input: '" + place.name + "'");
            return;
          }

	  const addressComponents = place.address_components;
          const addressDetails = {
            street: '',
            city: '',
            region: '',
            country: '',
	    postalCode: '',
	    locationId: place.place_id,
            latitude: place.geometry.location.lat(),
            longitude: place.geometry.location.lng()
          };

          addressComponents.forEach(component => {
            const types = component.types;
            if (types.includes('street_number')) {
              addressDetails.street = component.long_name + ' ' + addressDetails.street;
            }
            if (types.includes('route')) {
              addressDetails.street += component.long_name;
            }
            if (types.includes('locality')) {
              addressDetails.city = component.long_name;
            }
            if (types.includes('administrative_area_level_1')) {
              addressDetails.region = component.long_name;
            }
            if (types.includes('country')) {
              addressDetails.country = component.long_name;
            }
            if (types.includes('postal_code')) {
              addressDetails.postalCode = component.long_name;
            }
          });
          // fill in details
	  document.getElementById('street').value = addressDetails.street;
	  document.getElementById('city').value = addressDetails.city;
	  document.getElementById('postcode').value = addressDetails.postalCode; 

	  const countrySelect = document.getElementById('country');
          for (let i = 0; i < countrySelect.options.length; i++) {
            if (countrySelect.options[i].text === addressDetails.country) {
              countrySelect.selectedIndex = i;
              break;
            }
          }

          console.log( `Location: ${addressDetails.latitude},${addressDetails.longitude}` );
	});
}

// Load the initAutocomplete function once the API has loaded
google.maps.event.addDomListener(window, 'load', initAutocomplete);
