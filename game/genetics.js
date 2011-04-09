Engine.initObject("Population", "Base", function() {
	var Population = Base.extend({
        mutationProbability: null, // per gene
        genome: null,
        phenotypes: null,

        constructor: function(json, phenotypes) {
            this.mutationProbability = json.mutationProbability;
            this.genome = [];
            for(var gene in json.genome)
                this.genome.push(gene);

            this.phenotypes = phenotypes;
	    },

        generateStartingPopulation: function(populationSize) {
            this.phenotypes = [];
            for(var i = 0; i < populationSize; i++)
            {
                var phenotype = new Phenotype(this);
                phenotype.randomise();
                this.phenotypes.push(phenotype);
            }
        },

        // takes current population and makes a new generation
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
        getPhenotype: function() {
            return this.randomElement(this.phenotypes);
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

        randomElement: function(elements) {
            if(elements.length > 0)
                return elements[Math.floor(Math.random() * elements.length)]
            else
                return null;
        },
	}, {
	    getClassName: function() { return "Population"; },
	});

	return Population;
});

Engine.initObject("Phenotype", "Base", function() {
	var Phenotype = Base.extend({
        population: null,
        sequence: null,

        constructor: function(population, sequence) {
            this.population = population;
            if(sequence !== undefined)
                this.sequence = sequence;
            else
                this.sequence = {};
	    },

        // randomises all gene values
        randomise: function() {
            for(var i in this.population.genome)
                this.sequence[this.population.genome[i]] = Math.random();
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

            return new Phenotype(this.population, childSequence);
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
	}, {
	    getClassName: function() { return "Phenotype"; }

	});

	return Phenotype;
});