//REQUIRE PACKAGES (request, spotify, twitter, fs)
var request = require('request');
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var fs = require("fs");
//REQUIRE KEYS
var keys = require('./keys.js')
//SHIFT ARGUMENTS
process.argv.shift();
process.argv.shift();

var thisFunction = process.argv[0];

if(thisFunction == 'my-tweets'){
    tweets();
}else if(thisFunction == 'spotify-this-song'){
    var thisSong = process.argv[1];
    spotify(thisSong)
}else if(thisFunction == 'movie-this'){
    var thisMovie = process.argv[1];    
    getMovie(thisMovie);
}else if(thisFunction == 'do-what-it-says'){
    doIt();
}else{
    console.log('Sorry, I didn\'t understand you.');    
}

function spotify(thisSong){
    var thisTrack = process.argv[1];
    if(thisTrack === undefined){
        thisTrack = 'The Sign - Ace of Base';
    }
  
    var spotify = new Spotify({
        id: keys.spotifyKeys.client_id,
        secret: keys.spotifyKeys.client_secret
      });
       
      spotify.search({ type: 'track', query: thisTrack }, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }
      var jsonData = JSON.stringify(data);
      var parsedData = JSON.parse(jsonData);
      var tracks = parsedData.tracks.items;         
      if(tracks.length === 1){
          console.log('I found 1 matching track\n');
      }else{
          console.log('I found ' + (tracks.length === 20 ? 'at least 20' : tracks.length) + ' matching tracks:\n');         
      }
      console.log('----------')
      for(i=0; i < tracks.length; i++){
          var thisTrack = tracks[i];
          //What the hell, Spotify API?!
          var jsonArtist = JSON.stringify(thisTrack.artists);
          var parsedArtist = JSON.parse(jsonArtist);
          thisArtist = parsedArtist[0].name; 
          //Log errything
          console.log('Artist(s) : ' + thisArtist + '\n');
          console.log('Title : ' + thisTrack.name + '\n');
          console.log('Album : ' + thisTrack.album.name + '\n');
          console.log('Preview : ' + (tracks[i].preview_url == 'null' ? 'Unavailable' : tracks[i].preview_url));
          console.log('----------')
      }
      });
}


function tweets(){
    var client = new Twitter({
        consumer_key: keys.twitterKeys.consumer_key,
        consumer_secret: keys.twitterKeys.consumer_secret,
        access_token_key: keys.twitterKeys.access_token_key,
        access_token_secret: keys.twitterKeys.access_token_secret
      });

    client.get('statuses/user_timeline',{count : 20, screen_name : 'dan_seiser'}, function(error, tweets, response) {
        if(error) console.log(error);
        console.log('Last ' + tweets.length + ' tweets from dan_seiser');
        console.log('----------');
        for(i=0; i< tweets.length; i++){
            console.log('TWEET : ' + tweets[i].text);
            console.log('DATE/TIME : ' + tweets[0].created_at);
            console.log('----------')
        }
      });
    
}

// Function for running a Movie Search
function getMovie(movieName) {
    if (movieName === undefined) {
      movieName = "Mr Nobody";
    }
  
    var url = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=full&tomatoes=true&apikey=" + keys.omdbKey;
  
    request(url, function(err, res, body) {
      if (!err && res.statusCode === 200) {
        var jsonData = JSON.parse(body)
        console.log("Title: " + jsonData.Title);
        console.log("Year: " + jsonData.Year);
        console.log("Rated: " + jsonData.Rated);
        console.log("IMDB Rating: " + jsonData.imdbRating);
        console.log("Country: " + jsonData.Country);
        console.log("Language: " + jsonData.Language);
        console.log("Plot: " + jsonData.Plot);
        console.log("Actors: " + jsonData.Actors);
        console.log("Rotton Tomatoes URL: " + jsonData.tomatoURL);
      }
    });
  };


// Function for running a command based on text file
var doIt = function() {
    fs.readFile("random.txt", "utf8", function(error, data) {
      var dataArr = data.split(",");
      if (dataArr.length === 2) {
        pick(dataArr[0], dataArr[1]);
      }
      else if (dataArr.length === 1) {
        pick(dataArr[0]);
      }
    });
  };
