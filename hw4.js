// var date = new Date(unix_time_stamp*1000);
// var hours = date.getHours();
// var minutes = "0" + date.getMinutes();
// var seconds = "0" + date.getSeconds();
// var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
//
// const dateTime = new Date().getTime();
// const timestamp = Math.floor(dateTime / 1000)

let updateWidget = function(data) {
  console.log("Got weather data: ", data)
  $(".card-text").text("It is " + Math.round(data.main.temp) + " degrees outside.")
  $(".card-max").text("Today the high will be " + Math.round(data.main.temp_max) + " and the low will be "+ Math.round(data.main.temp_min) + ".")
  $(".card-title").text(data.name)
  $(".card-sunrise").text("Sunrise: " + data.sys.sunrise)
  $(".card-sunset").text("Sunset: " + data.sys.sunset)
  $("card").attr("src",'http://openweathermap.org/img/w/'+data.weather[0].icon+".png")
}

let getCurrentWeather = function(pos) {
  let latitude = pos.coords.latitude
  let longitude = pos.coords.longitude
  let apiKey = "76b81bc418323a5347ec46fa9ef345cb";
  let weatherServiceURL = 'https://api.openweathermap.org/data/2.5/weather?'
  weatherServiceURL += "lat=" + latitude
  weatherServiceURL += "&lon=" + longitude
  weatherServiceURL += "&appid=" + apiKey + "&units=imperial"
  fetch(weatherServiceURL).then(convertToJSON).then(updateWidget).catch(displayError);
}

let ESPN = function(result) {
	let source = result.articles[0].source.id;
	let col = $("#espn").html();
	let narticles = result.articles.length;
	for (let i = 0; i < narticles; ++i) {
		let item = result.articles[i];
		let txt = "<div class=\"article" + " " + source + "\">";
		txt += "<div class=\"pic\"><img class=\"img\" src=\"" + item.urlToImage+"\">";
		txt += "<span class=\"nytTitle\"><a href=\""+ item.url + "\">" + item.title + "</a></span></div>";
		txt += "<div class=\"snippet\">" + item.description + "</div></div>";
		col = col + txt;
		$("#espn").html(col);

	}
}
let NYT = function(result) {
	let nyt_col = $("#nyt").html();
	let narticles = result.response.docs.length;
	for (let i = 0; i < narticles; ++i) {
		let item = result.response.docs[i];
		if (item.multimedia.length > 0) {
			let img;
			for (let m = 0; m<item.multimedia.length; ++m) {
				if (item.multimedia[m].subtype == "thumbnail") {
					img = item.multimedia[m].url;
					break;
				}
			}
			let txt = "<div class=\"article nyt\">";
			txt += "<div class=\"pic\"><img class=\"nytImg\" src=\"https://www.nytimes.com/" + img+"\">";
			txt += "<span class=\"nytTitle\"><a href=\""+ item.web_url + "\">" + item.headline.main + "</a></span></div>";
			txt += "<div class=\"snippet\">" + item.snippet + "</div></div>";
			nyt_col = nyt_col + txt;
			$("#nyt").html(nyt_col);
		}
	}
}

let ESPNNews = function() {
		url = 'https://newsapi.org/v2/everything?' +
	          'q=NFL&' +
            'sources=' + 'espn' + '&' +
	          'sortBy=newest&' +
	          'apiKey=07fc9eef9658416294fc8edda47e14d5';
		req = new Request(url);
		fetch(req).then(convertToJSON).then(ESPN).catch(displayError);
}

 let NYTNews = function(){
	url = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
  url += '?' + $.param({
	  'api-key': "80d36f91ffcf445eb29faae89f529d43",
	  'q': "NFL",
	  'sort': "newest",
	  'fq': "source: (\"The New York Times\")",
	});
	req = new Request(url);
	fetch(req).then(convertToJSON).then(NYT).catch(displayError);
}

let currentLocation = function(event){
  navigator.geolocation.getCurrentPosition(getCurrentWeather)
}

window.onload=currentLocation
$(ESPNNews)
$(NYTNews);

//
// let getSunriseSsunset = function(pos) {
//
// }
// https://api.sunrise-sunset.org/json?lat=36.7201600&lng=-4.4203400
//
// let getLocation = function(pos) {
//   console.info(info)
//   let div = document.getElementById("location");
//   let url = "https://maps.googleapis.com/maps/api/staticmap?center=" + info.coords.latitude.toFixed(4) + "," + info.coords.longitude.toFixed(4) + "&zoom=15&size=600x400&maptype=hybrid&key=AIzaSyBrLfaqBHZNoiI8463XDdy57fJHiwA8vy4"
//   div.innerHTML = "<img src=\"" + url + "\">";
// };
//
// let link = document.getElementById("get_location")
// link.addEventListener("click", function(event) {
//   event.preventDefault();
//   navigator.geolocation.getCurrentPosition(getLocation);
// });

let convertToJSON = function(rawData){return rawData.json();}
let displayError = function(error) { console.debug(error); }
