function preset() {
	var name = document.getElementById("l3d-preset").value;
	
	switch(name) {
		case "plant":
			setPreset(
				"A",
				"30",
				"",
				[
					"A = B[+A][-A][_A][^A]BA",
					"B = BB"
				],
				"3",
				"tubes");
			break;
		case "gosper-curve":
			
			break;
	}
}

function setPreset(axiom, angle, constants, rules, iterations, renderStyle) {
	controller.getAxiom().value = axiom;
	controller.getAngle().value = angle;
	controller.getConstants().value = constants;
	
	var i = 0;
	while(controller.getRule(++i) != undefined)
		if(i <= rules.length)
			controller.getRule(i).value = rules[i - 1];
		else
			controller.getRule(i).value = "";
	
	controller.getIterations().value = iterations;
	controller.getRenderStyle().value = renderStyle;
	
	controller.changeSystem();
}