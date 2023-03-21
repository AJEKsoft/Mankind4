class Program {
    // The identificator of the program.
    #id;
    // A reference to the current GL context.
    #gl;
    
    constructor (gl) {
	this.#id = gl.createProgram ();
	this.#gl = gl;
    }

    add (type, source) {
	let shader = this.#gl.createShader (type);
	this.#gl.shaderSource (shader, source);
	this.#gl.compileShader (shader);

	if (!this.#gl.getShaderParameter (shader, this.#gl.COMPILE_STATUS)) {
	    alert ("An error occured when compiling shader: "
		   .concat (this.#gl.getShaderInfoLog (shader)));
	}
	
	this.#gl.attachShader (this.#id, shader);
    }

    link () {
	this.#gl.linkProgram (this.#id);

	if (!this.#gl.getProgramParameter (this.#id, this.#gl.LINK_STATUS)) {
	    alert ("An error occured when linking program: "
		   .concat (this.#gl.getProgramInfoLog (this.#id)));
	}
    }

    use () {
	this.#gl.useProgram (this.#id);
    }

    setVec3 (name, value) {
	this.#gl.uniform3fv (this.#gl.getUniformLocation (this.#id, name), value);
    }

    setMat4 (name, value) {
	this.#gl.uniformMatrix4fv (this.#gl.getUniformLocation (this.#id, name), false, value);
    }
}
