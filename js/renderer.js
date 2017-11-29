function Renderer(element) {
	this.width = element.offsetWidth;
	this.height = element.offsetHeight;
	
	this.initializeCamera();
	this.initializeRenderer(element);
	this.initializeScene();
}

Renderer.prototype = {
	CAMERA_ANGLE: 70,
	ZNEAR: 0.1,
	ZFAR: 100,
	
	getGeometry(symbols, constants) {
		var geometry = new THREE.Geometry();
		
		geometry.vertices.push(new THREE.Vector3(0, 0, 0));
		geometry.vertices.push(new THREE.Vector3(1, 0, 0));
		geometry.vertices.push(new THREE.Vector3(0, 1, 0));
		geometry.vertices.push(new THREE.Vector3(1, 1, 1));
		
		geometry.faces.push(new THREE.Face3(0, 1, 2));
		geometry.faces.push(new THREE.Face3(2, 1, 3));
		
		geometry.computeFaceNormals();
		
		return geometry;
	},
	
	getMesh(symbols, constants) {
		return new THREE.Mesh(this.getGeometry(symbols, constants), new THREE.MeshNormalMaterial());
	},
	
	initializeCamera() {
		this.camera = new THREE.PerspectiveCamera(
			this.CAMERA_ANGLE,
			this.width / this.height,
			this.ZNEAR,
			this.ZFAR);
		this.camera.position.z = 1;
	},
	
	initializeRenderer(element) {
		this.renderer = new THREE.WebGLRenderer({antialias: true});
		this.renderer.setSize(this.width, this.height);
		
		element.appendChild(this.renderer.domElement);
	},
	
	initializeScene(symbols, constants) {
		this.scene = new THREE.Scene();
		this.scene.add(this.getMesh(symbols, constants));
	},
	
	render(symbols, constants) {
		this.initializeScene(symbols, constants);
		this.renderer.render(this.scene, this.camera);
	}
}