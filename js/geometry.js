function Geometry(symbols, constants) {
	this.geometry = new THREE.Geometry();
	this.symbols = symbols;
	this.constants = constants;
}

Geometry.prototype = {
	get() {
		return this.geometry;
	},
	
	build() {
		this.geometry.vertices.push(new THREE.Vector3(0, 0, 0));
		this.geometry.vertices.push(new THREE.Vector3(1, 0, 0));
		this.geometry.vertices.push(new THREE.Vector3(0, 1, 0));
		this.geometry.vertices.push(new THREE.Vector3(1, 1, 1));
		
		this.geometry.faces.push(new THREE.Face3(0, 1, 2));
		this.geometry.faces.push(new THREE.Face3(2, 1, 3));
		
		this.geometry.computeFaceNormals();
	}
}