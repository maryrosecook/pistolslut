var assert = require('assert');
var genetics = require("../genetics");

// make population, pick two phenotypes, get them to fuck and then
// check child has a reasonable sequence
var population = new genetics.Population();
population.getPhenotypes(function(phenotypes) {
    var childPhenotype = phenotypes[0].fuck(phenotypes[1]);

    for(var gene in childPhenotype.sequence)
    {
        assert.ok(childPhenotype.sequence[gene] > 0);
        assert.ok(childPhenotype.sequence[gene] < 1);
    }
});