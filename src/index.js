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

	this.mesh = new VertexMesh (this.gl);
	this.mesh.vertices = [
	    -1, -1, 0,
	    1, -1, 0,
	    -1, 1, 0
	]
	this.mesh.realize ();
	
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
	$("fps").innerText = (1 / (this.deltaTime * 0.001)).toFixed (1);

	this.shader.setMat4 (
	    "view", this.camera.view
	);
    }

    render () {
	this.gl.clear (this.gl.COLOR_BUFFER_BIT);
	this.mesh.render ();
    }
}

window.onload = function () {
    new Game;
}
