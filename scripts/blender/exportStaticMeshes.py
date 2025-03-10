import bpy
import os

def export_meshes_as_glb(export_dir):
    # Get the current Blender file name without the extension
    blend_file_name = os.path.splitext(bpy.path.basename(bpy.data.filepath))[0]
    
    # Iterate through all objects in the scene
    for obj in bpy.context.scene.objects:
        # Check if the object is a mesh and not animated
        if obj.type == 'MESH' and not obj.animation_data:
            # Deselect all objects
            bpy.ops.object.select_all(action='DESELECT')
            
            # Select the current mesh object
            obj.select_set(True)
            bpy.context.view_layer.objects.active = obj
            
            # Construct the export file path
            export_file_path = os.path.join(export_dir, f"{blend_file_name}_{obj.name}.glb")
            
            # Export the mesh as GLB
            bpy.ops.export_scene.gltf(
                filepath=export_file_path,
                use_selection=True,
                export_format='GLB',
                export_apply=True
            )
            
            # Deselect the object
            obj.select_set(False)

# Specify the export directory
blend_file_path = bpy.data.filepath
blend_file_dir, blend_file_name = os.path.split(blend_file_path)
# export_file_name = "StaticMeshes" + ".glb"

    # Set the export folder relative to the current Blender file
export_directory = os.path.join(blend_file_dir, "public", "models", "src")

def register():
    bpy.app.handlers.save_post.append(export_meshes_as_glb)

def unregister():
    bpy.app.handlers.save_post.remove(export_meshes_as_glb)

if __name__ == "__main__":
    register()