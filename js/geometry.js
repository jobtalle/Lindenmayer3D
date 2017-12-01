function TurtleState(other) {
	if(other == undefined) {
		this.at = new THREE.Vector3(0, 0, 0);
		this.yaw = 0;
		this.roll = 0;
		this.pitch = 0;
	}
	else {
		this.at = other.at.clone();
		this.yaw = other.yaw;
		this.roll = other.roll;
		this.pitch = other.pitch;
	}
}

TurtleState.prototype = {
	AXIS_X: new THREE.Vector3(1, 0, 0),
	AXIS_Y: new THREE.Vector3(0, 1, 0),
	AXIS_Z: new THREE.Vector3(0, 0, 1),
	DEG_TO_RAD: Math.PI / 180,
	
	getDirectionVector() {
		var v = new THREE.Vector3(0, 1, 0);
		
		v.applyAxisAngle(this.AXIS_X, this.pitch * this.DEG_TO_RAD);
		v.applyAxisAngle(this.AXIS_Z, this.yaw * this.DEG_TO_RAD);
		v.applyAxisAngle(this.AXIS_Y, this.roll * this.DEG_TO_RAD);
		
		return v;
	},
	
	extrude() {
		this.at = this.at.add(this.getDirectionVector());
		
		return this.at.clone();
	},
	
	rotateYaw(yaw) {
		this.yaw += Number(yaw);
	},
	
	rotateRoll(roll) {
		this.roll += Number(roll);
	},
	
	rotatePitch(pitch) {
		this.pitch += Number(pitch);
	},
	
	get() {
		return this.at.clone();
	}
}

function Geometry(symbols, constants, angle) {
	this.symbols = symbols;
	this.constants = constants;
	this.angle = angle;
}

Geometry.prototype = {
	get() {
		return this.geometry;
	},
	
	getCenter() {
		return this.center;
	},
	
	getRadius() {
		return this.center.length() * 2;
	},
	
	getBranches() {
		var branches = [];
		var states = [];
		var workingBranches = [[]];
		var state = new TurtleState();
		
		var xMin = 0;
		var xMax = 0;
		var yMin = 0;
		var yMax = 0;
		var zMin = 0;
		var zMax = 0;
		
		workingBranches[workingBranches.length - 1].push(state.get());
		
		for(var index = 0; index < this.symbols.length; ++index) {
			switch(this.symbols[index].symbol) {
				case "[":
					states.push(new TurtleState(state));
					workingBranches.push([state.get()]);
					break;
				case "]":
					state = states.pop();
					branches.push(workingBranches.pop());
					break;
				case "+":
					state.rotateYaw(this.angle);
					break;
				case "-":
					state.rotateYaw(-this.angle);
					break;
				case "/":
					state.rotateRoll(this.angle);
					break;
				case "\\":
					state.rotateRoll(-this.angle);
					break;
				case "^":
					state.rotatePitch(this.angle);
					break;
				case "_":
					state.rotatePitch(-this.angle);
					break;
				default:
					if(this.constants.indexOf(this.symbols[index].symbol) == -1) {
						var pos = state.extrude();
						
						if(pos.x < xMin)
							xMin = pos.x;
						if(pos.x > xMax)
							xMax = pos.x;
						if(pos.y < yMin)
							yMin = pos.y;
						if(pos.y > yMax)
							yMax = pos.y;
						if(pos.z < zMin)
							zMin = pos.z;
						if(pos.z > zMax)
							zMax = pos.z;
						
						workingBranches[workingBranches.length - 1].push(pos);
					}
					break;
			}
		}
		
		branches.push(workingBranches.pop());
		
		this.center = new THREE.Vector3(
			xMin + (xMax - xMin) / 2,
			yMin + (yMax - yMin) / 2,
			zMin + (zMax - zMin) / 2);
		
		return branches;
	},
	
	build() {
		var branches = this.getBranches();
		var scene = new THREE.Scene();
		
		for(var i = 0; i < branches.length; ++i)
			if(branches[i].length > 1)
				scene.add(new THREE.Mesh(new THREE.TubeGeometry(
					new THREE.CatmullRomCurve3(branches[i]),
						branches[i].length * 6,
						0.2,
						5,
						false), new THREE.MeshNormalMaterial()));
					
		return scene;
	}
}