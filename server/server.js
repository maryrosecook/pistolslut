var sys = require("sys");
var url = require("url");
var qs = require("querystring");
var fu = require("./fu");
var genetics = require("./genetics");

// basic setup
HOST = null; //localhost
PORT = 3000;
fu.listen(PORT, HOST);

// basic population attributes
OUTPUT_FILEPATH = "../resources/phenotypes.js";
INITIAL_POPULATION_SIZE = 20;
MUTATION_PROBABILITY = 0.05;
GENOME = ["shoot", "grenade", "crouch", "stand", "cover", "reload" ];

var population = new genetics.Population(INITIAL_POPULATION_SIZE, MUTATION_PROBABILITY, GENOME, OUTPUT_FILEPATH);

// return random phenotype
fu.get("/get_phenotypes.json", function (req, res) {
    //var count = qs.parse(url.parse(req.url).query).count;
    population.getPhenotype(function (phenotype) {
        console.log(phenotype)
        res.simpleJSON(200, phenotype.sequence);
    });
});