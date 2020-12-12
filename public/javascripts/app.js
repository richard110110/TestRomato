console.log("test");

// var $ = jQuery.noConflict();
// $(function() {
//     $('#searchPlace').tagsInput();
//     $('#search').tagsInput();
//     $('#city').tagsInput();


// });

function validateForm() {
    var x = document.forms["searchedPlaceForm"]["placeSearch"].value;
    var y = document.forms["searchedPlaceForm"]["CityName"].value;
    if (x == "null" || y == "null") {
      alert("place must be filled out");
      return false;
    }
  }

function initAutocomplete() {
    var map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -33.8688, lng: 151.2195 },
        zoom: 13,
        mapTypeId: 'roadmap'
    });

    // Create the search box and link it to the UI element.
    var input = document.getElementById('searchPlace');
    var searchBox = new google.maps.places.SearchBox(input);
    // map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function() {
        searchBox.setBounds(map.getBounds());
    });

    var markers = [];
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function() {
        var places = searchBox.getPlaces();

        if (places.length == 0) {
            alert("nothing found, please reenter a valid place");
            return;
        }

        // Clear out the old markers.
        markers.forEach(function(marker) {
            marker.setMap(null);
        });
        markers = [];

        var geocoder = new google.maps.Geocoder();
        var address = document.getElementById('searchPlace').value;

        geocoder.geocode({ 'address': address }, function(results, status) {

            if (status == google.maps.GeocoderStatus.OK) {
                console.log(results);
                var latitude = results[0].geometry.location.lat();
                var longitude = results[0].geometry.location.lng();

                console.log(latitude + " " + longitude);

                document.getElementById("search").setAttribute('value', `${latitude + ' ' + longitude}`)
                document.getElementById("city").setAttribute('value', `${document.getElementById('searchPlace').value}`)
                

            } else {
                alert("please reenter a valid place");
            }
        });

        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function(place) {
            if (!place.geometry) {
                console.log("Returned place contains no geometry");
                return;
            }

           
            console.log(place);
            var icon = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
            };

            // Create a marker for each place.
            markers.push(new google.maps.Marker({
                map: map,
                icon: icon,
                title: place.name,
                position: place.geometry.location
            }));

            if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
        });
        map.fitBounds(bounds);
    });
}

// console.log(document.getElementById("weatherData").textContent.length);

console.log(JSON.parse(document.getElementById("weatherData").textContent));
console.log(JSON.parse(document.getElementById("restaurantforEntityId").textContent));
console.log(JSON.parse(document.getElementById("RestaurantDetail").textContent).restaurants);
console.log(JSON.parse(document.getElementById("hotelDetails").textContent));


//convert KelVin temperature to Celsius

function convertKelvinToCelsius(kelvin) {
    if (kelvin < (0)) {
        return Math.floor(kelvin);
    } else {
        return Math.floor(kelvin - 273.15);
    }
}




function showWeather(weatherData) {
    document.getElementById("localWeather").innerHTML = "";
    var i;
    for (i = 0; i < weatherData.list.length; i++) {
        if (weatherData.list[i].dt_txt.includes("15:00")) {

            var weatherContainer = document.createElement('div');
            weatherContainer.setAttribute("id", "daily-weather");

            weatherContainer.innerHTML = `<div class="weather-icon" style="background-image:url(http://openweathermap.org/img/wn/${weatherData.list[i].weather[0].icon}@2x.png)"></div>` + `<div class="weather-Description">${weatherData.list[i].weather[0].description}</div>` + `<div class="temperature-Data">${convertKelvinToCelsius(weatherData.list[i].main.temp)}°</div>` + `<div class="wind-Container">` + `<i class="fas fa-wind"></i>` + `<div class="wind-Info">${weatherData.list[i].wind.speed}</div>` + `</div>` + `<div class="date-Container">` + `<i class="fas fa-calendar-alt"></i>` + `<div class="date-Info">${weatherData
                .list[i]
                .dt_txt
                .split(" ")[0]}</div>` + `</div>`;

            document
                .getElementById("localWeather")
                .appendChild(weatherContainer);

        }
    }
}

/**
 * iterating the restaurant highlights and show them in tag style
 * @param {*} highlights 
 */
function generateHighlights(highlights) {
    var iteratorHighlights = highlights.values();
    var tagContainer = document.createElement('li');
    tagContainer.setAttribute("class", "highlightTag");

    for (let each of iteratorHighlights) {
        tagContainer.innerHTML += `<li><a href="#" class="highlightTag">${each}</a></li>`;
    }

    return tagContainer.innerHTML;

}

function detectFeaturedImage(url){
    if(url == ""){
        return "../images/food.jpg";
    } else{
        return url;
    }
}


function showEachRestaurant(restaurantData) {
    var restaurantContainer = document.getElementById("localRestaurant");

    /**clear the localRestaurant container for avoiding the repeating appendChild */
    document
        .getElementById("localRestaurant")
        .innerHTML = "";

    console.log(restaurantData);    

    /*iterate the restaurantData array */
    restaurantData.map(eachRestaurant => {

        /**style the restaurantContainer with innerHTML, and
         * each restaurant data is embedded in the each-Restaurant container, 
         * set the restaruant image as the background-image in the top of container,
         * set the rating color to represent the restaurant rating, show the restaurant rating,
         * name, address, cuisine, average-cost, opening hours, highlights, uploaded photo
         */
        restaurantContainer.innerHTML += `<div id="each-Restaurant"><div class="featured-Image" style="background-image:url(${detectFeaturedImage(eachRestaurant.restaurant.featured_image)})">` + `<div class="rating" style="background-color:#${eachRestaurant.restaurant.user_rating.rating_color}">` + `<div class="rates">${eachRestaurant.restaurant.user_rating.aggregate_rating}</div>` + `</div>` + `</div>` + `<div class="restaurant-Name-Container">` + `<i class="fas fa-utensils"></i>` + `<div class="restaurant-Name"><a href="${eachRestaurant.restaurant.url}">${eachRestaurant.restaurant.name}</a></div>` + `</div>` + `<div class="restaurant-Address-Container">` + `<i class="fas fa-map-marker-alt"></i>` + `<div class="restaurant-Address">` + `${eachRestaurant.restaurant.location.address}` + `</div>` + `</div>` + `<div class="restaurant-Cuisine-Container">` + `<div class="restaurant-Cuisine">Cuisine: ${eachRestaurant.restaurant.cuisines}</div>` + `</div>` + `<div class="restaurant-Cost-Container">` + `<i>${eachRestaurant.restaurant.currency}</i>` + `<div class="restaurant-Cost">${eachRestaurant.restaurant.average_cost_for_two}</div>` + `</div>` + `<div class="openingHours-Container">` + `<i class="fas fa-clock"></i>` + `<div class="restaurant-OpeningHours">` + `${eachRestaurant.restaurant.timings}` + `</div>` + `</div>` + `<ul class="hightlightsTag-Container">` + generateHighlights(eachRestaurant.restaurant.highlights) + `</ul>` + `</div>`;

        document
            .getElementById("restaurant")
            .appendChild(restaurantContainer);

    })
}

function generateEachHotelPhoto(hotelPhoto) {
    var iteratorPhoto = hotelPhoto.values();
    var imageContainer = document.createElement('div');
    imageContainer.setAttribute("class", "hotelImageShow");

    for (let eachPhoto of iteratorPhoto) {
        imageContainer.innerHTML += `<div class="hotelImageShow" style="background-image:url('${eachPhoto.url}')"></div>`;
    }
    return imageContainer.innerHTML;
}

function generateEachFacility(hotelFacility) {
    var iteratorFacility = hotelFacility.values();
    var tagContainer = document.createElement('li');
    tagContainer.setAttribute("class", "highlightTag");

    for (let eachFacility of iteratorFacility) {
        tagContainer.innerHTML += `<li><a href="#" class="highlightTag">${eachFacility}</a></li>`;;
    }
    return tagContainer.innerHTML;
}

function generateStar(hotelStar) {
    var star = document.createElement('div');
    star.setAttribute("class", "hotelStar");
    for (let i = 0; i < hotelStar; i++) {
        star.innerHTML += `<i class="fas fa-star"></i>`;
    }
    return star.innerHTML;
}


function showHotel(hotelData) {
    console.log(hotelData.length);
    
    document.getElementById("localHotel").innerHTML = "";
    if(hotelData.length == 0){
        document.getElementById("localHotel").innerHTML = "<div>there is no hotel</div>";
    }
    var hotelContainer = document.createElement('div');
    hotelContainer.setAttribute("id", "hotelList");
    hotelContainer.setAttribute("class", "hotel-info");


    for (let j = 0; j < hotelData.length; j++) {

        var iteratorPhoto = hotelData[j].photos.values();
        for (let eachPhoto of iteratorPhoto) {}


        var iteratorFacility = hotelData[j].shortFacilities.values();
        for (let eachFacility of iteratorFacility) {}


        hotelContainer.innerHTML += `<div id="each-Hotel">` +
            `<div class="hotel-Image-Container">` +
            `<div class="scrollmenu">` +
            generateEachHotelPhoto(hotelData[j].photos) +






            `</div>` +
            `</div>` +
            `<ul class="infoContainer">` +
            `<div class="hotelName">` +
            `<i class="fas fa-hotel"></i>` +
            `${hotelData[j].name.en}` +
            `</div>` +
            `<div class="hotelAddress">` +
            `<i class="fas fa-map-marker-alt"></i>` +
            `${hotelData[j].address.en}</div>` +
            `<div class="hotelPrice">` +
            `<i class="fas fa-dollar-sign"></i>` +
            `${hotelData[j].pricefrom}` +
            `</div>` +
            `<div class="hotelCheckIn">` +
            `<i>CheckIn: </i>` +
            `${hotelData[j].checkIn}` +
            `</div>` +
            `<div class="hotelCheckOut">` +
            `<i>CheckOut: </i>` +
            `${hotelData[j].checkOut}` +
            `</div>` +
            `<ul class="hightlightsTag-Container">` +
            generateEachFacility(hotelData[j].shortFacilities) +
            `</ul>` +
            `<div class="hotelStar">` +
            `<label>Stars:</label>` +
            generateStar(hotelData[j].stars) +
            `</div>` +

            `</div>` +
            `</div>`;




    }
    document.getElementById("localHotel").appendChild(hotelContainer);



}


showWeather(JSON.parse(document.getElementById("weatherData").textContent));


showEachRestaurant(JSON.parse(document.getElementById("RestaurantDetail").textContent).restaurants);

showHotel(JSON.parse(document.getElementById("hotelDetails").textContent));


