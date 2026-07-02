// Vertex Shader
uniform float uTime;

varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vColor;
varying vec2 vUv;

void main()
{
    // Get the normal and position from the model
    vNormal = normalize(normalMatrix * normal);
    vPosition = vec3(modelMatrix * vec4(position, 1.0));
    vUv = uv;
    
    // Simple color variation based on normal direction
    vColor = normalize(normal) * 0.5 + 0.5;
    
    // Optional: Add some displacement based on time
    vec3 displaced = position + normal * sin(uTime) * 0.1;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
}
