// m.player
// (c) 2011 Enginimation Studio (http://enginimation.com).
// m.player may be freely distributed under the MIT license.
// For all details and documentation:
// https://github.com/podviaznikov/m.player
var util = require('util'),
    express = require('express'),
    connect = require('connect'),
    LastFmNode = require('lastfm').LastFmNode,
    lastfm = new LastFmNode({
        api_key: 'e3377f4b4d8c6de47c7e2c81485a65f5',
        secret: '99523abcd47bd54b5cfa10cf9bb81f20'
    });
    app = express.createServer();
app.configure(function()
{
    app.use(connect.favicon(__dirname + '/public/16.png'));
    //logger
    app.use(express.logger());
    //router
    app.use(app.router);
    //public folder for static files
    app.use(express.static(__dirname+'/public'));
});
app.get('/app.mf', function(req, res)
{
    res.header("Content-Type", "text/cache-manifest");
    res.sendfile(__dirname + '/app.mf');
});
app.get('/auth',function(req,res)
{
    var token = req.query.token,
        session = lastfm.session();
    util.log('token='+token);
    session.authorise(token, {
       handlers: {
          authorised: function(session) {
             var x ={
                name:'Kiwi',
                artist:{
                    '#text':'Maroon 5'
                }
             };
             util.log('authorised');
             var LastFmUpdate = lastfm.update('nowplaying', session, { track: x } );
             LastFmUpdate.on('success',function(track)
             {
                util.log('succesfull update');
                util.inspect(track)
             });
             LastFmUpdate.on('error',function(track,error)
             {
                util.log('unsuccesfull update='+error);
             });
             LastFmUpdate = lastfm.update('scrobble', session, { track: x, timestamp: 12345678} );
             LastFmUpdate.on('success',function(track)
             {
                util.log('succesfull scrobble');
                util.inspect(track)
             });
             LastFmUpdate.on('error',function(track,error)
             {
                util.log('scrobble update='+error);
             });
          }
       }
    });

});
app.listen(8083);
util.log('started app on 8083');