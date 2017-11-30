function Geometry(symbols, constants, angle) {
	this.symbols = symbols;
	this.constants = constants;
	this.angle = angle;
}

Geometry.prototype = {
	AXIS_X: new THREE.Vector3(1, 0, 0),
	AXIS_Y: new THREE.Vector3(0, 1, 0),
	AXIS_Z: new THREE.Vector3(0, 0, 1),
	DEG_TO_RAD: Math.PI / 180,
	
	get() {
		return this.geometry;
	},
	
	getCenter() {
		return this.center;
	},
	
	getDirectionVector(yaw, roll, pitch) {
		var v = new THREE.Vector3(0, 1, 0);
		
		v.applyAxisAngle(this.AXIS_X, pitch * this.DEG_TO_RAD);
		v.applyAxisAngle(this.AXIS_Z, yaw * this.DEG_TO_RAD);
		v.applyAxisAngle(this.AXIS_Y, roll * this.DEG_TO_RAD);
		
		return v;
	},
	
	getBranches() {
		var branches = [];
		var workingBranches = [[]];
		
		var at = new THREE.Vector3(0, 0, 0);
		var yaw = 0;
		var roll = 0;
		var pitch = 0;
		
		workingBranches[workingBranches.length - 1].push(at.clone());
		
		for(var index = 0; index < this.symbols.length; ++index) {
			switch(this.symbols[index].symbol) {
				case "[":
					workingBranches.push([]);
					break;
				case "]":
					branches.push(workingBranches.pop());
					break;
				case "+": // Yaw right
					yaw += Number(this.angle);
					break;
				case "-": // Yaw left
					yaw -= Number(this.angle);
					break;
				case "/": // Roll right
					roll += Number(this.angle);
					break;
				case "\\": // Roll left
					roll -= Number(this.angle);
					break;
				case "^": // Pitch up
					pitch += Number(this.angle);
					break;
				case "_": // Pitch down
					pitch -= Number(this.angle);
					break;
				default:
					if(this.constants.indexOf(this.symbols[index].symbol) == -1) {
						at = at.add(this.getDirectionVector(yaw, roll, pitch));
						
						workingBranches[workingBranches.length - 1].push(at.clone());
					}
					break;
			}
		}
		
		branches.push(workingBranches.pop());
		
		console.log(branches);
		return branches;
	},
	
	build() {
		var branches = this.getBranches();
		
		for(var i = 0; i < branches.length; ++i)
			this.geometry = new THREE.TubeGeometry(
				new THREE.CatmullRomCurve3(branches[i]),
				branches[i].length * 6,
				0.1,
				5,
				false);
				
		this.center = new THREE.Vector3(0, 0.5, 0);
	}
}