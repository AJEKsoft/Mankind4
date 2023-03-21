class VertexMesh {
    // Reference to current GL context.
    #gl;
    // Vertex Array Object.
    #vao;
    // A buffer object holding the vertex positions.
    #vbo;
    // An array holding the vertex positions.
    vertices = new Array ();
    
    constructor (gl) {
	this.#gl = gl;
	this.#vao = this.#gl.createVertexArray ();
	this.#vbo = this.#gl.createBuffer ();

	this.#gl.bindBuffer (this.#gl.ARRAY_BUFFER, this.#vbo);
	this.#gl.bindVertexArray (this.#vao);
	this.#gl.enableVertexAttribArray (0);
	this.#gl.vertexAttribPointer (0, 3, this.#gl.FLOAT, false, 0, 0);
    }

    realize () {
	this.#gl.bindBuffer (this.#gl.ARRAY_BUFFER, this.#vbo);
	this.#gl.bufferData (this.#gl.ARRAY_BUFFER, new Float32Array (this.vertices), this.#gl.STATIC_DRAW);
    }

    render () {
	this.#gl.bindVertexArray (this.#vao);
	this.#gl.drawArrays (this.#gl.TRIANGLES, 0, this.vertices.length / 3);
    }
}
