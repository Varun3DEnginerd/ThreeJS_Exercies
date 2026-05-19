uniform float uTime;
uniform float uWaveAmplitude;
uniform float uWaveSpeed;
uniform float uGerstnerAmplitude;
//! uniform float uFBMStrength;
//! uniform float uFBMSpeed;

varying vec3 vWorldPosition;
varying vec3 vNormal;
varying vec3 vViewDirection;
varying float vWaveHeight;

// hash + value noise
float hash(vec2 p)
{
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p)
{
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

// sine wave
float sineWave(vec2 pos, vec2 direction, float frequency, float amplitude, float speed, float phase)
{
    float t = uTime * speed * uWaveSpeed + phase;
    float d = dot(pos, direction);
    return amplitude * uWaveAmplitude * sin(d * frequency + t);
}

// sine wave normal contribution
vec2 sineWaveNormal(vec2 pos, vec2 direction, float frequency, float amplitude, float speed, float phase)
{
    float t = uTime * speed * uWaveSpeed + phase;
    float d = dot(pos, direction);
    float derivative = amplitude * uWaveAmplitude * frequency * cos(d * frequency + t);
    return direction * derivative;
}

// gerstner wave
vec3 gerstnerWave(vec2 pos, vec2 direction, float wavelength, float amplitude, float speed, float steepness)
{
    vec2 d = normalize(direction);
    float frequency = 6.28318 / wavelength;
    float phase = speed * sqrt(9.8 * frequency);
    float xz = dot(d, pos);
    float t = uTime * phase * uWaveSpeed;

    vec3 offset;
    offset.x = steepness * amplitude * uGerstnerAmplitude * d.x * cos(frequency * xz + t);
    offset.y = steepness * amplitude * uGerstnerAmplitude * d.y * cos(frequency * xz + t);
    offset.z = amplitude * uGerstnerAmplitude * sin(frequency * xz + t);

    return offset;
}

// gerstner normal
vec2 gerstnerNormal(vec2 pos, vec2 direction, float wavelength, float amplitude, float speed, float steepness)
{
    vec2 d = normalize(direction);
    float frequency = 6.28318 / wavelength;
    float phase = speed * sqrt(9.8 * frequency);
    float xz = dot(d, pos);
    float t = uTime * phase * uWaveSpeed;

    float wa = frequency * amplitude * uGerstnerAmplitude;
    float s = sin(frequency * xz + t);
    float c = cos(frequency * xz + t);

    return vec2(d.x * wa * c, d.y * wa * c) + vec2(0.0, steepness * wa * s);
}

void main()
{
    vec3 worldPos = (modelMatrix * vec4(position, 1.0)).xyz;
    vec2 pos2D = worldPos.xz;
    
    float height = 0.0;
    vec2 normalGrad = vec2(0.0);
    vec2 horizontalDisp = vec2(0.0);
    
    // gerstner waves
    vec3 g1 = gerstnerWave(pos2D, vec2(1.0, 0.2), 8.0, 0.04, 0.3, 0.25);
    horizontalDisp += g1.xy;
    height += g1.z;
    normalGrad += gerstnerNormal(pos2D, vec2(1.0, 0.2), 8.0, 0.04, 0.3, 0.25);
    
    vec3 g2 = gerstnerWave(pos2D, vec2(-0.6, 0.8), 6.0, 0.03, -0.25, 0.22);
    horizontalDisp += g2.xy;
    height += g2.z;
    normalGrad += gerstnerNormal(pos2D, vec2(-0.6, 0.8), 6.0, 0.03, -0.25, 0.22);
    
    vec3 g3 = gerstnerWave(pos2D, vec2(0.7, -0.7), 5.0, 0.025, 0.28, 0.2);
    horizontalDisp += g3.xy;
    height += g3.z;
    normalGrad += gerstnerNormal(pos2D, vec2(0.7, -0.7), 5.0, 0.025, 0.28, 0.2);
    
    // high-freq sine ripples
    height += sineWave(pos2D, normalize(vec2(1.0, 0.3)), 12.0, 0.015, 0.8, 0.0);
    normalGrad += sineWaveNormal(pos2D, normalize(vec2(1.0, 0.3)), 12.0, 0.015, 0.8, 0.0);
    
    height += sineWave(pos2D, normalize(vec2(-0.8, 0.6)), 15.0, 0.012, -0.7, 1.2);
    normalGrad += sineWaveNormal(pos2D, normalize(vec2(-0.8, 0.6)), 15.0, 0.012, -0.7, 1.2);
    
    height += sineWave(pos2D, normalize(vec2(0.5, -0.9)), 18.0, 0.01, 0.9, 2.4);
    normalGrad += sineWaveNormal(pos2D, normalize(vec2(0.5, -0.9)), 18.0, 0.01, 0.9, 2.4);
    
    height += sineWave(pos2D, normalize(vec2(-0.6, -0.8)), 14.0, 0.013, -0.75, 3.6);
    normalGrad += sineWaveNormal(pos2D, normalize(vec2(-0.6, -0.8)), 14.0, 0.013, -0.75, 3.6);
    
    height += sineWave(pos2D, normalize(vec2(0.9, 0.4)), 20.0, 0.008, 0.85, 4.8);
    normalGrad += sineWaveNormal(pos2D, normalize(vec2(0.9, 0.4)), 20.0, 0.008, 0.85, 4.8);
    
    height += sineWave(pos2D, normalize(vec2(-0.3, 0.95)), 16.0, 0.011, -0.8, 6.0);
    normalGrad += sineWaveNormal(pos2D, normalize(vec2(-0.3, 0.95)), 16.0, 0.011, -0.8, 6.0);
    
    height += sineWave(pos2D, normalize(vec2(0.7, -0.7)), 19.0, 0.009, 0.95, 7.2);
    normalGrad += sineWaveNormal(pos2D, normalize(vec2(0.7, -0.7)), 19.0, 0.009, 0.95, 7.2);
    
    height += sineWave(pos2D, normalize(vec2(-0.95, -0.3)), 13.0, 0.014, -0.85, 8.4);
    normalGrad += sineWaveNormal(pos2D, normalize(vec2(-0.95, -0.3)), 13.0, 0.014, -0.85, 8.4);
    
    height += sineWave(pos2D, normalize(vec2(0.4, 0.92)), 22.0, 0.007, 1.0, 9.6);
    normalGrad += sineWaveNormal(pos2D, normalize(vec2(0.4, 0.92)), 22.0, 0.007, 1.0, 9.6);
    
    height += sineWave(pos2D, normalize(vec2(-0.85, 0.5)), 17.0, 0.01, -0.9, 10.8);
    normalGrad += sineWaveNormal(pos2D, normalize(vec2(-0.85, 0.5)), 17.0, 0.01, -0.9, 10.8);
    
    height += sineWave(pos2D, normalize(vec2(0.6, -0.8)), 21.0, 0.008, 1.05, 12.0);
    normalGrad += sineWaveNormal(pos2D, normalize(vec2(0.6, -0.8)), 21.0, 0.008, 1.05, 12.0);
    
    height += sineWave(pos2D, normalize(vec2(-0.7, -0.7)), 11.0, 0.015, -0.95, 13.2);
    normalGrad += sineWaveNormal(pos2D, normalize(vec2(-0.7, -0.7)), 11.0, 0.015, -0.95, 13.2);
    
    // extra density
    height += sineWave(pos2D, normalize(vec2(0.2, 0.98)), 24.0, 0.006, 1.1, 14.4);
    normalGrad += sineWaveNormal(pos2D, normalize(vec2(0.2, 0.98)), 24.0, 0.006, 1.1, 14.4);
    
    height += sineWave(pos2D, normalize(vec2(-0.92, 0.38)), 10.0, 0.016, -1.0, 15.6);
    normalGrad += sineWaveNormal(pos2D, normalize(vec2(-0.92, 0.38)), 10.0, 0.016, -1.0, 15.6);
    
    height += sineWave(pos2D, normalize(vec2(0.55, -0.83)), 23.0, 0.007, 1.15, 16.8);
    normalGrad += sineWaveNormal(pos2D, normalize(vec2(0.55, -0.83)), 23.0, 0.007, 1.15, 16.8);
    
    height += sineWave(pos2D, normalize(vec2(-0.45, -0.89)), 9.0, 0.017, -1.05, 18.0);
    normalGrad += sineWaveNormal(pos2D, normalize(vec2(-0.45, -0.89)), 9.0, 0.017, -1.05, 18.0);
    
    // FBM
    //!vec2 fbmCoord1 = pos2D * 2.0 + vec2(uTime * 0.08 * uFBMSpeed, uTime * 0.06 * uFBMSpeed);
    //!vec2 fbmCoord2 = pos2D * 1.5 - vec2(uTime * 0.06 * uFBMSpeed, -uTime * 0.05 * uFBMSpeed);
    
    //!float fbmDetail = (noise(fbmCoord1) + noise(fbmCoord2)) * 0.02 * uFBMStrength;
    //!height += fbmDetail;
    
    // FBM normal
    //! float epsilon = 0.01;
    //! float fbmDx = (noise(fbmCoord1 + vec2(epsilon, 0.0)) + noise(fbmCoord2 + vec2(epsilon, 0.0))) - 
    //!               (noise(fbmCoord1 - vec2(epsilon, 0.0)) + noise(fbmCoord2 - vec2(epsilon, 0.0)));
    //! float fbmDz = (noise(fbmCoord1 + vec2(0.0, epsilon)) + noise(fbmCoord2 + vec2(0.0, epsilon))) - 
    //!               (noise(fbmCoord1 - vec2(0.0, epsilon)) + noise(fbmCoord2 - vec2(0.0, epsilon)));
    //! 
    //! normalGrad += vec2(fbmDx, fbmDz) * 0.02 * uFBMStrength / (2.0 * epsilon);
    
    // apply displacement
    vec3 displacement = vec3(horizontalDisp.x, 0.0, height + horizontalDisp.y);
    vec3 displacedPos = position + displacement;
    vec4 worldPosition = modelMatrix * vec4(displacedPos, 1.0);

    // world-space normal
    //! vec3 localNormal = normalize(vec3(-normalGrad.x, -normalGrad.y, 1.0));
    //! vec3 worldNormal = normalize(mat3(modelMatrix) * localNormal);
    vec3 worldNormal = vec3(mat3(modelMatrix));

    vWorldPosition = worldPosition.xyz;
    vNormal = worldNormal;
    vViewDirection = normalize(cameraPosition - worldPosition.xyz);
    vWaveHeight = height;

    gl_Position = projectionMatrix * viewMatrix * worldPosition;
}
