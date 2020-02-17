
importScripts("https://preview.babylonjs.com/babylon.js");
importScripts("https://preview.babylonjs.com/loaders/babylonjs.loaders.min.js");


var createScene = function () {
    
    var scene = new BABYLON.Scene(engine);  

    BABYLON.SceneLoader.ImportMesh("", "https://models.babylonjs.com/", "flightHelmet.glb", scene, function (meshes) {          
        scene.createDefaultCameraOrLight(true, true, true);
		scene.createDefaultEnvironment();
		
        meshes[0].rotationQuaternion = null;        
		BABYLON.Animation.CreateAndStartAnimation("turnTable", meshes[0], "rotation.y", 60, 480, 0, Math.PI * 2);
    });

    return scene;
};
var engine;
onmessage = function(evt) {

    if (evt.data.canvas) {
        canvas = evt.data.canvas;

        engine = new BABYLON.Engine(canvas, true);
        var scene = createScene();
        
        engine.runRenderLoop(function() {
            engine.resize();
            if (scene.activeCamera) {
                scene.render();
            }
        });
    } else {
        canvas.width = evt.data.width;
        canvas.height = evt.data.height;
    }
}
