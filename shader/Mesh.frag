
#extension GL_OES_standard_derivatives : enable

uniform float opacity;
uniform float nearClip;

varying vec3 vNormal;
varying vec4 cameraPos;

#ifdef PICKING
    uniform float objectId;
    varying vec3 vPickingColor;
#else
    varying vec3 vColor;
#endif

#include light_params

#include fog_params


void main()
{

    #ifdef NEAR_CLIP
        if( dot( cameraPos, vec4( 0.0, 0.0, 1.0, nearClip ) ) > 0.0 )
            discard;
    #endif

    #ifdef PICKING

        gl_FragColor = vec4( vPickingColor, objectId );

    #else

        #ifdef FLAT_SHADED
            vec3 fdx = dFdx( cameraPos.xyz );
            vec3 fdy = dFdy( cameraPos.xyz );
            vec3 normal = normalize( cross( fdx, fdy ) );
        #else
            vec3 normal = normalize( vNormal );
        #endif

        vec3 transformedNormal = normalize( normal );
        #ifdef DOUBLE_SIDED
            transformedNormal = transformedNormal * ( -1.0 + 2.0 * float( gl_FrontFacing ) );
        #endif

        #ifdef FLIP_SIDED
            transformedNormal = -transformedNormal;
        #endif

        vec3 vLightFront = vec3( 0.0, 0.0, 0.0 );

        #ifndef NOLIGHT
            #include light
        #endif

        gl_FragColor = vec4( vColor, opacity );

        #ifndef NOLIGHT
            gl_FragColor.rgb *= vLightFront;
        #endif

    #endif

    #include fog

}
