function preset() {
	var name = document.getElementById("l3d-preset").value;
	
	switch(name) {
		case "spiral":
			setPreset(
				"BA(0, 0)",
				"90",
				"A",
				[
					"A(x, y) : x < y = BA(x + 1, y)",
					"A(x, y) : x >= y = +BA(0, y + 1)"
				],
				"117",
				"cubes");
			break;
		case "hilbert-curve":
			setPreset(
				"A",
				"90",
				"A",
				[
					"A = ^\\AB^\\ABA-B^//ABA_B+//ABA-B/A-/"
				],
				"3",
				"lines");
			break;
		case "plant":
			setPreset(
				"A",
				"30",
				"",
				[
					"A = B[+A]\\\\\\\\[+A]\\\\\\\\[+A]\\\\\\\\BA",
					"B = B\B",
					"B = A/B"
				],
				"4",
				"plant");
			break;
		case "tree":
			setPreset(
				"BBBBBA",
				"18",
				"",
				[
					"A = [++BB[--C][++C][__C][^^C]A]/////+BBB[--C][++C][__C][^^C]A",
					"B = \\\\B",
					"B = B",
					"C ="
				],
				"5",
				"plant");
			break;
		case "spring":
			setPreset(
				"A",
				"12",
				"",
				[
					"A = A-^A"
				],
				"8",
				"tubes");
			break;
		case "fern":
			setPreset(
				"EEEA",
				"4",
				"",
				[
					"A = [++++++++++++++EC]B\^+B[--------------ED]B+BA",
					"C =[---------EE][+++++++++EE]B__+C",
					"D = [---------EE][+++++++++EE]B__-D"
				],
				"12",
				"lines");
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