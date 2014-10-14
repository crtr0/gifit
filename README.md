# GifIt - convert videos into animated gifs using Node, libav, imagemagick and Twilio

![high five](http://twilio.com/blog/wp-content/uploads/2014/10/highfive1.gif)

This is the code repo for a blog post on how your can use a bunch of awesome technologies to convert videos on your phone into animated GIFs. I highly encourage you to walk through the entire [tutorial](http://twilio.com/blog/2014/10/convert-videos-on-your-phone-into-animated-gifs-using-node-libav-and-imagemagick.html) to get this software up-and-running on your VPS.

If you have any questions or run into an issue, please feel free to file an issue. Thanks!

## Setup

You will need the following to get started:

* [Twilio MMS-enabled phone number](https://www.twilio.com/mms)
* Ubuntu VPS
* Node.js

## Installation

On your Ubuntu VPS, grab the source code:

`git clone <this repo>`

Change into the directory that was created and install the necessary modules:

`npm install`

Get the necessary binaries:

```
sudo apt-get update
sudo apt-get install libav-tools
sudo apt-get install imagemagick
```

Set-up some environment variables for your Node app:

```
export TWILIO_ACCOUNT_SID=xxx
export TWILIO_AUTH_TOKEN=yyy
```

Spin-up your Node server

`node .`

Log-in to your Twilio account and edit an MMS-capable phone number. Set the Messaging Request URL to `http://yourhost:3000/message`. Make sure you select `HTTP GET`. Click "Save".

## Test

Ok, now send a short (~6 seconds) video to your Twilio MMS-enables phone number. You should see a flow like this:

![video to gif conversion](https://www.twilio.com/blog/wp-content/uploads/2014/10/2014-10-06-13.30.31-e1412894761114.png)


## Meta 

* No warranty expressed or implied.  Software is as is.
* [MIT License](http://www.opensource.org/licenses/mit-license.html)
* Made with ♥ by [Twilio](http://www.twilio.com) Seattle
