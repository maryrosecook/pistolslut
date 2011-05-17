var wii = require( 'nodewii' ),
    app = require( 'express' ).createServer(),
    io = require( 'socket.io' ),
    wiimote = new wii.WiiMote();

var clients = {
  lookup: function( key ) {
    var key;
    Object.keys( clients ).forEach( function( e ) {
      if( clients[e] === key ) {
        key = e;
        return false;
      }
    });

    return key;
  },
  all: function() {
    var _ = [];
    Object.keys( clients ).forEach( function( e ) {
      if( typeof clients[e] !== 'function' ) {
        _.push( e );
      }
    });

    return _;
  }
};

function sendAll( name, args ) {
  args.method = name;

  clients.all().forEach(function( e ) {
    clients[e].socket.send( args );
  });
}

var socket = io.listen( app );

console.log( 'Put wiimote in discoverable mode...' );
if( process.argv.length !== 3 ) {
  console.log( 'Need a mac address' );

  process.exit( 0 );
}
wiimote.connect( process.argv[2], function( err ) {
  if( err ) { console.log( 'Could not establish connection'); return; }
  console.log('connected');

  wiimote.rumble( true );

  setTimeout(function() {
    wiimote.rumble( false );
  }, 500);

  wiimote.button( true );
  var bmapping = {};
  wiimote.on( 'buttondown', function( data ) {
    if( !(data in bmapping) ) {
      sendAll( 'buttondown', { data: data } );
      bmapping[data] = 1;
    }
  });
  wiimote.on( 'buttonup', function( data ) {
    sendAll( 'buttonup', { data: data } );
    delete bmapping[data];
  });
  
  // Wait for infrared data
  var bit = 0, prev = [];

  wiimote.ir( true );
  wiimote.on( 'ir', function( err, data ) {

   // if(data[0] !== 0 && data[1] !== 0 && bit < 1) {
   //   bit += 1;
   //   prev = data;
   //   //data[0] = ( data[0] * -1 ) + 500;
   // }
   // else if(data[0] !== 0 && data[1] !== 0 && bit === 1) {
   //   //data[0] = (data[0]+prev[0]) / 2;
   //   //data[0] = ( data[0] * -1 ) + 500;

   //   //data[1] = (data[1]+prev[1]) / 2;
   //   prev[0] = prev[0] * -1;
   //   prev[1] = prev[1];

   //   sendAll( 'ir', { data: prev } );
   //   bit += 1;
   // }
   // else {
   //   bit = 0;
   // }

  });

  socket.on( 'connection', function( socket ) {
    wiimote.rumble( true );
    wiimote.led( 1, true );

    setTimeout(function() {
      wiimote.rumble( false );
    }, 500);

    var uuid = socket.sessionId;

    var client = clients[ uuid ] = { socket: socket };

    function send( name, args ) {
      args.method = name;
      socket.send( args );
    }

    send( 'uuid', { uuid: uuid } );

    socket.on( 'message', function( e ) {
      var actions = {};

      return function( e ) {
        e.method && e.method in actions && actions[ e.method ]( e );
      };
    }());

    socket.on( 'disconnect', function( socket ) {
      delete clients[ clients.lookup( socket ) ];
    });
  });

  app.listen( 1337 );
});
