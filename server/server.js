var sys = require("sys");
var url = require("url");
var qs = require("querystring");
var fu = require("./fu");
var genetics = require("./genetics");

// basic setup
HOST = null; //localhost
PORT = 3000;
fu.listen(PORT, HOST);

// setup routes to files
//fu.get("/main.css", fu.staticHandler("main.css"));

POPULATION_SIZE = 20;
var population = new genetics.Population(POPULATION_SIZE);
//console.log(population.toString());

// return random phenotype
fu.get("/get_phenotype.json", function (req, res) {
    //var count = qs.parse(url.parse(req.url).query).count;
    population.getPhenotype(function (phenotype) {
        console.log(phenotype)
        res.simpleJSON(200, phenotype.sequence);
    });
});

// put message in list and store it in quick access latest_message var
function storeMessage(message, callback) {
  var redisClient = new redis.createClient();
	redisClient.stream.addListener("connect", function () {
	  redisClient.lpush('messages', message, function (err, value) {
	    redisClient.close();
	    callback();
	  });
	});
}

// if new message available for client, return it immediately,
// or queue request to be dealt with next time new message comes in
fu.get("/latest_message", function (req, res) {
	var since = parseInt(qs.parse(url.parse(req.url).query).since);

	if(since < latestMessageReceived) // new message since client last requested
    sendLatestMessageToClient(res); // send it straight to them
  else
    messageRequests.push({ callback: sendLatestMessageToClient, res: res }); // queue up the requst
});

// retrieves latest message and sends it to user
function sendLatestMessageToClient(res) {
	var redisClient = new redis.createClient();
	redisClient.stream.addListener("connect", function () {
		redisClient.lindex('phenotypes', 0, function (err, value) {
			res.simpleJSON(200, { message: value.toString(), timestamp: new Date().getTime() });
			redisClient.close();
		});
	});
}