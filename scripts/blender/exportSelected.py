import bpy
import os

# Function to export the selected object(s) as glTF binary
def export_selected_glb(context, directory):
    # Get the selected object(s)
    selected_objects = [obj for obj in context.scene.objects if obj.select_get()]

    if not selected_objects:
        print("No objects selected for export.")
        return

    # Deselect all objects
    for obj in context.scene.objects:
        obj.select_set(False)

    # Export each selected object as a separate glTF binary file
    for obj in selected_objects:
        obj.select_set(True)

        # Construct the glTF binary file path based on the object name
        glb_filepath = os.path.join(directory, "public", "models", "src", f"{obj.name}.glb")

        # Export the selected object as glTF binary
        bpy.ops.export_scene.gltf(
            filepath=glb_filepath,
            use_selection=True,
            export_format='GLB'
        )

        # obj.select_set(False)

        print(f"Object '{obj.name}' exported to {glb_filepath}")

# Function to handle the save event
def handle_save(scene):
    # Get the current Blender file path
    blend_filepath = bpy.data.filepath

    if not blend_filepath:
        return

    # Get the directory of the Blender file
    directory = os.path.dirname(blend_filepath)

    # Call the export function
    export_selected_glb(bpy.context, directory)

# export_scene(bpy.context)
def register():
    bpy.app.handlers.save_post.append(handle_save)

def unregister():
    bpy.app.handlers.save_post.remove(handle_save)

if __name__ == "__main__":
    register()