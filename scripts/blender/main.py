import bpy
import os

blend_file_path = bpy.data.filepath
blend_file_dir, blend_file_name = os.path.split(blend_file_path)
# export_folder = os.path.join(blend_file_dir, "public", "models", "src")
export_folder = os.path.join(blend_file_dir)
scene = bpy.context.scene
meshes = [obj for obj in scene.objects if obj.type == 'MESH']
visible_meshes = [obj for obj in meshes if obj.visible_get()]
os.makedirs(export_folder, exist_ok=True)

decimate_modifier_ratio = 0.9
export_materials_setting = 'EXPORT'  # Can be 'NONE', 'EXPORT', or 'PLACEHOLDER'


def export_camera(context):
    export_file_name = "Camera" + ".glb"
    cameras = [obj for obj in scene.objects if obj.type == 'CAMERA']
    bpy.ops.object.select_all(action='DESELECT')
    for obj in cameras :
        obj.select_set(True)
    export_file_path = os.path.join(export_folder, export_file_name)
    bpy.ops.export_scene.gltf(
        filepath=export_file_path,
        use_selection=True,
        export_format='GLB',
        export_draco_mesh_compression_enable=True,
        export_cameras=True,
    )
    bpy.ops.object.select_all(action='DESELECT')

def export_lighting(context):
    export_file_name = "Lighting" + ".glb"
    lights = [obj for obj in scene.objects if obj.type == 'LIGHT']
    bpy.ops.object.select_all(action='DESELECT')
    for obj in lights:
        obj.select_set(True)
    export_file_path = os.path.join(export_folder, export_file_name)
    bpy.ops.export_scene.gltf(
        filepath=export_file_path,
        use_selection=True,
        export_format='GLB',
        export_draco_mesh_compression_enable=True,
        export_lights=True,
    )
    bpy.ops.object.select_all(action='DESELECT')

def export_visible_meshes(context):
    export_file_name = "StaticMeshes" + ".glb"
    visible_objects = [obj for obj in visible_objects if obj.type == 'MESH']
    bpy.ops.object.select_all(action='DESELECT')
    for obj in visible_objects:
        obj.select_set(True)
    export_file_path = os.path.join(export_folder, export_file_name)
    bpy.ops.export_scene.gltf(
        filepath=export_file_path,
        use_selection=True,
        export_format='GLB',
        export_draco_mesh_compression_enable=True,
    )
    bpy.ops.object.select_all(action='DESELECT')

def exportStaticMeshesOneFile(context):
    export_file_name = "StaticMeshes" + ".glb"
    static_meshes = [obj for obj in visible_meshes if 'static' in obj.name or 'Static' in obj.name]
    static_collections = [collection for collection in bpy.data.collections if 'static' in collection.name or 'Static' in collection.name]
    for collection in static_collections:
        for obj in collection.objects:
            static_meshes.append(obj)
        
    bpy.ops.object.select_all(action='DESELECT')
    for obj in static_meshes:
        obj.select_set(True)
        # if "Decimate" not in obj.modifiers:
        #     decimate_modifier = obj.modifiers.new("Decimate", type='DECIMATE')
        # else:
        #     decimate_modifier = obj.modifiers["Decimate"]
                
        #         # Check if the decimate value is 0.1 and set it if not
        # if decimate_modifier.ratio != decimate_modifier_ratio:
        #     decimate_modifier.ratio = decimate_modifier_ratio
    export_file_path = os.path.join(export_folder, export_file_name)
    bpy.ops.export_scene.gltf(
        filepath=export_file_path,
        use_selection=True,
        export_format='GLB',
        export_materials=export_materials_setting,
        export_apply=True,
        export_draco_mesh_compression_enable=True,
    )
    bpy.ops.object.select_all(action='DESELECT')

def exportAnimatedMeshesOneFile(context):
    export_file_name = "AnimatedMeshes" + ".glb"
    # animated_meshes = [obj for obj in visible_meshes if 'animated' in obj.name or 'Animated' in obj.name]
    animated_meshes = []
    animated_collections = [collection for collection in bpy.data.collections if 'animated' in collection.name or 'Animated' in collection.name]
    for collection in animated_collections:
        for obj in collection.objects:
            animated_meshes.append(obj)
        
    bpy.ops.object.select_all(action='DESELECT')
    for obj in animated_meshes:
        obj.select_set(True)
        # if "Decimate" not in obj.modifiers:
        #     decimate_modifier = obj.modifiers.new("Decimate", type='DECIMATE')
        # else:
        #     decimate_modifier = obj.modifiers["Decimate"]
                
        #         # Check if the decimate value is 0.1 and set it if not
        # if decimate_modifier.ratio != decimate_modifier_ratio:
        #     decimate_modifier.ratio = decimate_modifier_ratio
    export_file_path = os.path.join(export_folder, export_file_name)
    bpy.ops.export_scene.gltf(
        filepath=export_file_path,
        use_selection=True,
        export_format='GLB',
        export_materials=export_materials_setting,
        export_draco_mesh_compression_enable=True,
    )
    bpy.ops.object.select_all(action='DESELECT')
    
def exportAnimatedMeshesIndividualFiles(context):
    animated_collections = [collection for collection in bpy.data.collections if 'animated' in collection.name or 'Animated' in collection.name]
    for collection in animated_collections:
        for obj in collection.objects:
            if obj.visible_get():
        
                bpy.ops.object.select_all(action='DESELECT')
                obj.select_set(True)
                capitalizedName = obj.name[0].upper() + obj.name[1:]
                if '.' in capitalizedName:
                    capitalizedName = capitalizedName.replace('.', '_')
                export_file_name = "AM_" + capitalizedName + ".glb"
                export_file_path = os.path.join(export_folder, export_file_name)
                # https://docs.blender.org/api/current/bpy.ops.export_scene.html#bpy.ops.export_scene.gltf
                if "Decimate" not in obj.modifiers:
                    decimate_modifier = obj.modifiers.new("Decimate", type='DECIMATE')
                else:
                    decimate_modifier = obj.modifiers["Decimate"]
                
                # Check if the decimate value is 0.1 and set it if not
                if decimate_modifier.ratio != decimate_modifier_ratio:
                    decimate_modifier.ratio = decimate_modifier_ratio
                    
                bpy.ops.export_scene.gltf(
                    filepath=export_file_path,
                    use_selection=True,
                    export_materials=export_materials_setting,
                    export_draco_mesh_compression_enable=True,
                    export_format='GLB',
                    export_apply=True,
                )
    bpy.ops.object.select_all(action='DESELECT')

def export_selected_collection(context):
    """Export all objects in the currently selected collection as a single GLB file"""
    # Get the active collection
    active_collection = context.view_layer.active_layer_collection.collection
    if not active_collection:
        return
    
    # Create export filename based on collection name
    capitalizedName = active_collection.name[0].upper() + active_collection.name[1:]
    if '.' in capitalizedName:
        capitalizedName = capitalizedName.replace('.', '_')
    export_file_name = f"COLL_{capitalizedName}.glb"
    export_file_path = os.path.join(export_folder, export_file_name)
    
    # Deselect all objects first
    bpy.ops.object.select_all(action='DESELECT')
    
    # Select all objects in the collection
    for obj in active_collection.objects:
        if obj.visible_get():  # Only select visible objects
            obj.select_set(True)
    
    # Export the collection
    bpy.ops.export_scene.gltf(
        filepath=export_file_path,
        use_selection=True,
        export_format='GLB',
        export_materials=export_materials_setting,
        export_draco_mesh_compression_enable=True,
        export_apply=True,
    )
    
    bpy.ops.object.select_all(action='DESELECT')

def export_selected_object(context):
    """Export currently selected object with standard export settings, ignoring lights and cameras"""
    selected_objects = [obj for obj in bpy.context.selected_objects if obj.type not in ['LIGHT', 'CAMERA']]
    
    if not selected_objects:
        print("No valid objects selected. Please select a mesh object to export (lights and cameras are ignored).")
        return
    
    # Get the first selected object
    obj = selected_objects[0]
    
    # Check if object has animations
    has_animation = False
    
    # Check for action animations
    if obj.animation_data and obj.animation_data.action:
        has_animation = True
        
    # Check for shape keys with animation
    if obj.type == 'MESH' and obj.data.shape_keys and obj.data.shape_keys.animation_data:
        has_animation = True
        
    # Check for armature and its animations
    for child in obj.children:
        if child.type == 'ARMATURE' and child.animation_data and child.animation_data.action:
            has_animation = True
            break
    
    # Set prefix based on animation status
    prefix = "AM_" if has_animation else "SM_"
    
    # Process name
    capitalizedName = obj.name[0].upper() + obj.name[1:]
    if '.' in capitalizedName:
        capitalizedName = capitalizedName.replace('.', '_')
    
    export_file_name = f"{prefix}{capitalizedName}.glb"
    export_file_path = os.path.join(export_folder, export_file_name)
    
    # Apply decimate modifier if needed
    # if obj.type == 'MESH':
    #     if "Decimate" not in obj.modifiers:
    #         decimate_modifier = obj.modifiers.new("Decimate", type='DECIMATE')
    #     else:
    #         decimate_modifier = obj.modifiers["Decimate"]
        
    #     if decimate_modifier.ratio != decimate_modifier_ratio:
    #         decimate_modifier.ratio = decimate_modifier_ratio
    
    # Export with standard settings
    bpy.ops.export_scene.gltf(
        filepath=export_file_path,
        use_selection=True,
        export_format='GLB',
        export_materials=export_materials_setting,
        export_draco_mesh_compression_enable=True,
        export_apply=True,
    )


def export_all(context):
    # export_lighting(context)
    export_selected_object(context)
    # export_selected_collection(context)  # Now works with any selected collection
    
export_all(bpy.context)

def register():
    bpy.app.handlers.save_post.append(export_all)

def unregister():
    bpy.app.handlers.save_post.remove(export_all)


# if __name__ == "__main__":
    # register()