var express = require('express'),
	app = express(),
	http = require('http').Server(app),
	io = require('socket.io')(http);

app.use( express.static( __dirname + '/public') );

app.get('/', function(req, res){
  res.sendfile('public/index.html');
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});

io.emit('some event', { for: 'everyone' });

http.listen(3000, function(){
	console.log('Server booted on *:3000 at', new Date() );
});
