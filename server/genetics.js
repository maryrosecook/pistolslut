var sys = require("sys");
var url = require("url");
var fs = require("fs");
var redis = require("./redisclient");

var mutationProbability = 0.05;
var genome = ["shoot", "grenade", "crouch", "stand", "cover", "reload" ];

var genetics = exports;

function writeFile(filepath, string) {
    fs.writeFile(filepath, string, function(err) {
        if(err)
            sys.puts("Could not save " + filepath + " " + err);
        else
            sys.puts("Saved " + filepath);
    });
}

function randomElement(elements) {
    if(elements.length > 0)
        return elements[Math.floor(elements.length * Math.random())];
    else
        return null;
}



genetics.Population = function(populationSize) {
    this.mutationProbability = mutationProbability;
    this.genome = genome;

    var population = this;
	var redisClient = new redis.createClient();
	redisClient.stream.addListener("connect", function () {
	    redisClient.llen('phenotypes', function (err, value) {
            redisClient.close();
            if(value == 0) // need to create initial population
                for(var i = 0; i < populationSize; i++)
                    new genetics.Phenotype(population).writeToDB();
            else
                population.newGeneration();

            population.writeToFile();
		});
	});
}

// takes current population and makes a new generation
genetics.Population.prototype = {
    asJSON: function(callback) {
        var population = this;
        this.getPhenotypes(function(phenotypes) {
            var data = {};
            data.mutationProbability = population.mutationProbability;
            data.genome = population.genome;
            data.phenotypes = [];
            for(var i in phenotypes)
                data.phenotypes.push(phenotypes[i].sequence);

            callback(JSON.stringify(data));
        });
    },

    writeToFile: function() {
        this.asJSON(function(json) {
            writeFile("../resources/phenotypes.js", json);
        });
    },

    newGeneration: function() {
        console.log("new")
        this.getPhenotypes(function(phenotypes) {
            var parents = [];
            for(var i in phenotypes)
                parents.push(phenotypes[i]);

            // remove all phenotypes (parents) from db and then add children
	        var redisClient = new redis.createClient();
	        redisClient.stream.addListener("connect", function () {
		        redisClient.del('phenotypes', function (err, value) {
			        redisClient.close();
                    for(var i = 0; i < Math.ceil(parents.length / 2); i++)
                        randomElement(parents).fuck(randomElement(parents));
		        });
	        });
        });
    },

    // returns a random phenotype
    getPhenotypes: function(callback) {
        var population = this;
	    var redisClient = new redis.createClient();
	    redisClient.stream.addListener("connect", function () {
		    redisClient.llen('phenotypes', function (err, len) {
                if(len > 0)
                {
		            redisClient.lrange('phenotypes', 0, len - 1, function (err, phenotypeData) {
                        var phenotypes = JSON.parse(phenotypeData);
                        //console.log(phenotypes)
                        var phenotypeObjs = [];
                        for(var i in phenotypeData)
                            phenotypeObjs.push(new genetics.Phenotype(population, phenotypeData[i]))

                        callback(phenotypeObjs);
			            redisClient.close();
                    });
                }
                else
                    return [];
		    });
	    });
    },

    toString: function() {
        str = "";
        str += "mutationProbability: " + this.mutationProbability.toString() + "\n";

        str += "genome: ";
        for(var i in this.genome)
            str += this.genome[i] + ", ";
        str += "\n";

        str += "phenotypes:\n";
        for(var i in this.phenotypes)
            str += this.phenotypes[i] + "\n";

        return str;
    },
}



genetics.Phenotype = function(population, sequenceJSON) {
    this.population = population;
    if(sequenceJSON !== undefined) // convert passed json to hash of genes and their values
        this.sequence = JSON.parse(sequenceJSON);
    else // generate random sequence
    {
        this.sequence = {};
        for(var i in this.population.genome)
            this.sequence[this.population.genome[i]] = Math.random();
    }
},

genetics.Phenotype.prototype = {
    // write phenotype to db
    writeToDB: function() {
        var phenotypeJSON = this.asJSON();
        var redisClient = new redis.createClient();
	    redisClient.stream.addListener("connect", function () {
	        redisClient.rpush('phenotypes', phenotypeJSON, function (err, value) {
	            redisClient.close();
	        });
	    });
    },

    asJSON: function() {
        return JSON.stringify(this.sequence);
    },

    // makes child with sequence made gene values either taken from from random, or mutated
    fuck: function(phenotype) {
        var childSequence = {};
        for(var i in this.population.genome)
        {
            var gene = this.population.genome[i];
            if(Math.random() < this.population.mutationProbability) // mutate this gene
                childSequence[gene] = Math.random();
            else // take from a random parent
                childSequence[gene] = Math.random() > 0.5 ? this.sequence[gene] : phenotype.sequence[gene];
        }

        return new genetics.Phenotype(this.population, childSequence);
    },

    toString: function() {
        var str = "";
        for(var gene in this.sequence)
            str += gene + " " + this.sequence[gene].toString().substr(0, 3) + ", ";

        return str;
    },
}