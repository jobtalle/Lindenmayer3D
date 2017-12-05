function RuleHead(string) {
	var index = 0;
	var conditionIndex = string.indexOf(this.SYMBOL_CONDITION);
	var predecessorIndex = string.indexOf(this.SYMBOL_CONTEXT_LEFT);
	var successorIndex = string.indexOf(this.SYMBOL_CONTEXT_RIGHT);
	
	if(conditionIndex != -1) {
		if(predecessorIndex > conditionIndex)
			predecessorIndex = -1;
		
		if(successorIndex > conditionIndex)
			successorIndex = -1;
	}
	
	if(predecessorIndex != -1) {
		this.predecessor = new Symbol(string, index);
		
		index = predecessorIndex + 1;
	}
	else
		this.predecessor = null;
	
	this.symbol = new Symbol(string, index);
	
	if(successorIndex != -1)
		this.successor = new Symbol(string, successorIndex + 1);
	else
		this.successor = null;
	
	if(conditionIndex != -1)
		this.condition = string.substr(conditionIndex + 1);
	else
		this.condition = null;
}

RuleHead.prototype = {
	SYMBOL_CONTEXT_LEFT: "<",
	SYMBOL_CONTEXT_RIGHT: ">",
	SYMBOL_CONDITION: ":"
}

function RuleBody(string) {
	this.body = Lindenmayer.prototype.toSymbols(string);
}

function Rule(string) {
	var source = string.replace(/\s/g, "");
	
	this.head = new RuleHead(source.substring(0, source.lastIndexOf(this.SYMBOL_EQUALS)));
	this.body = new RuleBody(source.substring(source.lastIndexOf(this.SYMBOL_EQUALS) + 1));
	this.keys = this.getKeys();
	this.fCondition = new Function(this.keys, "return " + this.head.condition);
	
	this.addFunctionsToBody();
}

Rule.prototype = {
	SYMBOL_EQUALS: "=",
	
	addFunctionsToBody() {
		for(var symbol = 0; symbol < this.body.body.length; ++symbol)
			this.body.body[symbol].createFunctions(this.keys);
	},
	
	isApplicable(symbol, predecessor, successor) {
		if(!symbol.matches(this.head.symbol))
			return false;
		
		if(this.head.predecessor != null && !this.head.predecessor.matches(predecessor))
			return false;
		
		if(this.head.successor != null && !this.head.successor.matches(successor))
			return false;
		
		this.key = this.setKey(symbol, predecessor, successor);
		
		if(this.head.condition != null)
			return this.fCondition.apply(this, Object.values(this.key));
		else
			return true;
	},
	
	getKeys() {
		var keys = [];
		
		if(this.head.predecessor != null)
			keys = keys.concat(this.head.predecessor.parameters);
		
		keys = keys.concat(this.head.symbol.parameters);
		
		if(this.head.successor != null)
			keys = keys.concat(this.head.successor.parameters);
		
		return keys;
	},
	
	assignVariables(object, key, values) {
		for(var index = 0; index < key.parameters.length; ++index)
			object[key.parameters[index]] = Number(values.parameters[index]);
	},
	
	setKey(symbol, predecessor, successor) {
		this.key = new Object();
		
		this.assignVariables(this.key, this.head.symbol, symbol);
		
		if(this.head.predecessor != null)
			this.assignVariables(this.key, this.head.predecessor, predecessor);
		
		if(this.head.successor != null)
			this.assignVariables(this.key, this.head.successor, successor);
		
		return this.key;
	}
}

function Symbol(string, index=null) {
	if(index != null)
		this.parse(string, index);
	else {
		this.symbol = string;
		this.parameters = [];
	}
}

Symbol.prototype = {
	parse(string, index) {
		var startIndex = index;
		
		this.symbol = string[index];
		
		if(index + 1 < string.length && string[index + 1] == "(") {
			var scope = 1;
			var start = ++index + 1;
			
			while(string[++index])
				if(string[index] == "(")
					++scope;
				else if(string[index] == ")" && --scope == 0)
					break;
			
			this.parameters = string.substr(start, index - start).split(",");
		}
		else
			this.parameters = [];
		
		this.length = index - startIndex;
	},
	
	getVariablesInString(string) {
		var variables = [];
		var matches = string.match(new RegExp(/[a-z_]\w*(?!\w*\s*\()/ig));
		
		if(matches == null)
			return [];
		
		for(var index = 0; index < matches.length; ++index)
			if(variables.indexOf(matches[index]) == -1)
				variables.push(matches[index]);
		
		return variables;
	},
	
	createFunction(parameter) {
		var variables = this.getVariablesInString(parameter);
		var parsed = parameter;
		
		for(var index = 0; index < variables.length; ++index)
			parsed = parsed.replace(variables[index], "+" + variables[index]);
		
		return "return " + parsed;
	},
	
	createFunctions(keys) {
		this.functions = [];
		
		for(var parameter = 0; parameter < this.parameters.length; ++parameter)
			this.functions.push(new Function(keys, this.createFunction(this.parameters[parameter])));
	},
	
	getArity() {
		if(this.parameters == null)
			return 0;
		
		return this.parameters.length;
	},
	
	matches(other) {
		return other != null && this.symbol == other.symbol && this.getArity() == other.getArity();
	},
	
	toString() {
		var str = this.symbol;
		
		if(this.parameters.length != 0) {
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
		var iteration = 0;
		
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
	
	getRules(symbol, predecessor, successor) {
		var rules = [];
		
		for(var rule = 0; rule < this.rules.length; ++rule)
			if(this.rules[rule].isApplicable(symbol, predecessor, successor))
				rules.push(this.rules[rule]);
		
		return rules;
	},
	
	applyRule(rule, symbol, predecessor, successor) {
		var returnSymbols = [];
		
		for(var index = 0; index < rule.body.body.length; ++index) {
			var s = rule.body.body[index];
			var result = new Symbol(s.symbol);
			
			if(s.parameters.length > 0)
				for(var parameter = 0; parameter < s.parameters.length; ++parameter)
					result.parameters.push(s.functions[parameter].apply(this, Object.values(rule.key)));
				
			returnSymbols.push(result);
		}
		
		return returnSymbols;
	},
	
	parseSymbol(predecessor, symbol, successor) {
		var rules = this.getRules(symbol, predecessor, successor);
		
		if(rules.length == 0)
			return [symbol];
		
		return this.applyRule(rules[Math.floor(Math.random() * rules.length)], symbol, predecessor, successor);
	},
	
	applyRules(sentence) {
		var newSentence = [];
		
		for(var symbol = 0; symbol < sentence.length; ++symbol) {
			var predecessor = null;
			var successor = null;
			
			if(symbol > 0)
				predecessor = sentence[symbol - 1];
			
			if(symbol + 1 < sentence.length)
				successor = sentence[symbol + 1];
			
			newSentence = newSentence.concat(this.parseSymbol(predecessor, sentence[symbol], successor));
		}
		
		return newSentence;
	},
	
	toString(symbols) {
		var sentence = "";
		
		for(var index = 0; index < symbols.length; ++index)
			sentence += symbols[index].toString()
		
		return sentence;
	}
}