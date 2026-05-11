
# MODEL Loading Notes:

*** Multiple Ways to add hte Duck model to our Scene ***


1. Add the whole 'scene' in our scene.

2. Add the children of the 'scene' to our scene and ignore the PerspectiveCamera which is pre-set.
3. Filter the children before adding to the scene.
4. Add only the Mesh and end up with a duck with a wrong scale,position and rotation.
5. Open the file in a 3D Software,clean,export it again.

/**** We added the 'gltf.scene.children[0]' inside the scene. *********/

snippet:
gltfLoader_1.load(
    '/static/models/Duck/glTF/Duck.gltf',
    (gltf) =>
    {
    },
)


# Other model formats to Load:

1. glTF 	: DONE
2. glb		: DONE
3. Draco	: Error
4. Embedded	: DONE



