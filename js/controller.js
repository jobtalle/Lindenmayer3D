function Controller(element) {
	this.renderer = new Renderer(element);
	this.buildSystem();
}

Controller.prototype = {
	buildRuleField(index) {
		var node = document.createElement("tr");
		node.innerHTML = "<td>Rule " + index + ":</td><td><input id=\"l3d-rule" + index + "\" type=\"text\" onchange=\"controller.buildSystem()\"/></td>";
		
		return node;
	},
	
	addRuleField() {
		var index = 0;
		
		while(this.getRule(++index) != null);
		
		var lastRule = document.getElementById("l3d-rule" + (index - 1));
		lastRule.parentNode.parentNode.parentNode.insertBefore(this.buildRuleField(index), document.getElementById("add-rule-button"));
		document.getElementById("result-column").rowSpan = document.getElementById("result-column").rowSpan + 1;
	},
	
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