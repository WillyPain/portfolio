out vec3 vNormal;
out vec3 vWorldPosition;

void main() {
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;

    vNormal = normal;

    gl_Position = projectionMatrix * viewMatrix * worldPosition;
}