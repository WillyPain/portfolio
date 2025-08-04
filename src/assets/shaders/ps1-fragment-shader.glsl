//FRAGMENT SHADER
#define STANDARD
#ifdef PHYSICAL
    #define IOR
    #define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;

// PS1 uniforms
uniform float uColorDepth;
uniform float uDithering;
uniform float uAffineIntensity;
uniform float uPixelation;
varying float vDepth;
varying vec2 vUv;
varying float vAffine;

#ifdef IOR
    uniform float ior;
#endif
#ifdef USE_SPECULAR
    uniform float specularIntensity;
    uniform vec3 specularColor;
    #ifdef USE_SPECULAR_COLORMAP
        uniform sampler2D specularColorMap;
    #endif
    #ifdef USE_SPECULAR_INTENSITYMAP
        uniform sampler2D specularIntensityMap;
    #endif
#endif
#ifdef USE_CLEARCOAT
    uniform float clearcoat;
    uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
    uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
    uniform float iridescence;
    uniform float iridescenceIOR;
    uniform float iridescenceThicknessMinimum;
    uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
    uniform vec3 sheenColor;
    uniform float sheenRoughness;
    #ifdef USE_SHEEN_COLORMAP
        uniform sampler2D sheenColorMap;
    #endif
    #ifdef USE_SHEEN_ROUGHNESSMAP
        uniform sampler2D sheenRoughnessMap;
    #endif
#endif
#ifdef USE_ANISOTROPY
    uniform vec2 anisotropyVector;
    #ifdef USE_ANISOTROPYMAP
        uniform sampler2D anisotropyMap;
    #endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>

// PS1 Dithering function (Bayer matrix 4x4)
float dither4x4(vec2 position, float brightness) {
  int x = int(mod(position.x, 4.0));
  int y = int(mod(position.y, 4.0));
  int index = x + y * 4;
  float limit = 0.0;
  
  if (index == 0) limit = 0.0625;
  if (index == 1) limit = 0.5625;
  if (index == 2) limit = 0.1875;
  if (index == 3) limit = 0.6875;
  if (index == 4) limit = 0.8125;
  if (index == 5) limit = 0.3125;
  if (index == 6) limit = 0.9375;
  if (index == 7) limit = 0.4375;
  if (index == 8) limit = 0.25;
  if (index == 9) limit = 0.75;
  if (index == 10) limit = 0.125;
  if (index == 11) limit = 0.625;
  if (index == 12) limit = 1.0;
  if (index == 13) limit = 0.5;
  if (index == 14) limit = 0.875;
  if (index == 15) limit = 0.375;
  
  return brightness < limit ? 0.0 : 1.0;
}

// PS1 modified map_fragment chunk

void main() {
    vec4 diffuseColor = vec4( diffuse, opacity );
    #include <clipping_planes_fragment>
    ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
    vec3 totalEmissiveRadiance = emissive;
    #include <logdepthbuf_fragment>

    // Use PS1 modified map sampling instead of #include <map_fragment>
#ifdef USE_MAP
    vec4 sampledDiffuseColor;

    // Undo perspective distortion with affine correction
    vec2 affineUv = vUv / vAffine;

    // Optionally blend with perspective UV for smoothness
    vec2 finalUv = mix(vUv, affineUv, uAffineIntensity);

    // Optional pixelation effect (snap UVs to pixel grid)
    if (uPixelation > 0.0) {
        finalUv = floor(finalUv * uPixelation) / uPixelation;
    }

    // Clamp UVs to avoid artifacts outside 0..1 range
    finalUv = clamp(finalUv, 0.0, 1.0);

    sampledDiffuseColor = texture2D(map, finalUv);

    #ifdef DECODE_VIDEO_TEXTURE
        sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
    #endif

    diffuseColor *= sampledDiffuseColor;
    #endif

    #include <color_fragment>
    #include <alphamap_fragment>
    #include <alphatest_fragment>
    #include <alphahash_fragment>
    #include <roughnessmap_fragment>
    #include <metalnessmap_fragment>
    #include <normal_fragment_begin>
    #include <normal_fragment_maps>
    #include <clearcoat_normal_fragment_begin>
    #include <clearcoat_normal_fragment_maps>
    #include <emissivemap_fragment>
    #include <lights_physical_fragment>
    #include <lights_fragment_begin>
    #include <lights_fragment_maps>
    #include <lights_fragment_end>
    #include <aomap_fragment>
    vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
    vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
    #include <transmission_fragment>
    vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
    #ifdef USE_SHEEN
        float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
        outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
    #endif
    #ifdef USE_CLEARCOAT
        float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
        vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
        outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
    #endif
    #include <opaque_fragment>
    #include <tonemapping_fragment>
    #include <colorspace_fragment>

	// === PS1 POST-PROCESSING EFFECTS ===
	
	// 1. Color quantization (reduce color depth)
	gl_FragColor.rgb = floor(gl_FragColor.rgb * uColorDepth) / uColorDepth;
	
	// 2. Apply PS1-style dithering
	if (uDithering > 0.0) {
		vec2 pixelPos = floor(gl_FragCoord.xy);
		float brightness = dot(gl_FragColor.rgb, vec3(0.299, 0.587, 0.114));
		float ditherValue = dither4x4(pixelPos, brightness);
		gl_FragColor.rgb *= mix(1.0, ditherValue * 0.8 + 0.2, uDithering);
	}
	
	// 3. PS1 color shift (slightly darker, more contrast)
	gl_FragColor.rgb = pow(gl_FragColor.rgb, vec3(1.1));
	
	// 4. Slight color bleeding/saturation boost
	gl_FragColor.rgb = mix(gl_FragColor.rgb, gl_FragColor.rgb * 1.2, 0.1);

    #include <fog_fragment>
    #include <premultiplied_alpha_fragment>
    #include <dithering_fragment>
}