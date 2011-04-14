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
        var phenotypeCount = this.phenotypes.length;

        // get first parents.length / 2 fittest phenotypes
        var parents = [];
        var phenotypesByFitness = this.phenotypes.sort(this.fitnessSort);
        for(var i in phenotypesByFitness)
        {
            parents.push(this.phenotypesByFitness[i]);
            if(i == Math.ceil(phenotypeCount / 2) - 1)
                break;
        }

        this.phenotypes = []; // remove all parents
        while(this.phenotypes.length < phenotypeCount)
        {
            this.phenotypes.push(util.randomElement(parents).fuck(util.randomElement(parents)));
            this.phenotypes.push(util.randomElement(parents).fuck(util.randomElement(parents)));
        }

        this.writeToFile();
    },

    fitnessSort: function(a, b) {
        return b.deaths - a.deaths;
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
    this.id = util.guid();
    this.deaths = 0;
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
    asJSON: function() {
        var data = {};
        data.id = this.id;
        data.sequence = this.sequence;
        return JSON.stringify(data);
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

    // does not actually kill, just increments death counter (measure of fitness)
    die: function() {
        this.deaths += 1;
    },

    toString: function() {
        var str = "";
        for(var gene in this.sequence)
            str += gene + " " + this.sequence[gene].toString().substr(0, 4) + ", ";

        return str;
    },
}