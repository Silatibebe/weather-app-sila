
var axios = require('axios');
var yargs = require('yargs');
var argv = yargs
.options({
a:{
   demand: true,
   alias: 'address',
   describe: 'Address to fetch weather for',
   string: true,
   default:'some default address'//default value for argv.a
}
}).help()
.alias('help','h')
.argv;

//required variables
var apiKey='your api key for https://maps/googleapis.com/api/geocode/json' ;
var encodeAddressURI = encodeURIComponent(argv.a);// arg.v a user input(location address e.g zipcode or full address ) from node console 
var googleMapsUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeAddressURI}& key=${apiKey}`;

//make request to https://maps.googleapis.com/maps/api/geocode/json?address=SOME_LOCATION-INPUT&key=YOUR_API_KEY 
//using axios for geolocation data

axios.get(googleMapsUrl)
.then(function(response){
    
          if(response.data.results.length === 0){
                 console.log(response.data.status);
            throw Error('Error Message: You have made an Invalid request.');             
          }
                 
         console.log(response.data.results[0].formatted_address);
         console.log(response.data.results[0].address_components[2].long_name);   
       
            var arr = [];
            arr.push(response.data.results[0].geometry.location.lat,response.data.results[0].geometry.location.lng);
            var latComaLongStr = arr.join();
            // latComaLongStr = 'lat,long';
            var apiKeyDarkSkyDotNet='your api key for https://api.darksky.net/forecast';
            var darkSkyDotNetUrl = `https://api.darksky.net/forecast/${apiKeyDarkSkyDotNet}/${latComaLongStr}`;

            //make request to https://api.darksky.net/forecast/YOUR_API_KEY/LATITUDE,LONGTIUDE 
            //for weather data
          return axios.get(darkSkyDotNetUrl);

})
.then(function(forcastResponse){
    console.log(`summary: ${forcastResponse.data.currently.summary}`);
    console.log(`temperature: ${forcastResponse.data.currently.temperature} Degree Celsius`);
    console.log(`windspeed: ${forcastResponse.data.currently.windSpeed} m/s`); 
})
.catch(function(e){
      
        if(e){console.log(e.message);}
        if(e||e.response.status === 400){
           e.message = 'Error Message: Unable to connect to Api Servers.';
           console.log(e.message);
            
        }       
        
});

//NOTE:  
/*
THINGS TO ADD TO Z APP
---------------------
1.time(hour,min,am or pm) of the location in local time and date info
2.icons weather data
3.high and low temperature of weather data
4.fine tune the error handling so that it handles all case gracefully
*/






