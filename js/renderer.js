function Renderer(element) {
	this.width = element.offsetWidth;
	this.height = element.offsetHeight;
	this.scene = null;
	
	this.initializeCamera();
	this.initializeView();
	this.initializeLight();
	this.initializeRenderer(element);
}

Renderer.prototype = {
	CAMERA_SPEED: 0.01,
	CAMERA_ANGLE: 70,
	CAMERA_PITCH_MIN: 0.0001,
	CAMERA_PITCH_MAX: Math.PI - 0.0001,
	CAMERA_ZOOM_SPEED: 0.2,
	CAMERA_ZOOM_MIN: 0.1,
	CAMERA_ZOOM_MAX: 6,
	CAMERA_ZOOM_INITIAL: 1.7,
	CAMERA_ROTATION_INITIAL: Math.PI / 4,
	CAMERA_PITCH_INITIAL: Math.PI / 4,
	LIGHT_ANGLE_OFFSET: Math.PI / 4,
	LIGHT_ANGLE_PITCH: Math.PI / 4,
	LIGHT_COLOR: new THREE.Color("rgb(237, 236, 201)"),
	ZNEAR: 0.1,
	ZFAR: 10000,
	
	initializeCamera() {
		this.camera = new THREE.PerspectiveCamera(
			this.CAMERA_ANGLE,
			this.width / this.height,
			this.ZNEAR,
			this.ZFAR);
	},
	
	initializeView() {
		this.cameraRotation = this.CAMERA_ROTATION_INITIAL;
		this.cameraPitch = this.CAMERA_PITCH_INITIAL;
		this.cameraZoom = this.CAMERA_ZOOM_INITIAL;
		this.camera.center = null;
	},
	
	initializeLight() {
		this.light = new THREE.DirectionalLight(this.LIGHT_COLOR);
	},
	
	initializeRenderer(element) {
		this.renderer = new THREE.WebGLRenderer({
			antialias: true,
			alpha: true
		});
		this.threeScene = new THREE.Scene();
		this.renderer.setSize(this.width, this.height);
		
		element.appendChild(this.renderer.domElement);
	},
	
	placeCamera() {
		if(this.camera.center == null)
			return;
		
		this.camera.position.x = this.camera.center.x + Math.cos(this.cameraRotation) * this.cameraRadius * this.cameraZoom * Math.sin(this.cameraPitch);
		this.camera.position.z = this.camera.center.z + Math.sin(this.cameraRotation) * this.cameraRadius * this.cameraZoom * Math.sin(this.cameraPitch);
		this.camera.position.y = this.camera.center.y + Math.cos(this.cameraPitch) * this.cameraRadius * this.cameraZoom;
		this.camera.lookAt(this.camera.center.x, this.camera.center.y, this.camera.center.z);
		
		this.light.position.set(
			Math.cos(this.cameraRotation + this.LIGHT_ANGLE_OFFSET) * Math.sin(this.LIGHT_ANGLE_PITCH),
			Math.cos(this.LIGHT_ANGLE_PITCH),
			Math.sin(this.cameraRotation + this.LIGHT_ANGLE_OFFSET) * Math.sin(this.LIGHT_ANGLE_PITCH));
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
		
		this.placeCamera();
		this.paint();
	},
	
	zoomIn() {
		this.cameraZoom *= 1 - this.CAMERA_ZOOM_SPEED;
		
		if(this.cameraZoom < this.CAMERA_ZOOM_MIN)
			this.cameraZoom = this.CAMERA_ZOOM_MIN;
		
		this.placeCamera();
		this.paint();
	},
	
	zoomOut() {
		this.cameraZoom *= 1 + this.CAMERA_ZOOM_SPEED;
		
		if(this.cameraZoom > this.CAMERA_ZOOM_MAX)
			this.cameraZoom = this.CAMERA_ZOOM_MAX;
		
		this.placeCamera();
		this.paint();
	},
	
	createScene(symbols, constants, angle, renderStyle) {
		if(this.scene != null)
			this.scene.dispose();
			
		var geometry = new Geometry(symbols, constants, angle);
		
		this.scene = geometry.build(this.threeScene, this.light, renderStyle);
		this.camera.center = geometry.getCenter();
		this.cameraRadius = geometry.getRadius();
		
		this.placeCamera();
		this.paint();
	},
	
	paint() {
		if(this.scene != null)
			this.renderer.render(this.threeScene, this.camera);
	}
}