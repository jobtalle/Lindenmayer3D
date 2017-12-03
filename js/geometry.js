function TurtleState(other) {
	this.rotated = true;
	
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
		this.rotated = true;
	},
	
	rotateRoll(roll) {
		this.roll += Number(roll);
		this.rotated = true;
	},
	
	rotatePitch(pitch) {
		this.pitch += Number(pitch);
		this.rotated = true;
	},
	
	isRotated() {
		return this.rotated;
	},
	
	setNotRotated() {
		this.rotated = false;
	},
	
	get() {
		return this.at.clone();
	}
}

function Scene(scene, content, light) {
	this.scene = scene;
	this.content = content;
	this.light = light;
	
	this.scene.add(this.content);
	this.scene.add(light);
}

Scene.prototype = {
	dispose() {
		this.scene.remove(this.content);
		this.scene.remove(this.light);
		
		this.content.geometry.dispose();
		this.content.material.dispose();
	}
}

function Geometry(symbols, constants, angle) {
	this.symbols = symbols;
	this.constants = constants;
	this.angle = angle;
}

Geometry.prototype = {
	TUBE_PRECISION: 5,
	TUBE_RADIUS: 0.2,
	END_SPHERE: new THREE.SphereGeometry(0.3, 5, 5),
	MATERIAL_TUBE: new THREE.MeshPhongMaterial({
			emissive: new THREE.Color("rgb(153, 204, 0)").multiplyScalar(0.3),
			color: new THREE.Color("rgb(153, 204, 0)"),
			specular: new THREE.Color("rgb(255, 255, 255)").multiplyScalar(0.3),
			shininess: 25
		}),
	MATERIAL_LINE: new THREE.LineBasicMaterial({
		color: 0xffffff,
		linewidth: 1
	}),
	
	get() {
		return this.geometry;
	},
	
	getCenter() {
		return this.center;
	},
	
	getRadius() {
		return this.radius;
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
					state.setNotRotated();
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
						
						if(!state.isRotated())
							workingBranches[workingBranches.length - 1].pop();
						else
							state.setNotRotated();
						
						workingBranches[workingBranches.length - 1].push(pos);
					}
					break;
			}
		}
		
		branches.push(workingBranches.pop());
		
		var xRange = xMax - xMin;
		var yRange = yMax - yMin;
		var zRange = zMax - zMin;
		
		this.center = new THREE.Vector3(
			xMin + xRange / 2,
			yMin + yRange / 2,
			zMin + zRange / 2);
		this.radius = new THREE.Vector3(xRange, yRange, zRange).length() / 2;
		
		return branches;
	},
	
	buildGeometryTubes(branches) {
		var geometry = new THREE.Geometry();
		
		for(var i = 0; i < branches.length; ++i) {
			var tube = new THREE.TubeGeometry(
				new THREE.CatmullRomCurve3(branches[i]),
					branches[i].length * 4,
					this.TUBE_RADIUS,
					this.TUBE_PRECISION,
					false);
					
			if(i == 0)
				geometry.merge(this.END_SPHERE);
					
			geometry.merge(tube);
			tube.dispose();
			
			var canopy = branches[i][branches[i].length - 1];
			var canopyMatrix = new THREE.Matrix4().makeTranslation(canopy.x, canopy.y, canopy.z);
			
			geometry.merge(this.END_SPHERE, canopyMatrix);
		}
		
		return new THREE.Mesh(geometry, this.MATERIAL_TUBE);
	},
	
	buildGeometryLines(branches) {
		var geometry = new THREE.Geometry();
		
		for(var i = 0; i < branches.length; ++i) {
			var branch = branches[i];
		
			for(var j = 0; j < branch.length - 1; ++j) {
				geometry.vertices.push(branch[j]);
				geometry.vertices.push(branch[j + 1]);
			}
		}
		
		return new THREE.LineSegments(geometry, this.MATERIAL_LINE);
	},
	
	build(scene, light, renderStyle) {
		var branches = this.getBranches();
		var content;
			
		switch(renderStyle) {
			default:
			case "lines":
				content = this.buildGeometryLines(branches);
				break;
			case "tubes":
				content = this.buildGeometryTubes(branches);
				break;
		}
			
		return new Scene(scene, content, light);
	}
}