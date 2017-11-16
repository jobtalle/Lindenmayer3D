function Controller(element) {
	this.renderer = new Renderer(element);
	
	var system = new Lindenmayer();
	
	system.addRule("A(x) = A(x + 1)");
	console.log(system.process("A(0)B(3, 4, 5)A", 1));
}