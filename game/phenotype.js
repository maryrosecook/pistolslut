Engine.initObject("Phenotype", "Base", function() {
	var Phenotype = Base.extend({
        sequence: null,
        fromServer: false,

        // Constructs phenotype by getting sequence from server.
        // If server unresponsive, constructs phenotype for itself.
        constructor: function() {
            this.sequence = sequence;
	    },

        // returns true if probability roll comes up true for passed gene
        expressed: function(gene) { return Math.random() > this.sequence[gene]; },

        // remove from population
        die: function() {
            if(this.sequenceFromServer)
            {
                // tell server phenotype died
            }
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