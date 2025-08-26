in vec3 vNormal;
in vec3 vWorldPosition;

void main() {
    vec3 dist = cameraPosition - vWorldPosition;
    vec3 N = normalize(vNormal);
    vec3 V = normalize(dist);

    float angleRatio = abs(dot(V, N));
    float steepening = 10.0 / (1.0 / length(dist));
    
    float visibility = max(pow(steepening, angleRatio) / steepening, 0.4);
    
    gl_FragColor = vec4(0, 0, 0, 1.0 - visibility);
}
