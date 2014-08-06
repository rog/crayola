(function() {
	var socket = io();

	var canvas = document.querySelector('#paint');
	var ctx = canvas.getContext('2d');
	
	var window_width = window.innerWidth;
	var window_height = window.innerHeight;

	canvas.width = parseInt( window_width );
	canvas.height = parseInt( window_height );

	var mouse = {x: 0, y: 0};
	var last_mouse = {x: 0, y: 0};
	
	/* Mouse Capturing Work */
	canvas.addEventListener('mousemove', function(e) {
		mouse.x = e.pageX - this.offsetLeft;
		mouse.y = e.pageY - this.offsetTop;
	}, false);
	
	canvas.addEventListener('mousedown', function(e) {
		last_mouse.x = mouse.x;
		last_mouse.y = mouse.y;
	}, false);

	canvas.addEventListener('touchstart', function(e){
		e.preventDefault();
		last_mouse.x = e.targetTouches[0].pageX - canvas.offsetLeft;
		last_mouse.y = e.targetTouches[0].pageY - canvas.offsetTop;
	}, false);

	canvas.addEventListener('touchend', function( e ){
		var e = event;
		e.preventDefault();
		mouse.x = e.changedTouches[0].pageX - canvas.offsetLeft;
		mouse.y = e.changedTouches[0].pageY - canvas.offsetTop;
		socket.emit('chat message', { 'mouse_start': last_mouse, 'mouse_end': mouse} );
	}, false);
	
	canvas.addEventListener('mouseup', function() {
		socket.emit('chat message', { 'mouse_start': last_mouse, 'mouse_end': mouse} );
	}, false);
	
	/* Drawing on Paint App */
	ctx.lineWidth = 5;
	ctx.lineJoin = 'round';
	ctx.lineCap = 'round';
	ctx.strokeStyle = 'blue';

	var emit_paint = function( mouse_coords ) {
		ctx.beginPath();
		ctx.moveTo( mouse_coords.mouse_start.x, mouse_coords.mouse_start.y );
		ctx.lineTo( mouse_coords.mouse_end.x, mouse_coords.mouse_end.y);
		ctx.closePath();
		ctx.stroke();
	};

	socket.on('chat message', function( mouse_coords ){
		emit_paint( mouse_coords );
	});

	colors = document.querySelectorAll('#color_select span');
	for( i=0; i < colors.length; i++){
		colors[i].onclick = function() {
			var new_color = this.dataset.color;
			ctx.strokeStyle = new_color;
		};
	}
	
}());