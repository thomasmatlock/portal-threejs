import bpy
import os

def export_scene(context):
    # Get the directory and filename of the current Blender file
    blend_file_path = bpy.data.filepath
    blend_file_dir, blend_file_name = os.path.split(blend_file_path)
    export_file_name = "Scene" + ".glb"

    # Set the export folder relative to the current Blender file
    export_folder = os.path.join(blend_file_dir, "public", "models", "src")

    # Create the export folder if it doesn't exist
    if not os.path.exists(export_folder):
        os.makedirs(export_folder)

    # Get the current scene
    scene = bpy.context.scene

    # Get the list of visible objects, cameras, and lights in the scene
    visible_objects = [obj for obj in scene.objects if obj.visible_get()]
    cameras = [obj for obj in scene.objects if obj.type == 'CAMERA']
    lights = [obj for obj in scene.objects if obj.type == 'LIGHT']

    # Deselect all objects
    bpy.ops.object.select_all(action='DESELECT')

    # Select the visible objects, cameras, and lights
    for obj in  lights + cameras + visible_objects:
        obj.select_set(True)

    # Set the export file path
    export_file_path = os.path.join(export_folder, export_file_name)

    # Export the visible objects, cameras, and lights as a single GLB file
    bpy.ops.export_scene.gltf(
        filepath=export_file_path,
        use_selection=True,
        export_format='GLB',
        export_draco_mesh_compression_enable=True,
        export_cameras=True,
        export_lights=True,
    )

    # Deselect all objects
    bpy.ops.object.select_all(action='DESELECT')

    print("GLB export completed successfully!")
    
# export_scene(bpy.context)
def register():
    bpy.app.handlers.save_post.append(export_scene)

def unregister():
    bpy.app.handlers.save_post.remove(export_scene)

if __name__ == "__main__":
    register()