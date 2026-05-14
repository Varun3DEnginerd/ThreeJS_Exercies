
attribute vec3 position;
attribute vec2 uv;

attribute float a_Random;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

uniform vec2 uFreqeuncy;
uniform float uTime;

varying float vRandom;
varying vec2 vUv;
varying float vElevation;

void main()
{
	vec4 modelPosition = modelMatrix * vec4(position,1.0);

	float elevation = sin(modelPosition.x * uFreqeuncy.x - uTime)*0.1;
	elevation += sin(modelPosition.y * uFreqeuncy.y - uTime)*0.1;

	modelPosition.z += elevation;
	vec4 viewPosition = viewMatrix * modelPosition;
	vec4 projectionPosition= projectionMatrix * viewPosition;

	gl_Position = projectionPosition;

	vRandom = a_Random;

	vUv = uv;

	vElevation = elevation;
}

