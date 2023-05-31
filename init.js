function init() {
    // *************************************************************************************************
    // Dans un premier temps, on initialise notre scene et notre camera en fonction des propriétés de la fenêtre de navigation
    // Créer ces instances est obligatoire avant d'appeler des fonctions, elles servent de support pour le reste de la simulation
    scene = new THREE.Scene(); //On initialise une scnène, un espace 3D
    // Puis on paramètre la caméra en fonction de la fenêtre
    camera = new THREE.PerspectiveCamera(30, (window.innerWidth) / (window.innerHeight), 0.001, 15000);
    //THREE.PerspectiveCamera(angle ouverture(38),          aspect,                       near, far)
    renderer = new THREE.WebGLRenderer();
    // Permet de redimensionner la simulation en fonction de la hauteur et de la largeur de l'écran
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    camera.position.copy(cameraPosition);

    // On regarde si on la taille de la fenêtre de navigation a étée modifiée, et adaptons la simulation en réaction
    window.addEventListener('resize', function () {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });



    
    // *************************************************************************************************
    function LoadAsteroids(count, minRadius, maxRadius, sizeAsteroids) {
        // Pour un nombre i passé en paramètre (count), on créé des objets asteroid répondant à la classe Asteroid
        for (var i = 0; i < count; i++) {
            // min et max Radius correspondent au rayon d'un disque dans lequel seront aléatoirement répartis les astéroïdes
            // sizeAstéroids correspond à la taille des astéroïdes
            var asteroid = new Asteroid(minRadius, maxRadius, sizeAsteroids).generateAsteroid(scene);
            // On ajoute chaque asteroid à une liste
            ListAsteroids.push(asteroid)
        }
    }

    // *************************************************************************************************
    // On initialise les planètes et satellites en renseignant leurs propriétées
    function LoadPlanets() {
        // On créé toutes les planètes et leurs satellites
        // Les paramètres sont ('nom', volume, vitesse, distanceSoleil, couleur)
        // Ces planètes sont créées à parir de la classe Planets
        mercure = new Planets('Mercure', 1, 0.09758, 0.005, 5.79, 0xe39600, 88, 1.02, 0.98, 9);
        venus = new Planets('Venus', 2, 0.24508, 0.002, 10.82, 0xff7f00, 225, 0.99, 1.01, 3);
        earth = new Planets('Earth', 3, 0.2612, 0.001, 14.96, 0x0000ff, 365, 1.02, 0.98, 0);
        moon = new Planets('Moon', 10, 0.1, 0.003, 1.5, 0xffffff, 27.3, 1.01, 0.99, 0);
        mars = new Planets('Mars', 4, 0.13584, 0.0007, 22.80, 0xff0000, 687, 1.01, 0.99, 4);
        jupiter = new Planets('Jupiter', 5, 2.859, 0.0005, 77.85, 0x7e7289, 4331, 1.01, 0.99, 335);
        io = new Planets('Io', 11, 0.2, 0.008, 6, 0xffffff, 1.8, 1.01, 0.99, 0);
        europa = new Planets('Europa', 12, 0.2, 0.006, 9, 0xffffff, 3.6, 1.01, 0.99, 0);
        ganymede = new Planets('Ganymede', 13, 0.4, 0.004, 12, 0xffffff, 7.2, 1.01, 0.99, 0);
        callisto = new Planets('Callisto', 14, 0.4, 0.002, 15, 0xffffff, 16.7, 1.01, 0.99, 0);
        saturne = new Planets('Saturne', 6, 2.41072, 0.0004, 143.2, 0xa19a79, 10747, 1.001, 0.999, 1200);
        uranus = new Planets('Uranus', 7, 1.82236, 0.0003, 286.7, 0x6e96e3, 30589, 1.001, 0.999, 1500);
        neptune = new Planets('Neptune', 8, 0.99056, 0.0001, 451.5, 0x1e4be3, 59800, 1.001, 0.999, 4500);
        //Puis on les ajoute dans des listes
        ListPlanets.push(mercure, venus, earth, mars, jupiter, saturne, uranus, neptune);
        ListSatellites.push(io, europa, ganymede, callisto);
    }

    // *************************************************************************************************
    // Cette fonction va permettre de modéliser des sphères qui répondent au paramètres des planètes,
    // et vont pouvoir être modélisées et animées
    function LoadTextures() {
        const textureLoader = new THREE.TextureLoader();

        // On charge la texture correspondante à l'espace
        const textureSpa = textureLoader.load('./textures/space2.png', function (textureSpa) {
            // Nous indiquons que nous allons répéter la texture verticalement et horizontalement
            textureSpa.wrapS = THREE.RepeatWrapping;
            textureSpa.wrapT = THREE.RepeatWrapping;
            // Puis nous décidons du nombre de répétitions
            textureSpa.repeat.set(17, 17);
        });
        // Nous appliquons la texture et indiqupns que le motif sera à l'intérieur (backside)
        const textureSpace = new THREE.MeshBasicMaterial({ map: textureSpa, side: THREE.BackSide, transparent: true, opacity: 0.2 });
        // Nous créons un objet de type sphere avec son volume en paramètre
        space = new THREE.Mesh(new THREE.SphereGeometry(10000, 32, 32), textureSpace);

        // Pour toutes les planètes, satellites et le soleil, on applique la même méthode sans préciser le side dans material
        const textureSo = textureLoader.load('./textures/soleil.jpg');
        const textureSoleil = new THREE.MeshBasicMaterial({ map: textureSo });
        sun = new THREE.Mesh(new THREE.SphereGeometry(1.2, 32, 32), textureSoleil);

        const textureMe = textureLoader.load('./textures/mercure.jpg');
        const textureMercure = new THREE.MeshBasicMaterial({ map: textureMe });
        Mercure = new THREE.Mesh(new THREE.SphereGeometry(mercure.volume, 32, 32), textureMercure); // Idem pour Mercure

        const textureV = textureLoader.load('./textures/venus.jpg');
        const textureVenus = new THREE.MeshBasicMaterial({ map: textureV });
        Venus = new THREE.Mesh(new THREE.SphereGeometry(venus.volume, 32, 32), textureVenus); // Idem pour Venus

        const textureT = textureLoader.load('./textures/Terre.jpg');        //On charge l'image qui servira de texture
        const textureEarth = new THREE.MeshBasicMaterial({ map: textureT });
        Earth = new THREE.Mesh(new THREE.SphereGeometry(earth.volume, 32, 32), textureEarth); //On créé une sphère Earth possédant les propriétés de Earth
        const textureL = textureLoader.load('./textures/lune.jpg');
        const textureLune = new THREE.MeshBasicMaterial({ map: textureL });
        Moon = new THREE.Mesh(new THREE.SphereGeometry(moon.volume, 32, 32), textureLune); // Idem pour la Lune

        const textureMa = textureLoader.load('./textures/mars.jpg');
        const textureMars = new THREE.MeshBasicMaterial({ map: textureMa });
        Mars = new THREE.Mesh(new THREE.SphereGeometry(mars.volume, 32, 32), textureMars);

        const textureJ = textureLoader.load('./textures/jupiter.jpg');
        const textureJupiter = new THREE.MeshBasicMaterial({ map: textureJ });
        Jupiter = new THREE.Mesh(new THREE.SphereGeometry(jupiter.volume, 32, 32), textureJupiter); // Idem pour Venus

        const textureI = textureLoader.load('./textures/io.jpg');
        const textureIo = new THREE.MeshBasicMaterial({ map: textureI });
        Io = new THREE.Mesh(new THREE.SphereGeometry(io.volume, 32, 32), textureIo); // Idem pour Io
        const textureE = textureLoader.load('./textures/europa.jpg');
        const textureEuropa = new THREE.MeshBasicMaterial({ map: textureE });
        Europa = new THREE.Mesh(new THREE.SphereGeometry(europa.volume, 32, 32), textureEuropa); // Idem pour Europa
        const textureG = textureLoader.load('./textures/ganymede.jpg');
        const textureGanymede = new THREE.MeshBasicMaterial({ map: textureG });
        Ganymede = new THREE.Mesh(new THREE.SphereGeometry(ganymede.volume, 32, 32), textureGanymede); // Idem pour Ganymede
        const textureCal = textureLoader.load('./textures/callisto.jpg');
        const textureCallisto = new THREE.MeshBasicMaterial({ map: textureCal });
        Callisto = new THREE.Mesh(new THREE.SphereGeometry(callisto.volume, 32, 32), textureCallisto); // Idem pour Callisto

        const textureSa = textureLoader.load('./textures/saturne.jpg');
        const textureSaturne = new THREE.MeshBasicMaterial({ map: textureSa });
        Saturne = new THREE.Mesh(new THREE.SphereGeometry(saturne.volume, 32, 32), textureSaturne);

        const textureU = textureLoader.load('./textures/uranus.jpg');
        const textureUranus = new THREE.MeshBasicMaterial({ map: textureU });
        Uranus = new THREE.Mesh(new THREE.SphereGeometry(uranus.volume, 32, 32), textureUranus);

        const textureN = textureLoader.load('./textures/neptune.jpg');
        const textureNeptune = new THREE.MeshBasicMaterial({ map: textureN });
        Neptune = new THREE.Mesh(new THREE.SphereGeometry(neptune.volume, 32, 32), textureNeptune);
        //On met toutes ces sphères dans une liste
        ListPlanets2.push(Mercure, Venus, Earth, Mars, Jupiter, Saturne, Uranus, Neptune,
            Moon, Io, Europa, Ganymede, Callisto);
    }

    // *************************************************************************************************
    // Enfin nous ajoutons tous nos objets à notre scene principale
    function AddAll() {
        scene.add(space);
        scene.add(sun);
        for (let i = 0; i < ListPlanets2.length - 5; i++) {
            scene.add(ListPlanets2[i]);
        };
        for (let i = 0; i < ListAsteroids.length; i++) {
            scene.add(ListAsteroids[i]);
        };
        for (let i = 0; i < ListSatellites.length; i++) {
            // Puis on ajoute les satellites à l'objet Jupiter et à la Terre
            Jupiter.add(Io);
            Jupiter.add(Europa);
            Jupiter.add(Ganymede);
            Jupiter.add(Callisto);
            Earth.add(Moon);
        }
    };

    // On appelle chacune des fonctions, avec AddAll en dernière
    LoadAsteroids(450, 48, 52, 0.22);
    LoadAsteroids(3000, 500, 1000, 0.55,);
    LoadAsteroids(650, 55, 500, 0.3);
    LoadPlanets();
    LoadTextures();
    AddAll();
}