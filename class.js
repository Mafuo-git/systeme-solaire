//On créé une classe Planets qui contient toutes les informations pour la simulation 
class Planets {
    constructor(nom, index, volume, vitesse, distanceSoleil, color, revolution, aphelie, perihelie, angleInitial) {
        this.nom = nom;
        this.index = index;
        this.volume = volume;
        this.vitesse = vitesse;
        this.distanceSoleil = distanceSoleil;
        this.color = color;
        this.revolution = revolution;
        this.aphelie = aphelie;
        this.perihelie = perihelie;
        this.angleInitial = angleInitial;
    }
    gapDate(dateSaisie, counter) {
        // On saisie notre date de référence et notre date de saisie
        const t0 = new Date('January 4, 2023');
        const date2 = new Date(dateSaisie);

        //console.log('date de référence t0 : ' + t0);
        //console.log('date de saisie : ' + date2);
        //console.log(t0.getDate() + ' jours, ' + t0.getMonth() + ' mois, ' + t0.getFullYear() + ' an');
        //console.log(date2.getDate() + ' jours, ' + date2.getMonth() + ' mois, ' + date2.getFullYear() + ' an');

        // On calcule le nombre de jours qui se sont écoulés entre ces deux dates
        var t = (date2.getTime() - t0.getTime()) / (1000 * 3600 * 24);
        //console.log((t) + ' jours de différence');

        return t;
    }
    getThéta(t, counter) {
        var angle = (2 * Math.PI) / this.revolution;
        var théta = ((t + counter) * angle + this.angleInitial) % 2 * Math.PI;
        //console.log('théta vaut : ' + théta);

        return théta;
    }
    findr(théta) {
        var r;
        var r2 = this.aphelie - this.perihelie;
        switch (true) {
            case théta <= 180:
                r = this.perihelie + (théta / 180) * r2;
                break;
            default:
                r = this.aphelie - ((théta - 180) / 180) * r2;
                break;
        }
        //console.log("Theta: " + théta + "°, et r : " + r);

        var x = r * Math.cos(théta) * this.distanceSoleil;
        var z = r * Math.sin(théta) * this.distanceSoleil;
        //console.log('x : ' + x);
        //console.log('z : ' + z);

        return [x, z];
    }
    drawEllipse(scene, théta, counter) {
        let startAngle = -théta;
        let endAngle = startAngle + 2 * Math.PI / 3;
        const curve = new THREE.EllipseCurve(0, 0, this.distanceSoleil, this.distanceSoleil, startAngle, endAngle, false, 0);
        const points = curve.getPoints(100);

        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        // On indique que la ligne sera de la couleur associée à la planète, et que ces traits seront transparents à 80%
        const material = new THREE.LineBasicMaterial({ color: this.color, transparent: true, opacity: 0.4 });
        const ellipse = new THREE.Line(geometry, material);
        ellipse.rotation.x = -Math.PI / 2; // On ajoute une rotation autour de l'axe x pour remettre l'ellipse dans le bon plan

        if (this.ellipse) {
            scene.remove(this.ellipse);
        }
        if (this.index === 11 || 12 || 13 || 14) {
            Jupiter.add(ellipse);
        }
        if (this.index === 10) {
            Earth.add(ellipse);
        }
        else {
            scene.add(ellipse);
        }
        this.ellipse = ellipse
    }
    move(x, z) {
        switch (this.index) {
            case 1:
                Mercure.position.x = x;
                Mercure.position.z = z;
                break;
            case 2:
                Venus.position.x = x;
                Venus.position.z = z;
                break;
            case 3:
                Earth.position.x = x;
                Earth.position.z = z;
                break;
            case 4:
                Mars.position.x = x;
                Mars.position.z = z;
                break;
            case 5:
                Jupiter.position.x = x;
                Jupiter.position.z = z;
                break;
            case 6:
                Saturne.position.x = x;
                Saturne.position.z = z;
                break;
            case 7:
                Uranus.position.x = x;
                Uranus.position.z = z;
                break;
            case 8:
                Neptune.position.x = x;
                Neptune.position.z = z;
                break;
            case 10:
                Moon.position.x = x;
                Moon.position.z = z;
                break;
                break;
            case 11:
                Io.position.x = x;
                Io.position.z = z;
                break;
            case 12:
                Europa.position.x = x;
                Europa.position.z = z;
                break;
                break;
            case 13:
                Ganymede.position.x = x;
                Ganymede.position.z = z;
                break;
            case 14:
                Callisto.position.x = x;
                Callisto.position.z = z;
                break;
        }


    }
    /*addLabel(x, z) {
        const distanceCamera = camera.position.distanceTo(scene.position); // Distance entre la caméra et l'objet
        const labelCanvas = document.createElement('canvas');
        const context = labelCanvas.getContext('2d');
        const fontSize = Math.round(distanceCamera * 2); // Taille de police proportionnelle à la distance
        const canvasSize = Math.ceil(fontSize * 4);

        labelCanvas.width = canvasSize;
        labelCanvas.height = canvasSize;

        context.font = `${fontSize}px Verdana`;
        context.fillStyle = '#ffffff';
        context.backgound_color = transparent;
        context.fillText(this.nom, 0, fontSize);

        const labelTexture = new THREE.CanvasTexture(labelCanvas);
        const labelMaterial = new THREE.SpriteMaterial({ map: labelTexture });
        const labelSprite = new THREE.Sprite(labelMaterial);
        labelSprite.position.x = x;
        labelSprite.position.z = z;
        labelSprite.position.y += 4;

        labelSprite.quaternion.copy(camera.quaternion);

        if (this.labelSprite) {
            scene.remove(this.labelSprite);
        }

        scene.add(labelSprite);
        this.labelSprite = labelSprite;

        labelTexture.needsUpdate = true; // Mettre à jour la texture du texte
    }*/
}

class Asteroid {
    constructor(minRadius, maxRadius, sizeAsteroids, vitesse) {
        this.vitesse = vitesse;
        this.minRadius = minRadius;
        this.maxRadius = maxRadius;
        this.sizeAsteroids = sizeAsteroids;
    }
    generateAsteroid(scene) {
        var geometry = new THREE.SphereGeometry(Math.random() * this.sizeAsteroids, 32, 32);
        var material = new THREE.MeshBasicMaterial({ color: 0x808080, transparent: true, opacity: 0.4 });
        var asteroid = new THREE.Mesh(geometry, material);

        // Génération d'un rayon aléatoire entre minRadius et maxRadius
        var radius = Math.random() * (this.maxRadius - this.minRadius) + this.minRadius;
        // Angle aléatoire en radians
        var angle = Math.random() * (Math.PI * 2);
        // Calcul des coordonnées cartésiennes à partir des coordonnées polaires
        asteroid.position.x = Math.cos(angle) * radius;
        asteroid.position.y = Math.random() * 7 - 5;
        asteroid.position.z = Math.sin(angle) * radius;
        return asteroid;
    }
}
