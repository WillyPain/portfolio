// https://romanliutikov.com/blog/ps1-style-graphics-in-threejs
// thank you for the help roman!

//VERTEX SHADER
#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif

// PS1 additions
varying vec2 vUv;
varying float vDepth;
uniform bool uEnableVertexSnap;
uniform float uVertexSnap;
uniform vec2 uMousePosition;
varying float vAffine;

#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>

void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	// PS1 vertex snapping
	if (uEnableVertexSnap) {
		float snap = uVertexSnap;
		float mouseDist = length((gl_Position.xy / gl_Position.w) - uMousePosition);
		if (mouseDist < 0.1) {
			snap *= 10.0;
			gl_Position.xy = floor(gl_Position.xy / snap) * snap;
		}
		else {
			gl_Position.xy = ceil(gl_Position.xy / snap) * snap;
		}
	}
	
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
    #ifdef USE_TRANSMISSION
        vWorldPosition = worldPosition.xyz;
    #endif
    
    float dist = length(mvPosition);
    float affine = dist + (gl_Position.w * 8.0) / dist * 0.5;
    vUv = uv * affine;
    vAffine = affine;
}