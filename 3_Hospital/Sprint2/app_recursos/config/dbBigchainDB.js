const IP = '35.247.240.45';

const MongoClient = require( 'mongodb' ).MongoClient;
const url = 'mongodb://stepesbd:stepesbd2020@' + IP + ':27017/?authMechanism=SCRAM-SHA-1&authSource=bigchain';
var _db;

module.exports = {

  IP: IP,
  connectToServer: function( callback ) {
    MongoClient.connect( url,  { 
		useNewUrlParser: true, 
		useUnifiedTopology: true
	}, function( err, client ) {
      _db  = client.db('bigchain');
      return callback( err );
    } );
  },

  getDb: function() {
    return _db;
  }
};