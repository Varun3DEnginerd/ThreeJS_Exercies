
precision mediump float;

varying float vRandom;
varying vec2 vUv;

uniform sampler2D uTexture;

void main()
{
	//gl_FragColor = vec4(0.5,vRandom * 0.52,0.1,1.0);

	vec4 textureOutput = texture2D(uTexture,vUv);

	gl_FragColor = textureOutput;
}


