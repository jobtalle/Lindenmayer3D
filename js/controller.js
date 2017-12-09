function Controller(element) {
	this.upToDate = true;
	
	this.message = new Message();
	this.renderer = new Renderer(element);
	this.addListeners(element);
	this.changeSystem();
}

Controller.prototype = {
	buildRuleField(index) {
		var node = document.createElement("tr");
		node.innerHTML = "<td>Rule " + index + ":</td><td><input id=\"l3d-rule" + index + "\" type=\"text\" onchange=\"controller.changeSystem()\"/></td>";
		
		return node;
	},
	
	addRuleField() {
		var index = 0;
		while(this.getRule(++index) != null);
		
		var lastRule = document.getElementById("l3d-rule" + (index - 1));
		lastRule.parentNode.parentNode.parentNode.insertBefore(this.buildRuleField(index), document.getElementById("add-rule-button"));
		document.getElementById("result-column").rowSpan = document.getElementById("result-column").rowSpan + 1;
	},
	
	addListeners(element) {
		this.rendererRect = element.getBoundingClientRect();
		
		element.addEventListener("mousedown", this.mouseDown.bind(this));
		element.addEventListener("touchstart", this.touchDown.bind(this));
		element.addEventListener("mousemove", this.mouseMove.bind(this));
		element.addEventListener("touchmove", this.touchMove.bind(this));
		element.addEventListener("mouseup", this.mouseUp.bind(this));
		element.addEventListener("touchend", this.mouseUp.bind(this));
		element.addEventListener("mouseleave", this.mouseUp.bind(this));
		element.addEventListener("wheel", this.mouseScroll.bind(this));
	},
	
	mouseScroll(event) {
		event.preventDefault();
		
		if(event.deltaY < 0)
			this.renderer.zoomIn();
		else
			this.renderer.zoomOut();
	},
	
	touchDown(event) {
		this.dragStart(event.touches[0].clientX - this.rendererRect.left, event.touches[0].clientY - this.rendererRect.top);
	},
	
	touchMove(event) {
		console.log(event);
		this.drag(event.touches[0].clientX - this.rendererRect.left, event.touches[0].clientY - this.rendererRect.top);
	},
	
	mouseDown(event) {
		this.dragStart(event.x - this.rendererRect.left, event.y - this.rendererRect.top)
	},
	
	mouseMove(event) {
		this.drag(event.x - this.rendererRect.left, event.y - this.rendererRect.top)
	},
	
	mouseUp(event) {
		this.dragStop();
	},
	
	dragStart(x, y) {
		this.dragging = true;
		this.dragX = x;
		this.dragY = y;
	},
	
	drag(x, y) {
		if(this.dragging) {
			var deltaX = x - this.dragX;
			var deltaY = y - this.dragY;
			
			this.dragX = x;
			this.dragY = y;
			
			this.renderer.moveView(deltaX, deltaY);
		}
	},
	
	dragStop() {
		this.dragging = false;
	},
	
	getResult() {
		return document.getElementById("l3d-result");
	},
	
	getAxiom() {
		return document.getElementById("l3d-axiom");
	},
	
	getIterations() {
		return document.getElementById("l3d-iterations");
	},
	
	getConstants() {
		return document.getElementById("l3d-constants");
	},
	
	getRule(index) {
		return document.getElementById("l3d-rule" + index);
	},
	
	getAngle() {
		return document.getElementById("l3d-angle");
	},
	
	getRenderStyle() {
		return document.getElementById("l3d-render-style");
	},
	
	changeSystem() {
		this.upToDate = false;
	},
	
	buildSystem() {
		this.system = new Lindenmayer();
		
		this.addRules(this.system);
		
		this.upToDate = true;
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
		
		this.renderer.createScene([], this.getConstants().value, this.getAngle().value, this.getRenderStyle().value);
	},
	
	setResult(result) {
		this.getResult().value = Lindenmayer.prototype.toString(result);
		
		this.renderer.createScene(result, this.getConstants().value, this.getAngle().value, this.getRenderStyle().value);
	},
	
	step() {
		var startTime = new Date();
		
		if(!this.upToDate)
			this.buildSystem();
		
		if(this.getResult().value == "")
			var result = this.system.process(this.getAxiom().value, 1);
		else
			var result = this.system.process(this.getResult().value, 1);
		
		this.setResult(result);
		++this.getIterations().value;
		
		if(result.length == 0)
			this.message.setText("Timeout exceeded, try less iterations", "#ff0000");
		else
			this.message.setText("Generated one iteration in " + (new Date() - startTime) + "ms");
	},
	
	go() {
		var startTime = new Date();
		
		if(!this.upToDate)
			this.buildSystem();
		
		var result = this.system.process(this.getAxiom().value, this.getIterations().value);
		this.setResult(result);
		
		if(result.length == 0)
			this.message.setText("Timeout exceeded, try less iterations", "#ff0000");
		else
			this.message.setText("Generated " + this.getIterations().value + " iterations in " + (new Date() - startTime) + "ms");
	}
}