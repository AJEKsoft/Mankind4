function $ (id) {
    return document.getElementById (id);
}

class Game {
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

	// Set up a simple triangle for testing camera code.
	let vertices = [
	    -1, -1, 0,
	    1, -1, 0,
	    -1, 1, 0
	];

	this.vbo = this.gl.createBuffer ();
	this.gl.bindBuffer (this.gl.ARRAY_BUFFER, this.vbo);
	this.gl.bufferData (this.gl.ARRAY_BUFFER, new Float32Array (vertices), this.gl.STATIC_DRAW);
	
	this.vao = this.gl.createVertexArray ();
	this.gl.bindVertexArray (this.vao);
	this.gl.enableVertexAttribArray (0);
	this.gl.vertexAttribPointer (0, 3, this.gl.FLOAT, false, 0, 0);
	
	// Set up some simple shaders. Should we make the classes take
	// in the reference to GL and store it in themselves?
	// Something to think about.
	this.shader = new Program (this.gl);
	this.shader.add (this.gl.VERTEX_SHADER, $("chunk.vs").text.trim ());
	this.shader.add (this.gl.FRAGMENT_SHADER, $("chunk.fs").text.trim ());
	this.shader.link ();
	this.shader.use ();

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
    }

    render () {
	this.gl.clear (this.gl.COLOR_BUFFER_BIT);
	this.gl.bindVertexArray (this.vao);
	this.gl.drawArrays (this.gl.TRIANGLES, 0, 3);
    }
}

window.onload = function () {
    new Game;
}
