var sys = require("sys");
var url = require("url");
var redis = require("./redisclient");
var util = require("./util");

var genetics = exports;

genetics.Population = function(initialPopulationSize, mutationProbability, genome, dataFilepath) {
    this.dataFilepath = dataFilepath;
    this.phenotypes = null;
    this.mutationProbability = null;
    this.genome = null;

    var population = this;
	var redisClient = new redis.createClient();
    this.readFromFile(function (populationData) {
        if(populationData == null) // need to create initial population
            population.initialiseFromScratch(initialPopulationSize, mutationProbability, genome);
        else // existing data on disk
        {
            population.initialiseFromData(populationData);
            console.log(population.toString())
            population.newGeneration();
            console.log(population.toString())
        }
    });
}

// takes current population and makes a new generation
genetics.Population.prototype = {
    initialiseFromScratch: function(initialPopulationSize, mutationProbability, genome) {
        this.mutationProbability = mutationProbability;
        this.genome = genome;

        this.phenotypes = [];
        for(var i = 0; i < initialPopulationSize; i++)
            this.phenotypes.push(new genetics.Phenotype(this));

        this.writeToFile();
    },

    initialiseFromData: function(data)  {
        this.mutationProbability = data.mutationProbability;
        this.genome = data.genome;

        this.phenotypes = [];
        for(var i in data.phenotypes)
            this.phenotypes.push(new genetics.Phenotype(this, data.phenotypes[i]));
    },

    newGeneration: function() {
        var parents = [];
        for(var i in this.phenotypes)
            parents.push(this.phenotypes[i]);

        this.phenotypes = []; // remove all parents
        for(var i = 0; i < Math.ceil(parents.length / 2); i++)
        {
            this.phenotypes.push(util.randomElement(parents).fuck(util.randomElement(parents)));
            this.phenotypes.push(util.randomElement(parents).fuck(util.randomElement(parents)));
        }

        this.writeToFile();
    },

    toJSON: function() {
        var data = {};
        data.mutationProbability = this.mutationProbability;
        data.genome = this.genome;
        data.phenotypes = [];
        for(var i in this.phenotypes)
            data.phenotypes.push(this.phenotypes[i].sequence);

        return(JSON.stringify(data));
    },

    writeToFile: function() {
        if(this.dataFilepath)
            util.writeFile(this.dataFilepath, this.toJSON());
    },

    readFromFile: function(callback) {
        if(this.dataFilepath)
        {
            util.readFile(this.dataFilepath, function(data) {
                callback(JSON.parse(data));
            });
        }
        else
            callback(null);
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
            str += this.phenotypes[i].toString() + "\n";

        return str;
    },
}



genetics.Phenotype = function(population, sequence) {
    this.population = population;
    if(sequence !== undefined) // convert passed json to hash of genes and their values
        this.sequence = sequence;
    else // generate random sequence
    {
        this.sequence = {};
        for(var i in this.population.genome)
            this.sequence[this.population.genome[i]] = Math.random();
    }
},

genetics.Phenotype.prototype = {
    // write phenotype to db
    // writeToDB: function() {
    //     var phenotypeJSON = this.asJSON();
    //     var redisClient = new redis.createClient();
	//     redisClient.stream.addListener("connect", function () {
	//         redisClient.rpush('phenotypes', phenotypeJSON, function (err, value) {
	//             redisClient.close();
	//         });
	//     });
    // },

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
            str += gene + " " + this.sequence[gene].toString().substr(0, 4) + ", ";

        return str;
    },
}