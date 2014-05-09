module.exports = {
	getConnection: getConnection
};

function getDbOpts(opts) {
	opts.host = opts.host || "localhost";
	opts.port = opts.port || 27017;
	return opts;
}

function getConnection(opts, cb) {
	opts = getDbOpts(opts);

	var mongodb = require('mongodb'),
		server = new mongodb.Server(opts.host, opts.port, {});

	var db = new Db(opts.database, server, {safe: true});

	db.open(function (err, db) {
		if (err) {
			return cb(err);
		}

		var fnEnd = function () {
			var collection = new mongodb.Collection(db, 'migrations');
			cb(null, {
				connection: db,
				migrationCollection: collection
			});
		};

		if (opts.user && opts.password) {
			db.authenticate(opts.user, opts.password, function (err, result) {
				if (err) {
					console.error("User or password invalid");
					db.close();
					throw err
				} else {
					fnEnd();
				}
			});
		} else {
			fnEnd()
		}
	});
}