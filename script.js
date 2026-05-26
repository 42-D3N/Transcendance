const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);

const createScene = async () => {

    const scene = new BABYLON.Scene(engine);

    scene.clearColor = new BABYLON.Color4(0, 0, 0, 1);

    // Camera
    const camera = new BABYLON.ArcRotateCamera(
        "camera",
        Math.PI / 2,
        Math.PI / 2.5,
        25,
        BABYLON.Vector3.Zero(),
        scene
    );

    camera.attachControl(canvas, true);

    // Lights
    new BABYLON.HemisphericLight(
        "light1",
        new BABYLON.Vector3(1, 1, 0),
        scene
    );

    new BABYLON.PointLight(
        "light2",
        new BABYLON.Vector3(0, 10, -10),
        scene
    );

    // Load font
    const fontData = await fetch(
        "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/fonts/gentilis_bold.typeface.json"
    ).then(res => res.json());

    // Create text
    const middletext = BABYLON.MeshBuilder.CreateText(
        "text",
        "LE PONG DE MERDE",
        fontData,
        {
            size: 3,
            depth: 1,
            resolution: 64
        },
        scene,
        earcut
    );

    // Material
    const material = new BABYLON.StandardMaterial("mat", scene);

    material.diffuseColor = new BABYLON.Color3(1, 0.2, 0.7);
    material.emissiveColor = new BABYLON.Color3(0.5, 0.1, 0.3);

    middletext.material = material;

    // CENTER TEXT
    middletext.position.x = 0;

    // RESPONSIVE FUNCTION
    const updateResponsive = () => {

        const width = window.innerWidth;

        if (width < 600) {

            // Mobile
            middletext.scaling.setAll(0.4);
            camera.radius = 40;

        } else if (width < 1024) {

            // Tablet
            middletext.scaling.setAll(0.7);
            camera.radius = 32;

        } else {

            // Desktop
            middletext.scaling.setAll(1);
            camera.radius = 25;
        }

        engine.resize();
    };

    // Initial call
    updateResponsive();

    // On resize
    window.addEventListener("resize", updateResponsive);

    // Rotation animation
    
    middletext.rotation.y = 0.01
    // Rotation animation
    scene.registerBeforeRender(() => {
        if (middletext.rotation.y < 2)
            middletext.rotation.y *= 1.1;
        else
            middletext.rotation.y += 0.20;
        console.log("middle text ", middletext.rotation.y);
    });

    return scene;
};

createScene().then(scene => {

    engine.runRenderLoop(() => {
        scene.render();
    });

});

window.addEventListener("resize", () => {
    engine.resize();
});
