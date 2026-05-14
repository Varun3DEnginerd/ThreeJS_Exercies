
precision mediump float;

varying float vRandom;

void main()
{
	gl_FragColor = vec4(0.2,vRandom * 0.52,0.1,1.0);
}


