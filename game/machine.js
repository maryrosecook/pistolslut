Engine.initObject("Machine", "Base", function() {
	var Machine = Base.extend({
        treeJson: null,

        constructor: function(treeJson) {
            this.treeJson = treeJson;
	    },

        generateTree: function(actor) {
            return this.read(this.treeJson, null, actor);
        },

        read: function(subTreeJson, parent, actor) {
            var node = null;
            if(subTreeJson.pointer == true)
                node = new Pointer(subTreeJson.identifier, subTreeJson.strategy, parent, actor);
            else
                node = new State(subTreeJson.identifier, subTreeJson.strategy, parent, actor);

            for(var i in subTreeJson.children)
                node.children[node.children.length] = this.read(subTreeJson.children[i], node, actor);

            return node;
        },
	}, {
	  getClassName: function() { return "Machine"; }

	});

	return Machine;
});

Engine.initObject("Node", "Base", function() {
	var Node = Base.extend({
        identifier: null,
        strategy: null,
        parent: null,
        children: null,
        actor: null,

		constructor: function(identifier, strategy, parent, actor) {
            this.identifier = identifier;
            this.strategy = strategy;
            this.parent = parent;
            this.actor = actor;
            this.children = [];
	    },

        tick: function() {
            return this[this.strategy].call(this);
        },

        isRunnable: function() {
            var functionName = "can" + this.identifier[0].toUpperCase() + this.identifier.substring(1, this.identifier.length);
            return this.actor[functionName].call(this.actor);
        },

        // returns first child that can run
        prioritised: function() {
            for(var i in this.children)
                if(this.children[i].isRunnable())
                    return this.children[i].transition();

            return null;
        },
	}, {
	    getClassName: function() { return "Node"; },

	});

	return Node;
});

Engine.initObject("State", "Node", function() {
	var State = Node.extend({
        transition: function() {
            return this;
        },
	}, {
	  getClassName: function() { return "State"; }

	});

	return State;
});

Engine.initObject("Pointer", "Node", function() {
	var Pointer = Node.extend({
        transition: function() {
            return this[this.strategy].call(this);
        },

        // returns first forebear encountered when going directly up tree
        hereditory: function(pointer) {
            if(this.parent === null)
                return null;
            else if(this.parent.identifier == pointer.identifier)
                return this.parent;
            else
                return this.parent.hereditory(pointer);
        },
	}, {
	  getClassName: function() { return "Pointer"; }

	});

	return Pointer;
});