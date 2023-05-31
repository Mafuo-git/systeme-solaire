
function animate() {
    requestAnimationFrame(animate);
    // on bouge la caméra vers la position cible
    camera.position.lerp(cameraTarget.clone(), cameraSpeed);

    // *************************************************************************************************
    // Cette fonction permet de dessiner un disque paramétré autour de Saturne
    function drawDisc(innerRadius, outerRadius, thetaSegments, phiSegments, thetaStart, thetaLength) {
        const geometry = new THREE.RingGeometry(3, 5, 32);
        const material = new THREE.MeshBasicMaterial({ color: 0xaaaaaa, side: THREE.DoubleSide });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.rotation.x = 1.2;
        Saturne.add(mesh);
    }

    // *************************************************************************************************
    // Les fonctions suivantes servent à se déplacer dans la simulation
    // Nous faisons varier la position de la caméra en fonction d'événements sur le clavier
    function onDocumentKeyDown(event) {
        // On repère la touche du clavier grâce à l'évènement keycode, qui sort son équivalent Ascii
        var keyCode = event.keyCode;
        switch (keyCode) {
            case 38: // flèche du haut : avant
                camera.position.set(camera.position.x, camera.position.y, camera.position.z - 0.01);
                break;
            case 40: // flèche du bas : arriere
                camera.position.set(camera.position.x, camera.position.y, camera.position.z + 0.01);
                break;
            case 77: // bouton m : bas
                camera.position.set(camera.position.x, camera.position.y - 0.003, camera.position.z);
                break;
            case 80: // bouton p : haut
                camera.position.set(camera.position.x, camera.position.y + 0.003, camera.position.z);
                break;
            case 37: // flèche du gauche : gauche
                camera.position.set(camera.position.x - 0.003, camera.position.y, camera.position.z);
                break;
            case 39: // flèche du droite : droite
                camera.position.set(camera.position.x + 0.003, camera.position.y, camera.position.z);
                break;
        }
    }
    //Ici on initialise ou actualise l'état d'une touche, appuyée ou non
    function onDocumentKeyUp(event) {
        var arrowKeys = {
            up: true,
            down: false
        };
        switch (event.keyCode) {
            case 38: // Up arrow
                arrowKeys.up = false;
                break;
            case 40: // Down arrow
                arrowKeys.down = true;
                break;
        }
    }
    document.addEventListener("keydown", onDocumentKeyDown, false);
    document.addEventListener("keyup", onDocumentKeyUp, false);

    function incrementCounter(nbAn, nbMois, nbJour) {
        var nbAn = TimeSpeed[currentIndex][0];
        var nbMois = TimeSpeed[currentIndex][1];
        var nbJour = TimeSpeed[currentIndex][2];
        counter = counter + ((365 * nbAn) + (30 * nbMois) + nbJour) / 20;
        console.log('nbAn : ' + nbAn);
        console.log('nbMois : ' + nbMois);
        console.log('nbJour : ' + nbJour);
        console.log('counter : ' + counter);
        return counter;
    }

    //console.log("date saisie : " + dateSaisie);

    if (run) {
        incrementCounter(TimeSpeed[currentIndex]);
    }

    console.log("currentIndex : " + currentIndex);
    console.log("timeSpeed : " + TimeSpeed[currentIndex]);

    t = earth.gapDate(dateSaisie ? dateSaisie : Date.now());

    for (let i = 0; i < ListPlanets.length; i++) {
        théta = ListPlanets[i].getThéta(t, counter);
        [x, z] = ListPlanets[i].findr(théta);
        r = ListPlanets[i].findr(théta);
        //console.log(ListPlanets[i].nom + ' z : ' + z);
        ListPlanets[i].drawEllipse(scene, théta, counter);
        ListPlanets[i].move(x, z);
        //ListPlanets[i].addLabel(x, z);
    }

    for (let i = 0; i < ListSatellites.length; i++) {
        théta = ListSatellites[i].getThéta(t, counter);
        [x, z] = ListSatellites[i].findr(théta);
        r = ListSatellites[i].findr(théta);
        ListSatellites[i].drawEllipse(Jupiter, théta, counter);
        ListSatellites[i].move(x, z);
    }

    théta = moon.getThéta(t, counter);
    [x, z] = moon.findr(théta);
    r = moon.findr(théta);
    moon.drawEllipse(Earth, théta, counter);
    moon.move(x, z);

    runTimeSpeed.textContent = TimeSpeedx[currentIndex];

    drawDisc(19, 20, 30, 10, 0, Math.PI * 2);
    renderer.render(scene, camera);
}