# Blender phase

### geometry optimization

-   remove excess/unseen faces

### geometry compression

-   DECIMATE modifier Method 1, 6x-7x triangle count reduction, this looks really nice without too much artifacting at a distance, and is sub-1k triangles
    -   Planar, UVS, 180deg
    -   collapse, 0.5
-   DECIMATE modifier Method 3, 5x reduction
    -   collapse, 0.2
    -   Planar, UVS, 180deg
-   DECIMATE modifier Method 2, only 4x reduction
    -   collapse, 0.5
    -   Planar, UVS, 180deg

### UV optimization & unwrapping

-   4k hdr textures

### Light baking

-   pre-bake lighting into HDR texture. You get gorgeous raytraced lighting with zero performance hit

### Export w compression

-   web friendly file format, .glb/.gltf (5x-10x smaller than OBJ or FBX file formats), with compression enabled
-   run tests on this with closeup models, you could export w no compression, then gltfjsx compress

# VSCode phase

### gltfjsx conversion w compression

-   gltfjsx converts glb/gltf files to typescript files, with optional texture compression
-   texture quality suffers w compression enabled
-   4096, compressed 1862.1MB to 21.5MB for 98.8% reduction
-   2048, compressed 1862.1MB to 13.4MB for 99.3% reduction
-   1024, compressed 1862.1MB to 9.3MB for 99.5% reduction
-   512, compressed 1862.1MB to 7.5MB for 99.6% reduction

## Staggered loading/stage streaming

-   load current and neighboring stages
-   unload all other stages

## In View Manager (built into LOD)

-   renders only items visible in viewport, another performance win.

### LOD levels

-   closeup, near, medium, far, not rendered
    -   blender techniques

### Performance monitor

-   monitor and throttle as needed
-   scale anti-aliasing to maintain 60fps
