function RuleHead(string) {
	var index = 0;
	var predecessorIndex = string.indexOf("<");
	var successorIndex = string.indexOf(">");
	
	if(predecessorIndex != -1) {
		this.predecessor = new Symbol(string, index);
		
		index = predecessorIndex + 1;
	}
	else {
		this.predecessor = null;
	}
	
	this.symbol = new Symbol(string, index);
	
	if(successorIndex != -1)
		this.successor = new Symbol(string, successorIndex + 1);
	else
		this.successor = null;
	
	this.condition = string.substr(string.indexOf(":") + 1);
}

function RuleBody(string) {
	this.body = Lindenmayer.prototype.toSymbols(string);
}

function Rule(string) {
	var source = string.replace(/\s/g, "");
	
	this.head = new RuleHead(source.substring(0, source.lastIndexOf("=")));
	this.body = new RuleBody(source.substring(source.lastIndexOf("=") + 1));
}

function Symbol(string, index) {
	this.parse(string, index);
}

Symbol.prototype = {
	parse(string, index) {
		var startIndex = index;
		
		this.symbol = string[index];
		
		if(index + 1 < string.length && string[index + 1] == "(") {
			var start = ++index + 1;
			while(string[++index] != ")");
			
			this.parameters = string.substr(start, index - start).split(",");
		}
		
		this.length = index - startIndex;
	},
	
	getArity() {
		return this.parameters.length;
	},
	
	print() {
		var str = this.symbol;
		
		if(this.parameters != null) {
			str += "(";
			
			for(var parameter = 0; parameter < this.parameters.length; ++parameter)
				if(parameter == this.parameters.length - 1)
					str += this.parameters[parameter] + ")";
				else
					str += this.parameters[parameter] + ",";
		}
		
		return str;
	}
}

function Lindenmayer() {
	this.rules = [];
	this.constants = "";
}

Lindenmayer.prototype = {
	MAX_ITERATIONS: 16,
	
	setConstants(constants) {
		this.constants = constants;
	},
	
	setRules(rules) {
		for(var rule = 0; rule < rules.length; ++rule)
			this.addRule(rules[rule]);
	},
	
	removeRules() {
		this.setRules([]);
	},
	
	addRule(rule) {
		this.rules.push(new Rule(rule));
	},
	
	process(axiom, iterations) {
		var axiom = this.toSymbols(axiom.replace(/\s/g, ""));
		
		if(iterations > this.MAX_ITERATIONS)
			iterations = this.MAX_ITERATIONS;
		
		for(var iteration = 0; iteration < iterations; ++iteration)
			axiom = this.applyRules(axiom);
		
		return axiom;
	},
	
	toSymbols(string) {
		var symbols = [];
		
		for(var index = 0; index < string.length; ++index) {
			var symbol = new Symbol(string, index);
			
			index += symbol.length;
			symbols.push(symbol);
		}
		
		return symbols;
	},
	
	applyRules(sentence) {
		return sentence;
	},
	
	toString(symbols) {
		var sentence = "";
		
		for(var index = 0; index < symbols.length; ++index)
			sentence += symbols[index].print()
		
		return sentence;
	}
}