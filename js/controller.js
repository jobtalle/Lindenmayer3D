function Controller(element) {
	this.renderer = new Renderer(element);
	this.buildSystem();
	
	console.log("Rules:");
	for(var rule = 0; rule < this.system.rules.length; ++rule)
		console.log(this.system.rules[rule]);
	
	console.log("Result:");
	console.log(Lindenmayer.prototype.toString(this.system.process("A(0)", 3)));
}

Controller.prototype = {
	getResult() {
		return document.getElementById("l3d-result");
	},
	
	getAxiom() {
		return document.getElementById("l3d-axiom");
	},
	
	getRule(index) {
		return document.getElementById("l3d-rule" + index);
	},
	
	buildSystem() {
		this.system = new Lindenmayer();
		
		this.addRules(this.system);
	},
	
	addRules(system) {
		var rule;
		var index = 1;
		
		while(rule = this.getRule(index++), rule != null)
			if(rule.value != "")
				system.addRule(rule.value);
	},
	
	clearResult() {
		this.getResult().value = "";
	},
	
	step() {
		if(this.getResult().value == "")
			this.getResult().value = Lindenmayer.prototype.toString(this.system.process(this.getAxiom().value, 1));
		else
			this.getResult().value = Lindenmayer.prototype.toString(this.system.process(this.getResult().value, 1));
	}
}