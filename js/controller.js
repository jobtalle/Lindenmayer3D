function Controller(element) {
	this.renderer = new Renderer(element);
	
	var system = new Lindenmayer();
	
	system.addRule("A(age) : age < 2 = A(age + 2 * age)A(0)");
	
	console.log("Rules:");
	for(var rule = 0; rule < system.rules.length; ++rule)
		console.log(system.rules[rule]);
	
	console.log("Result:");
	console.log(Lindenmayer.prototype.toString(system.process("A(1)", 3)));
}