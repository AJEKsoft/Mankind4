class Camera {
    // A reference to the current OpenGL context.
    #gl;
    // The camera's position;
    position = new Vec3;
    // The camera's rotation.
    rotation = new Vec3;
    // The FOV.
    fov = 60;
    // The near plane.
    near = 0.01;
    // The far plane.
    far = 1000.0;
    
    constructor (gl) {
	this.#gl = gl;
    }

    get direction () {
	return new Vec3 (
	    Math.sin (this.rotation.x) * Math.cos (this.rotation.y),
	    Math.sin (this.rotation.y),
	    Math.cos (this.rotation.x) * Math.cos (this.rotation.y)
	).normalized;
    }

    get right () {
	return this.direction.cross (this.up).normalized;
    }

    get up () {
	return new Vec3 (0.0, 1.0, 0.0);
    }

    get view () {
	return Mat4LookAt (this.position, this.position.add (this.direction), this.up);
    }

    get projection () {
	return Mat4Perspective (
	    this.fov, this.#gl.drawingBufferWidth / this.#gl.drawingBufferHeight, this.near, this.far
	);
    }
}
