import * as THREE from 'three';

			import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
			// import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

			import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
			import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

			let mixer;

			let spotLight;

			const clock = new THREE.Clock();
			const container = document.getElementById( 'container' );

			const renderer = new THREE.WebGLRenderer( { antialias: true } );
			renderer.setPixelRatio( window.devicePixelRatio );
			renderer.setSize( window.innerWidth, window.innerHeight );
			renderer.shadowMap.enabled = true;
			
			container.appendChild( renderer.domElement );

			const pmremGenerator = new THREE.PMREMGenerator( renderer );

			const scene = new THREE.Scene();
			scene.background = new THREE.Color( 0x222222 );
			// scene.environment = pmremGenerator.fromScene( new RoomEnvironment(), 0.04 ).texture
			scene.fog = new THREE.FogExp2( 0x222222, 0.02 );

			const camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 100 );
			camera.position.set( 5, 2, 8 );

			const controls = new OrbitControls( camera, renderer.domElement );
			controls.target.set( 0, 0.5, 0 );
			controls.update();
			controls.enablePan = false;
			controls.enableDamping = true;

			const dracoLoader = new DRACOLoader();
			dracoLoader.setDecoderPath( 'jsm/libs/draco/gltf/' );

			const loader = new GLTFLoader();
			loader.setDRACOLoader( dracoLoader );


			loader.load( 'models/simpleHarryPotterHouse.glb', function ( gltf ) {

				const model = gltf.scene;
				model.position.set( 0, -1, 0 );
				model.scale.set( 0.16, 0.16, 0.16);
				model.receiveShadow = true;
				scene.add( model );

				model.traverse( function ( object ) {

					if ( object.isMesh ){
						object.castShadow = true;
						object.receiveShadow = true;
					}



				} );

				animate();

			}, undefined, function ( e ) {

				console.error( e );

			} );



			const dirLight = new THREE.DirectionalLight( 0xffddde , 7);
			
				dirLight.position.set( -4, 8, 10);
				dirLight.castShadow = true;
				// dirLight.shadow.camera.near = 0.1;
				// dirLight.shadow.camera.far = 40;
				dirLight.shadow.mapSize.width = 1024;
				dirLight.shadow.mapSize.height = 1024;
				scene.add( dirLight );

			scene.add( new THREE.HemisphereLight( 0xffddde, 0x785099, .3 ));


			window.onresize = function () {

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );

			};


			function animate() {

				requestAnimationFrame( animate );

				const delta = clock.getDelta();

				controls.update();

				renderer.render( scene, camera );

			}

