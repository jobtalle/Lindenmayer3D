function Controller(element) {
	this.renderer = new Renderer(element);
	
	var system = new Lindenmayer();
	
	system.addRule("A(x) : x < 2 = A(x + 1)");
	
	console.log("Rules:");
	for(var rule = 0; rule < system.rules.length; ++rule)
		console.log(system.rules[rule]);
	
	console.log("Result:");
	console.log(Lindenmayer.prototype.toString(system.process("A(0)", 5)));
}