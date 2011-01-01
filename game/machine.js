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
                node = new Pointer(subTreeJson.identifier, subTreeJson.test, subTreeJson.strategy, parent, actor);
            else
                node = new State(subTreeJson.identifier, subTreeJson.test, subTreeJson.strategy, parent, actor);

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
        test: null,
        strategy: null,
        parent: null,
        children: null,
        actor: null,

		constructor: function(identifier, test, strategy, parent, actor) {
            this.identifier = identifier;
            this.test = test;
            this.strategy = strategy;
            this.parent = parent;
            this.actor = actor;
            this.children = [];
	    },

        tick: function() {
            //console.log(this.identifier)
            if(this.isAction()) // run an actual action
                this.run();

            var potentialNextState = this.nextState();
            if(potentialNextState !== null)
                return potentialNextState.transition();
            else if(this.can()) // no child state, try and stay in this one
                return this;
            else // can't stay in this one, so back up the tree
                return this.nearestAncestor().transition();
        },

        nextState: function() {
            var strategy = this.strategy;
            if(strategy === undefined)
                strategy = this.parent.strategy;

            return this[strategy].call(this);
        },

        isTransition: function() { return this.children.length > 0 || this instanceof Pointer; },
        isAction: function() { return !this.isTransition(); },

        // returns true if actor allowed to enter this state
        can: function() {
            var functionName = this.test; // can specify custom test function name
            if(functionName === undefined) // no override so go with default function name
                functionName = "can" + this.identifier[0].toUpperCase() + this.identifier.substring(1, this.identifier.length);

            return this.actor[functionName].call(this.actor);
        },

        // returns nearest ancestor that can run
        nearestAncestor: function() {
            if(this.parent !== null)
            {
                if(this.parent.can())
                    return this.parent;
                else
                    return this.parent.nearestAncestor();
            }

            return null;
        },

        // returns first child that can run
        prioritised: function() {
            return this.nextRunnable(this.children);
        },

        nextRunnable: function(nodes) {
            for(var i in nodes)
                if(nodes[i].can())
                    return nodes[i];

            return null;
        },

        // runs all runnable children in order, then kicks up to children's grandparent
        sequential: function() {
            var nextState = null;
            if(this.isAction()) // want to get next runnable child or go back up to grandparent
            {
                var foundThis = false;
                for(var i in this.parent.children)
                {
                    var sibling = this.parent.children[i];
                    if(this.identifier == sibling.identifier)
                        foundThis = true;
                    else if(foundThis && sibling.can())
                        return sibling;
                }
            }
            else // at a sequential parent so try to run first runnable child
            {
                var firstRunnableChild = this.nextRunnable(this.children);
                if(firstRunnableChild !== null)
                    return firstRunnableChild;
            }

            return this.parent.nearestAncestor(); // no more runnable children in the sequence so return parent's first runnable ancestor
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

        run: function() {
            this.actor[this.identifier].call(this.actor); // run the action
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