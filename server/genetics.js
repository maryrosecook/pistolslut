var sys = require("sys");
var url = require("url");
var redis = require("./redisclient");

var mutationProbability = 0.05;
var genome = ["shoot", "grenade", "crouch", "stand", "cover", "reload" ];

var genetics = exports;

genetics.Population = function(populationSize) {
    this.mutationProbability = mutationProbability;
    this.genome = genome;

	var redisClient = new redis.createClient();
	redisClient.stream.addListener("connect", function () {
	    redisClient.llen('phenotypes', function (err, value) {
            if(value == 0) // need to create initial population
            {
                for(var i = 0; i < populationSize; i++)
                {
                    (new genetics.Phenotype(this)).write();
                }
            }
		    redisClient.close();
		});
	});
}

// takes current population and makes a new generation
genetics.Population.prototype = {
    newGeneration: function() {
        var parents = [];
        for(var i in this.phenotypes)
            parents.push(this.phenotypes[i]);

        for(var i = 0; i < Math.ceil(parents.length / 2); i++)
        {
            this.phenotypes.push(this.randomElement(parents).fuck(this.randomElement(parents))); // possible for phenotype to end up fucking itself
            this.phenotypes.push(this.randomElement(parents).fuck(this.randomElement(parents)));
        }

        for(var i in parents)
            parents[i].die();
    },

    // returns a random phenotype
    getPhenotype: function(callback) {
        var population = this;
	    var redisClient = new redis.createClient();
	    redisClient.stream.addListener("connect", function () {
		    redisClient.llen('phenotypes', function (err, value) {
                if(value > 0)
                {
                    var randomI = Math.floor(value * Math.random());
		            redisClient.lindex('phenotypes', randomI, function (err, value) {
                        console.log(callback, value)
                        callback(new genetics.Phenotype(population, value));
			            redisClient.close();
                    });
                }
		    });
	    });
    },

    kill: function(phenotype) { EngineSupport.arrayRemove(this.phenotypes, phenotype); },

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
    if(sequence !== undefined) // convert passed json to hash of genes and their values
        this.sequence = eval(sequenceJSON);
    else // generate random sequence
    {
        this.sequence = {};
        for(var i in this.population.genome)
            this.sequence[this.population.genome[i]] = Math.random();
    }
},

genetics.Phenotype.prototype = {
    // write phenotype to db
    write: function() {
        var phenotypeJSON = this.asJSON();
        var redisClient = new redis.createClient();
	    redisClient.stream.addListener("connect", function () {
	        redisClient.lpush('phenotypes', phenotypeJSON, function (err, value) {
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

    // returns true if probability roll comes up true for passed gene
    expressed: function(gene) { return Math.random() > this.sequence[gene]; },

    // remove from population
    die: function() {
        this.population.kill(this);
    },

    toString: function() {
        var str = "";
        for(var gene in this.sequence)
            str += gene + " " + this.sequence[gene].toString().substr(0, 3) + ", ";

        return str;
    },
}