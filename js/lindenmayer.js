function Rule(string) {
	var source = string.replace(/\s/g, "");
	var lhs = source.substring(0, source.lastIndexOf("="));
	var rhs = source.substring(source.lastIndexOf("=") + 1);
	
	console.log(lhs);
	console.log(rhs);
}

function Symbol(symbol, parameters) {
	this.symbol = symbol;
	this.parameters = parameters;
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
		axiom = axiom.replace(/\s/g, "");
		
		if(iterations > this.MAX_ITERATIONS)
			iterations = this.MAX_ITERATIONS;
		
		for(var iteration = 0; iteration < iterations; ++iteration)
			axiom = this.applyRules(axiom);
		
		return axiom;
	},
	
	applyRules(sentence) {
		var symbols = [];
		
		for(var index = 0; index < sentence.length; ++index) {
			var symbol = sentence[index];
			var parameters = null;
			
			if(index + 1 < sentence.length && sentence[index + 1] == "(") {
				var start = ++index + 1;
				while(sentence[++index] != ")");
				
				parameters = sentence.substr(start, index - start).split(",");
			}
			
			symbols.push(new Symbol(symbol, parameters));
		}
		
		return this.compileSentence(symbols);
	},
	
	compileSentence(symbols) {
		var sentence = "";
		
		for(var index = 0; index < symbols.length; ++index) {
			var symbol = symbols[index];
			
			sentence += symbol.symbol;
			
			if(symbol.parameters != null) {
				sentence += "(";
				
				for(var parameter = 0; parameter < symbol.parameters.length; ++parameter) {
					sentence += symbol.parameters[parameter];
					
					if(parameter != symbol.parameters.length - 1)
						sentence += ",";
				}
				
				sentence += ")";
			}
		}
		
		return sentence;
	}
}