function preset() {
	var name = document.getElementById("l3d-preset").value;
	
	switch(name) {
		case "hilbert-curve":
			setPreset(
				"A",
				"90",
				"A",
				[
					"A = ^\\AB^\\ABA-B^//ABA_B+//ABA-B/A-/"
				],
				"3",
				"tubes");
			break;
		case "plant":
			setPreset(
				"A",
				"30",
				"",
				[
					"A = B[+A][-A][_A][^A]BA",
					"B = B\B",
					"B = A/B"
				],
				"4",
				"plant");
			break;
		case "tree":
			setPreset(
				"BBBBBA",
				"19",
				"",
				[
					"A = [++BBA]/////+BBBA/////",
					"B = \\\\B",
					"B = ////B"
				],
				"5",
				"plant");
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