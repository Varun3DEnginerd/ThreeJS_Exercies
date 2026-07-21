export default function Experience()
{
    return (
        <>
        <mesh>
                <torusKnotGeometry />
                <meshNormalMaterial/>
            </mesh>

            <mesh>
                <boxGeometry />
                <meshBasicMaterial color="blue" />
            </mesh> 
        </>
    );
}