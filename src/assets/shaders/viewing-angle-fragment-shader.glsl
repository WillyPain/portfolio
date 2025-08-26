in vec3 vNormal;
in vec3 vWorldPosition;

void main() {
    vec3 N = normalize(vNormal);
    vec3 V = normalize(cameraPosition - vWorldPosition);
    float spec = max(abs(dot(V, N)), 0.2);
    
    gl_FragColor = vec4(.2, .2, .2, 1.0 - spec);
}
