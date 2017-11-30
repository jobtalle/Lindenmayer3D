function Renderer(element) {
	this.width = element.offsetWidth;
	this.height = element.offsetHeight;
	this.scene = null;
	
	this.initializeCamera();
	this.initializeView();
	this.initializeRenderer(element);
}

Renderer.prototype = {
	CAMERA_SPEED: 0.01,
	CAMERA_ANGLE: 70,
	CAMERA_PITCH_MIN: 0.0001,
	CAMERA_PITCH_MAX: Math.PI - 0.0001,
	ZNEAR: 0.1,
	ZFAR: 10000,
	
	getScene(symbols, constants, angle) {
		var geometry = new Geometry(symbols, constants, angle);
		
		var scene = geometry.build();
		this.camera.center = geometry.getCenter();
		this.cameraZoom = geometry.getRadius();
		
		return scene;
	},
	
	initializeCamera() {
		this.camera = new THREE.PerspectiveCamera(
			this.CAMERA_ANGLE,
			this.width / this.height,
			this.ZNEAR,
			this.ZFAR);
	},
	
	initializeView() {
		this.cameraRotation = Math.PI / 4;
		this.cameraPitch = Math.PI / 4;
		this.cameraZoom = 5;
		this.camera.center = null;
	},
	
	placeCamera() {
		if(this.camera.center == null)
			return;
		
		this.camera.position.x = this.camera.center.x + Math.cos(this.cameraRotation) * this.cameraZoom * Math.sin(this.cameraPitch);
		this.camera.position.z = this.camera.center.z + Math.sin(this.cameraRotation) * this.cameraZoom * Math.sin(this.cameraPitch);
		this.camera.position.y = this.camera.center.y + Math.cos(this.cameraPitch) * this.cameraZoom;
		
		this.camera.lookAt(this.camera.center.x, this.camera.center.y, this.camera.center.z);
	},
	
	initializeRenderer(element) {
		this.renderer = new THREE.WebGLRenderer({antialias: true});
		this.renderer.setSize(this.width, this.height);
		
		element.appendChild(this.renderer.domElement);
	},
	
	moveView(x, y) {
		if(this.scene == null)
			return;
		
		this.cameraRotation += x * this.CAMERA_SPEED;
		this.cameraPitch -= y * this.CAMERA_SPEED;
		
		if(this.cameraPitch < this.CAMERA_PITCH_MIN)
			this.cameraPitch = this.CAMERA_PITCH_MIN;
		else if(this.cameraPitch > this.CAMERA_PITCH_MAX)
			this.cameraPitch = this.CAMERA_PITCH_MAX;
		
		this.paint();
	},
	
	render(symbols, constants, angle) {
		this.scene = this.getScene(symbols, constants, angle);
		this.paint();
	},
	
	paint() {
		this.placeCamera();
		this.renderer.render(this.scene, this.camera);
	}
}