var express = require('express');
var router = express.Router();
const fetch = require('node-fetch');
const zomatoKey = "7c63e01569231ee167812a470b245b08";
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json();
const weatherKey = "917150288cb3d1e04bb2270ec1ec6abe";
const hotelKey = "3e6ae58f1f4304d575cb1a739147986f";
const newsKey = "e4a6ecb9a2cf404082a85b6533efe7de";



var urlencodedParser = bodyParser.urlencoded({ extended: true })







/* GET home page. */
router.get('/', function(req, res, next) {
  var zomato_url = `https://developers.zomato.com/api/v2.1/geocode?lat=${-35.2809}&lon=${149.1300}&count=20`;


  fetch(zomato_url, {
    method: "GET",
    headers: {
        "user-key": zomatoKey
    }

}).then(restaurant => restaurant.json()).then(function(data){
  // console.log(data);
  res.render('index', { title: `${data.location.title}` });

});
});


function appendLeadingZeroes(n){
  if(n+1 <= 9){
    return "0" + n+1;
  }
  return n+1;
}


router.post('/getData', urlencodedParser, function(req, res, next) {

  const data = req.body.placeSearch;

  var coordiante = data.split(" ");


  console.log(data);
  console.log(coordiante[0]);
  console.log(coordiante[1]);

  var datetime = new Date();
  console.log(datetime);

  var date = datetime.getDate();
  var month = datetime.getMonth();
  var year = datetime.getFullYear();

  console.log(date);
  console.log("0" + (month+1));
  console.log(year);




  var zomato_url = `https://developers.zomato.com/api/v2.1/geocode?lat=${coordiante[0]}&lon=${coordiante[1]}&count=20`;

  


  fetch(zomato_url, {
    method: "GET",
    headers: {
        "user-key": zomatoKey
    }

}).then(restaurant => restaurant.json()).then(function(data){
  // console.log(data);
  var zomato_restaurant_url = `https://developers.zomato.com/api/v2.1/search?entity_id=${data.location.entity_id}&start=0&count=20&lat=${data.location.latitude}&lon=${data.location.longitude}&radius=2000`;

  fetch(zomato_restaurant_url,{
    method: "GET",
    headers: {
        "user-key": zomatoKey
    }
  }).then(restaurantData => restaurantData.json()).then(function(eachRestaurant){
    var openweathermap_url = `https://api.openweathermap.org/data/2.5/forecast?lat=${data.location.latitude}&lon=${data.location.longitude}&appid=${weatherKey}`;

    var hotelSave = [];
    var hotel_url = `https://engine.hotellook.com/api/v2/lookup.json?query=${data.location.latitude},${data.location.longitude}&lang=en&lookFor=hotel&limit=10&token=${hotelKey}`;

    fetch(hotel_url).then(hotel => hotel.json()).then(function(hotelData){
      for (let i = hotelData.results.hotels.length - 1; i < hotelData.results.hotels.length; i++) {
        fetch(`https://engine.hotellook.com/api/v2/static/hotels.json?locationId=${hotelData.results.hotels[i].locationId}&token=${hotelKey}`).then(function(hotel) {
            return hotel.json();
        }).then(function(hotelList) {
            for (let j = 0; j < hotelList.hotels.length; j++) {
                if (hotelList.hotels[j].stars != 0 && hotelList.hotels[j].pricefrom != 0 && hotelList.hotels[j].rating != 0 && hotelList.hotels[j].photos.length > 1) {
                    //  console.log(hotelList.hotels[j]);
                    hotelSave.push(hotelList.hotels[j]);
                }
            }


            
            // console.log(hotelSave);
            fetch(openweathermap_url).then(weatherData =>  weatherData.json()).then(function(weatherInfo){
  
              // console.log(weatherInfo);
              // console.log(weatherInfo.list[0].main);
              res.render('result', {title: `${weatherInfo.city.name}`, cityName: `${weatherInfo.city.name}`, restaurant: `${JSON.stringify(data)}`, weather: `${JSON.stringify(weatherInfo)}` ,restaurantDetail: `${JSON.stringify(eachRestaurant)}`, hotelDetail: `${JSON.stringify(hotelSave)}`} );
          
            })


        })
    }
   

    })


    


  })


  



});
});












module.exports = router;
