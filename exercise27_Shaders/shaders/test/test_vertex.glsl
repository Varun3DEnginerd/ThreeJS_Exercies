
uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

attribute vec3 position;
attribute float a_Random;

varying float vRandom;

void main()
{
	vec4 modelPosition = modelMatrix * vec4(position,1.0);

	//modelPosition.z += sin(modelPosition.x * 10.0)*0.1;
	modelPosition.z += a_Random*0.1;

	vec4 viewPosition = viewMatrix * modelPosition;
	vec4 projectionPosition= projectionMatrix * viewPosition;

	gl_Position = projectionPosition;

	vRandom = a_Random;
	
}

