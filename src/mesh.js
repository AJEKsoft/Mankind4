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

const CHUNK_DIM = 32;
const CHUNK_SIZE = CHUNK_DIM * CHUNK_DIM * CHUNK_DIM;

class ChunkMesh {
    // Reference to current GL context.
    #gl;
    // Vertex Array Object.
    #vao;
    // A buffer holding the vertices of a single quad.
    #qvbo;
    // Same, but indices.
    #qebo;			// nafide
    // A buffer holding the colors, per-voxel.
    #vcbo;
    // A buffer holding extra information, per-voxel.
    #vebo;
    
    constructor (gl) {
	this.#gl = gl;
	this.#vao = this.#gl.createVertexArray ();
	this.#qvbo = this.#gl.createBuffer ();
	this.#qebo = this.#gl.createBuffer ();
	this.#vcbo = this.#gl.createBuffer ();
	this.#vebo = this.#gl.createBuffer ();

	this.#gl.bindVertexArray (this.#vao);
	// Generate the quad buffer — this is the "voxel". First, we
	// start with the vertices.
	this.#gl.bindBuffer (this.#gl.ARRAY_BUFFER, this.#qvbo);
	this.#gl.bufferData (this.#gl.ARRAY_BUFFER, new Int8Array ([
	    -1, -1,  -1, 1,  1, 1,  1, -1
	]), this.#gl.STATIC_DRAW);
	// The vertex positions of a single quad — every instance
	// shares this.
	this.#gl.enableVertexAttribArray (0);
	this.#gl.vertexAttribIPointer (0, 2, this.#gl.BYTE, false, 0, 0);
	this.#gl.vertexAttribDivisor (0, 0);

	// Now, the indices.
	this.#gl.bindBuffer (this.#gl.ELEMENT_ARRAY_BUFFER, this.#qebo);
	this.#gl.bufferData (this.#gl.ELEMENT_ARRAY_BUFFER, new Uint8Array ([
	    0, 1, 2,  0, 2, 3
	]), this.#gl.STATIC_DRAW);
    }

    generate (chunk) {
	// Based on the chunk given, we generate all the buffers.

	// First, we generate the colors.
	let colors = new Uint8Array (chunk.size);
	for (let i = 0; i < chunk.size; ++i) {
	    let color = chunk.voxels[i].color;
	    let r = Math.floor (color.x * 7);
	    let g = Math.floor (color.y * 7);
	    let b = Math.floor (color.z * 3);
	    // The red and green store 8 color values, while the blue
	    // color stores 4. I think image sensors in cameras do
	    // something similar.
	    colors[i] |= b << 6;
	    colors[i] |= g << 3;
	    colors[i] |= r;
	}

	// And we calculate the "extra" attributes.
	let extra = new Uint8Array (chunk.size);
	for (let i = 0; i < chunk.size; ++i) {
	    let active = chunk.voxels[i].active ? 1 : 0;
	    // Here, we convert the light value of the voxels, which
	    // is a normalized float, to a byte value.
	    let light = Math.floor (chunk.voxels[i].light * 127);
	    // Now, we pack both those values into one byte. How? Here's how...
	    extra[i] |= light << 1;
	    extra[i] |= active;
	}

	console.log (extra);
	
	// Generate the color buffer.
	this.#gl.bindBuffer (this.#gl.ARRAY_BUFFER, this.#vcbo);
	this.#gl.bufferData (this.#gl.ARRAY_BUFFER, new Uint8Array (colors), this.#gl.STATIC_DRAW);
	// The color of a voxel. Per instance.
	this.#gl.enableVertexAttribArray (1);
	this.#gl.vertexAttribIPointer (1, 1, this.#gl.UNSIGNED_BYTE, false, 0, 0);
	this.#gl.vertexAttribDivisor (1, 1);

	// Generate the extra information buffer.
	this.#gl.bindBuffer (this.#gl.ARRAY_BUFFER, this.#vebo);
	this.#gl.bufferData (this.#gl.ARRAY_BUFFER, new Uint8Array (extra), this.#gl.STATIC_DRAW);
	// Per-instance.
	this.#gl.enableVertexAttribArray (2);
	this.#gl.vertexAttribIPointer (2, 1, this.#gl.UNSIGNED_BYTE, false, 0, 0);
	this.#gl.vertexAttribDivisor (2, 1);
    }

    render () {
	this.#gl.bindVertexArray (this.#vao);
	this.#gl.drawElementsInstanced (this.#gl.TRIANGLES, 6, this.#gl.UNSIGNED_BYTE, 0, CHUNK_SIZE);
    }
}
