var http = require('http')
  , fs = require('fs')
  , exec = require('child_process').exec
  , request = require('request')
  , static = require('node-static')
  , url = require('url')
  , twilio = require('twilio')
  , uuid = require('node-uuid')
  , child;

// The directory where our animated gifs will live
var dir = new static.Server('./public');

// Twilio REST client
var client = new twilio.RestClient();

// Spin up our HTTP server
http.createServer(function(req, res) {
  req.addListener('end', function () {
    // Parse the request URL
    var hash = url.parse(this.url, true);
    // This is the phone number of the person who sent the video
    var phone = hash.query['From'];
    
    // This is our Twilio webhook, process the incoming video
    if (hash.pathname === '/sms') {
      var mediaUrl = hash.query['MediaUrl0'];
      
      // create a unique UUID for all of our video/gif processing
      var id = uuid.v1();
      
      res.writeHead(200, {'Content-type': 'text/xml'});
      var twiml = new twilio.TwimlResponse();

      // if media URL looks like a valid video, send ok back to the user
      if (true) { 
        twiml.message('Video queued for processing, hang tight!');
      }
      else {
        twiml.message('This is not a video format that we recognize. Try again?');
      }
      res.end(twiml.toString());
      
      // Save the remote movie file to the /tmp fs
      x = request(mediaUrl).pipe(fs.createWriteStream("scratch/"+ id));

      x.on('finish', function() {
        // Once it's saved, it's time to spin-up a child process to
        // handle decoding the video and building the gif
        child = exec('avconv -i scratch/' + id + ' -r 12 -f image2 scratch/' + id + '-%03d.jpeg && convert -delay 8 -loop 0 scratch/' + id + '*.jpeg public/' + id + '.gif && convert public/'+id+'.gif -layers optimizeplus public/'+id+'.gif && rm scratch/'+id+'*',
          function (error, stdout, stderr) {
            if (error !== null) {
              console.log('exec error: ' + error);
              client.sendMessage({
                to: phone, from: process.env.TWILIO_CALLER_ID, 
                body: 'Very sorry but an error occurred processing your video. Try a different video?'}, 
                function(err, responseData) { 
                  if (err) {
                    console.log('Error sending text: ' + err);
                  }
                });
            }
            else {
              client.sendMessage({
                to: phone, from: process.env.TWILIO_CALLER_ID, 
                mediaUrl: 'http://107.170.229.114:3000/'+id+'.gif'}, function(err, responseData) { });
            }
        });
      });
    }
    else {
        dir.serve(req, res);
    }
  }).resume();
}).listen(process.env.PORT || 3000);

console.log('Listening on port 3000');
