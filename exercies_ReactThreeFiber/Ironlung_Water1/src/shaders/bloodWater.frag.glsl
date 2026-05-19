#define PI 3.14159265359

uniform vec3 uSunDirection;
uniform vec3 uSunColor;
uniform vec3 uAmbient;
uniform vec3 uBloodColor;
uniform vec3 uDarkBloodColor;
uniform float uShininess;
uniform float uFresnelStrength;
uniform float uEnvMapIntensity;
uniform float uSubsurfaceStrength;

varying vec3 vWorldPosition;
varying vec3 vNormal;
varying vec3 vViewDirection;
varying float vWaveHeight;

void main() {
    vec3 normal = normalize(vNormal);
    vec3 lightDir = normalize(-uSunDirection);
    vec3 viewDir = normalize(vViewDirection);
    vec3 halfwayDir = normalize(lightDir + viewDir);


    float NdotV = max(0.0, dot(normal, viewDir));
    float NdotL = max(0.0, dot(normal, lightDir));
    
    // diffuse
    vec3 diffuse = uSunColor * NdotL * uBloodColor * 0.4;

    // specular
    float spec = pow(max(0.0, dot(normal, halfwayDir)), uShininess) * NdotL;
    vec3 specular = uSunColor * vec3(1.0, 0.95, 0.9) * spec * 2.5;

    // fresnel
    float fresnel = pow(1.0 - NdotV, 3.0) * uFresnelStrength;
    
    // reflection
    vec3 reflectedDir = reflect(-viewDir, normal);
    float upness = max(0.0, reflectedDir.y);
    

    vec3 reflectionColor = mix(
        vec3(0.02, 0.01, 0.01),
        vec3(0.08, 0.03, 0.02),
        upness * 0.5
    );
    

    vec3 reflection = reflectionColor * fresnel * uEnvMapIntensity * 0.5;
    
    // sss
    float backLight = max(0.0, dot(-lightDir, viewDir));
    float scatter = pow(backLight, 2.0);
    float rimScatter = pow(1.0 - NdotV, 4.0);
    vec3 scatterColor = (scatter * 0.6 + rimScatter * 0.4) * uBloodColor * 2.5 * uSunColor * uSubsurfaceStrength;

    // depth color
    float heightFactor = smoothstep(-0.3, 0.3, vWaveHeight);
    vec3 baseColor = mix(uDarkBloodColor * 0.8, uBloodColor * 1.4, heightFactor);


    vec3 color = uAmbient + baseColor + diffuse + specular + reflection + scatterColor;

    gl_FragColor = vec4(color, 1.0);
}
