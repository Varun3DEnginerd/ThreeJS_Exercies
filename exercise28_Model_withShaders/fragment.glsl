// Fragment Shader
uniform sampler2D uTexture;
uniform bool uUseTexture;

varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vColor;
varying vec2 vUv;

void main()
{
    // Lighting calculation
    vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
    float diffuse = max(dot(vNormal, lightDir), 0.0);

    // gl_FragColor = vec4(finalColor, 1.0);
    vec4 texColor = texture2D(uTexture, vUv);
    vec3 finalColor = texColor.rgb;
    float fBrightness = max(max(texColor.r,texColor.g),texColor.b);

    if(fBrightness > 0.5)
        finalColor *= 0.9;
        

    // gl_FragColor = vec4(finalColor,1.0);
    gl_FragColor = vec4(texColor.rgb,1.0);
}

