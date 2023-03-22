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

class ChunkMesh {
    // Reference to current GL context.
    #gl;
    // Vertex Array Object.
    #vao;
    // A buffer holding the vertices of a single quad.
    #qvbo;
    // Same, but indices.
    #qebo;			// nafide
    // Per-voxel information: the color of the voxel.
    colors;
    
    constructor (gl) {
	this.#gl = gl;
	this.#vao = this.#gl.createVertexArray ();
	this.#qvbo = this.#gl.createBuffer ();
	this.#qebo = this.#gl.createBuffer ();

	this.#gl.bindVertexArray (this.#vao);
	// Generate the quad buffer — this is the "voxel". First, we
	// start with the vertices.
	this.#gl.bindBuffer (this.#gl.ARRAY_BUFFER, this.#qvbo);
	this.#gl.bufferData (this.#gl.ARRAY_BUFFER, new Int8Array ([
	    -1, -1,  -1, 1,  1, 1,  1, -1
	]), this.#gl.STATIC_DRAW);
	this.#gl.enableVertexAttribArray (0); // Quad vertex position. Instance this.
	this.#gl.vertexAttribIPointer (0, 2, this.#gl.BYTE, false, 0, 0);
	this.#gl.vertexAttribDivisor (0, 0);

	// Now, the indices.
	this.#gl.bindBuffer (this.#gl.ELEMENT_ARRAY_BUFFER, this.#qebo);
	this.#gl.bufferData (this.#gl.ELEMENT_ARRAY_BUFFER, new Uint8Array ([
	    0, 1, 2,  0, 2, 3
	]), this.#gl.STATIC_DRAW);
    }

    render () {
	this.#gl.bindVertexArray (this.#vao);
	this.#gl.drawElementsInstanced (this.#gl.TRIANGLES, 6, this.#gl.UNSIGNED_BYTE, 0, 128*128*128);
    }
}
