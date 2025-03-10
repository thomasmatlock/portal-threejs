// Options
//   --output, -o        Output file name/path
//   --types, -t         Add Typescript definitions, NECESSARY
//   --keepnames, -k     Keep original names
//   --keepgroups, -K    Keep (empty) groups, disable pruning
//   --meta, -m          Include metadata (as userData)
//   --shadows, -s        Let meshes cast and receive shadows
//   --printwidth, w     Prettier printWidth (default: 120)
//   --precision, -p     Number of fractional digits (default: 3)
//   --draco, -d         Draco binary path
//   --root, -r          Sets directory from which .gltf file is served
//   --instance, -i      Instance re-occuring geometry
//   --instanceall, -I   Instance every geometry (for cheaper re-use)
//   --transform, -T     Transform the asset for the web (draco, prune, resize)
//     --resolution, -R  Resolution for texture resizing (default: 1024) YES, 512 for testing, everything else for final
//     --keepmeshes, -j  Do not join compatible meshes
//     --keepmaterials, -M Do not palette join materials
//     --format, -f      Texture format (default: "webp")
//     --simplify, -S    Mesh simplification (default: false), NO, RUINS MESHES
//       --weld          Weld tolerance (default: 0.00005)
//       --ratio         Simplifier ratio (default: 0)
//       --error         Simplifier error threshold (default: 0.0001)
//   --debug, -D         Debug output

export const getCommand = (srcGlbTargetFile: string, newTsxTargetPath: string, res: number) => {
	return `npx gltfjsx ${srcGlbTargetFile} --output ${newTsxTargetPath} -r public/models${res} --transform -t --resolution ${res}  --shadows --meta --keepmeshes --keepmaterials `;
};
export default getCommand;
