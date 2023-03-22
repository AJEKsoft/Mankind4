function $ (id) {
    return document.getElementById (id);
}

class Game {
    // The canvas element in the HTML.
    canvas;
    // Current OpenGL context.
    gl;
    // The timestamp of the last frame.
    lastTime;
    // How much time has passed between the last frame and the current one.
    deltaTime;
    // Identificator of the animation frame request.
    request;
    
    constructor () {
	this.canvas = $("gl-canvas");
	this.gl = this.canvas.getContext ("webgl2");

	if (!this.gl) {
	    alert ("Mankind requires WebGL2 to function.");
	}

	this.canvas.width = window.innerWidth;
	this.canvas.height = window.innerHeight;
	this.gl.viewport (0, 0, this.gl.drawingBufferWidth, this.gl.drawingBufferHeight);
	this.gl.clearColor (0.3, 0.1, 0.5, 1.0);

	this.camera = new Camera (this.gl);
	this.camera.position.z = -5.0;

	this.chunkmesh = new ChunkMesh (this.gl);
	
	// Question is, is passing a reference to the GL context a
	// smart idea? Shouldn't some messaging system do that?
	this.shader = new Program (this.gl);
	this.shader.add (this.gl.VERTEX_SHADER, $("chunk.vs").text.trim ());
	this.shader.add (this.gl.FRAGMENT_SHADER, $("chunk.fs").text.trim ());
	this.shader.link ();
	this.shader.use ();

	this.shader.setMat4 (
	    "projection", this.camera.projection
	);

	// Some basic input.
	this.canvas.addEventListener ("click", this.onclick.bind (this), true);
	this.canvas.addEventListener ("mousemove", this.onmousemove.bind (this), true);
	
	window.addEventListener ("keyup", this.onkeyup.bind (this), true);
	window.addEventListener ("keydown", this.onkeydown.bind (this), true);

	// Copied from MankindJS.
	this.wpressed = false;
	this.spressed = false;
	this.apressed = false;
	this.dpressed = false; 	// :-(
	
	this.lastTime = 0;
	this.deltaTime = 0;
	this.request = window.requestAnimationFrame (this.loop.bind (this));
    }

    loop (timestamp) {
	this.update (timestamp);
	this.render ();
	this.request = window.requestAnimationFrame (this.loop.bind (this));
    }

    update (timestamp) {
	this.deltaTime = (timestamp - this.lastTime);
	this.lastTime = timestamp;
	// $("fps").innerText = (1 / (this.deltaTime * 0.001)).toFixed (1);

	this.shader.setMat4 (
	    "view", this.camera.view
	);

	if (this.wpressed) {
	    this.camera.position = this.camera.position.add (
		this.camera.direction.multiply (new Vec3 (this.deltaTime / 100))
	    );
	} else if (this.spressed) {
	    this.camera.position = this.camera.position.subtract (
		this.camera.direction.multiply (new Vec3 (this.deltaTime / 100))
	    );	    
	}

	if (this.dpressed) {
	    this.camera.position = this.camera.position.add (
		this.camera.right.multiply (new Vec3 (this.deltaTime / 100))
	    );	    
	} else if (this.apressed) {
	    this.camera.position = this.camera.position.subtract (
		this.camera.right.multiply (new Vec3 (this.deltaTime / 100))
	    );	    	    
	}
    }

    render () {
	this.gl.clear (this.gl.COLOR_BUFFER_BIT);
	this.chunkmesh.render ();
    }

    onclick (event) {
	this.canvas.requestPointerLock ();
    }

    onmousemove (event) {
	let x = event.movementX;
	let y = event.movementY;

	this.camera.rotation.x -= x * (this.deltaTime / 10000);
	this.camera.rotation.y -= y * (this.deltaTime / 10000);
    }

    onkeyup (event) {
	switch (event.keyCode) {
	case 87:
	    this.wpressed = false;
	    break;
	case 83:
	    this.spressed = false;
	    break;
	case 65:
	    this.apressed = false;
	    break;
	case 68:
	    this.dpressed = false;
	    break;
	}
    }

    onkeydown (event) {
	switch (event.keyCode) {
	    case 87:
	    this.wpressed = true;
	    break;
	    case 83:
	    this.spressed = true;
	    break;
	    case 65:
	    this.apressed = true;
	    break;
	    case 68:
	    this.dpressed = true;
	    break;
	}
    }
}

let game;

window.onload = function () {
    game = new Game;
}
