function Geometry(symbols, constants) {
	this.symbols = symbols;
	this.constants = constants;
}

Geometry.prototype = {
	get() {
		return this.geometry;
	},
	
	getCenter() {
		return this.center;
	},
	
	getBranches() {
		var branches = [[]];
		var scope = 0;
		var at = new THREE.Vector3(0, 0, 0);
		var direction = new THREE.Vector3(0, 1, 0);
		
		branches[scope].push(at);
		branches[scope].push(direction);
		
		for(var index = 0; index < this.symbols.length; ++index) {
			switch(this.symbols[index].symbol) {
				case "[":
					
					break;
				case "]":
					
					break;
				case "+": // Yaw right
					
					break;
				case "-": // Yaw left
				
					break;
				case "/": // Roll right
					
					break;
				case "\\": // Roll left
				
					break;
				case "^": // Pitch up
					
					break;
				case "_": // Pitch down
					
					break;
				default:
					
					break;
			}
		}
		
		return branches;
	},
	
	build() {
		var branches = this.getBranches();
		
		for(var i = 0; i < branches.length; ++i)
			this.geometry = new THREE.TubeGeometry(
				new THREE.CatmullRomCurve3(branches[i]),
				50,
				0.2,
				16,
				false);
				
		this.center = new THREE.Vector3(0, 0.5, 0);
	}
}