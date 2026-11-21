// ==========================================================================
// PROYECTO: DEFENSOR ESPACIAL 2D - VIDEOJUEGO PHASER MULTI-NIVEL
// CURSO: DESARROLLO DE VIDEOJUEGOS - UTP
// ESTUDIANTE / AUTOR: Aldair Jose Lozano Santiago
// ==========================================================================

var juego = new Phaser.Game(370, 850, Phaser.CANVAS, 'bloque_juego');

// Variables Globales
var fondoJuego;
var personaje;
var teclaDerecha;
var teclaIzquierda;
var teclaA;
var teclaD;
var botonDisparo;
var balas;
var tiempoBala = 0;
var enemigos;
var animacionEnemigos;
var explosiones;
var puntos = 0;
var vidas = 3;
var txtPuntos;
var txtVidas;
var txtNivel;
var txtEnemigos;
var nivelActual = 1;

// Variable de datos del estudiante
var nombreEstudiante = 'Aldair Jose Lozano Santiago';

// ==========================================================================
// 1. ESTADO PORTADA DE INICIO (Con Nombre y Apellido)
// ==========================================================================
var estadoPortada = {
    preload: function() {
        juego.load.image('fondo', 'img/fondo.png');
        juego.load.image('fondo2', 'img/fondo2.png');
        juego.load.spritesheet('nave', 'img/nave.png', 128, 128);
        juego.load.spritesheet('enemigo1', 'img/enemigo1.png', 80, 80);
        juego.load.spritesheet('enemigo2', 'img/enemigo2.png', 80, 80);
        juego.load.spritesheet('explosion', 'img/explosion.png', 64, 64);
        juego.load.image('laser', 'img/laser.png');
        juego.load.image('laser_enemigo', 'img/laser_enemigo.png');
    },

    create: function() {
        puntos = 0;
        vidas = 3;
        nivelActual = 1;

        // Fondo cósmico en movimiento
        this.fondo = juego.add.tileSprite(0, 0, 370, 850, 'fondo');

        // Capa translúcida para contraste
        var overlay = juego.add.graphics(0, 0);
        overlay.beginFill(0x050a18, 0.85);
        overlay.drawRect(0, 0, 370, 850);
        overlay.endFill();

        // Encabezado UTP
        var txtUTP = juego.add.text(juego.width / 2, 32, 'UTP • INGENIERÍA DE SISTEMAS', {
            font: 'bold 11px Arial',
            fill: '#f43f5e',
            letterSpacing: 2
        });
        txtUTP.anchor.setTo(0.5);

        // Título del juego
        var txtTitulo = juego.add.text(juego.width / 2, 70, 'DEFENSOR\nESPACIAL 2D', {
            font: 'bold 25px "Arial Black", Arial',
            fill: '#00e5ff',
            stroke: '#021e33',
            strokeThickness: 5,
            align: 'center'
        });
        txtTitulo.anchor.setTo(0.5);

        // Demos Animados de los nuevos sprites
        this.enemigo1Demo = juego.add.sprite(70, 160, 'enemigo1');
        this.enemigo1Demo.anchor.setTo(0.5);
        this.enemigo1Demo.scale.setTo(0.75);
        this.enemigo1Demo.animations.add('mov', [0, 1, 2, 3, 4, 5], 6, true).play();

        this.enemigo2Demo = juego.add.sprite(300, 160, 'enemigo2');
        this.enemigo2Demo.anchor.setTo(0.5);
        this.enemigo2Demo.scale.setTo(0.75);
        this.enemigo2Demo.animations.add('mov', [0, 1, 2, 3, 4, 5], 6, true).play();

        this.naveDemo = juego.add.sprite(juego.width / 2, 165, 'nave');
        this.naveDemo.anchor.setTo(0.5);
        this.naveDemo.scale.setTo(0.75);
        this.naveDemo.animations.add('vuelo', [0, 1, 2, 3, 4, 5], 10, true).play();

        // TARJETA DE IDENTIFICACIÓN: NOMBRE Y APELLIDO DEL ESTUDIANTE
        var boxNombre = juego.add.graphics(20, 225);
        boxNombre.beginFill(0x111c35, 0.95);
        boxNombre.lineStyle(2, 0x06b6d4, 1);
        boxNombre.drawRoundedRect(0, 0, 330, 85, 10);
        boxNombre.endFill();

        var lblAutor = juego.add.text(juego.width / 2, 245, '👤 ESTUDIANTE / AUTOR:', {
            font: 'bold 11px Arial',
            fill: '#94a3b8'
        });
        lblAutor.anchor.setTo(0.5);

        var nombreDisplay = window.getNombreJugador ? window.getNombreJugador() : nombreEstudiante;
        this.txtNombre = juego.add.text(juego.width / 2, 275, nombreDisplay, {
            font: 'bold 15px Arial',
            fill: '#38bdf8',
            stroke: '#082f49',
            strokeThickness: 3
        });
        this.txtNombre.anchor.setTo(0.5);

        // TARJETA DE REGLAS Y CONTROLES
        var boxInfo = juego.add.graphics(20, 325);
        boxInfo.beginFill(0x0f172a, 0.92);
        boxInfo.lineStyle(1, 0x334155, 1);
        boxInfo.drawRoundedRect(0, 0, 330, 195, 10);
        boxInfo.endFill();

        var lblControles = juego.add.text(juego.width / 2, 345, '🎮 REGLAS & NIVELES', {
            font: 'bold 12px Arial',
            fill: '#f59e0b'
        });
        lblControles.anchor.setTo(0.5);

        var infoTexto = 
            '• ⬅️ ➡️ o A / D : Desplazar Nave Espacial\n\n' +
            '• 🚀 ESPACIO / Clic : Disparar Ráfaga Láser\n\n' +
            '• 🚩 NIVEL 1 : 9 Exploradores Alienígenas\n\n' +
            '• 🔥 NIVEL 2 : 12 Destructores con Contraataque\n\n' +
            '• ❤️ Vidas: 3 Vidas | 💥 Colisión: +10 Puntos';

        juego.add.text(35, 370, infoTexto, {
            font: '11px Arial',
            fill: '#e2e8f0',
            lineSpacing: 2
        });

        // BOTÓN INICIAR JUEGO (NIVEL 1)
        var btnIniciar = juego.add.graphics(40, 545);
        btnIniciar.beginFill(0x059669);
        btnIniciar.lineStyle(3, 0x34d399, 1);
        btnIniciar.drawRoundedRect(0, 0, 290, 54, 12);
        btnIniciar.endFill();

        var txtBtn = juego.add.text(juego.width / 2, 572, '⚡ INICIAR MISIÓN ⚡', {
            font: 'bold 17px "Arial Black", Arial',
            fill: '#ffffff',
            stroke: '#064e3b',
            strokeThickness: 3
        });
        txtBtn.anchor.setTo(0.5);

        var txtHint = juego.add.text(juego.width / 2, 625, 'Presiona ESPACIO o ENTER para comenzar', {
            font: '11px Arial',
            fill: '#94a3b8'
        });
        txtHint.anchor.setTo(0.5);
        juego.add.tween(txtHint).to({ alpha: 0.3 }, 500, Phaser.Easing.Linear.None, true, 0, -1, true);

        // Eventos de inicio
        var rectBtn = new Phaser.Rectangle(40, 545, 290, 54);
        juego.input.onDown.add(function(pointer) {
            if (rectBtn.contains(pointer.x, pointer.y) || pointer.y > 520) {
                estadoPortada.iniciar();
            }
        });

        this.teclaEspacio = juego.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.teclaEnter = juego.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    },

    update: function() {
        this.fondo.tilePosition.y += 0.8;

        var t = juego.time.totalElapsedSeconds();
        this.naveDemo.y = 165 + Math.sin(t * 3.5) * 4;
        this.enemigo1Demo.y = 160 + Math.cos(t * 3.0) * 5;
        this.enemigo2Demo.y = 160 + Math.sin(t * 2.8) * 5;

        if (this.teclaEspacio.isDown || this.teclaEnter.isDown) {
            this.iniciar();
        }
    },

    iniciar: function() {
        if (typeof Sonidos !== 'undefined') {
            Sonidos.playDisparo();
            Sonidos.playBGM();
        }
        juego.state.start('nivel1');
    }
};

// ==========================================================================
// 2. ESTADO NIVEL 1: OLEADA DE EXPLORADORES (9 Invasores)
// ==========================================================================
var estadoNivel1 = {
    create: function() {
        nivelActual = 1;
        this.transicionando = false;

        // Fondo espacial nivel 1
        fondoJuego = juego.add.tileSprite(0, 0, 370, 850, 'fondo');

        // Nave del jugador
        personaje = juego.add.sprite(juego.width / 2, 740, 'nave');
        personaje.anchor.setTo(0.5, 0.5);
        personaje.scale.setTo(0.7);
        personaje.animations.add('vuelo', [0, 1, 2, 3, 4, 5], 12, true);
        personaje.animations.play('vuelo');
        juego.physics.arcade.enable(personaje);

        // Grupo de Disparos Láser del Jugador
        botonDisparo = juego.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        balas = juego.add.group();
        balas.enableBody = true;
        balas.physicsBodyType = Phaser.Physics.ARCADE;
        balas.createMultiple(30, 'laser');
        balas.setAll('anchor.x', 0.5);
        balas.setAll('anchor.y', 0.5);
        balas.setAll('outOfBoundsKill', true);
        balas.setAll('checkWorldBounds', true);

        // Pool de Explosiones
        explosiones = juego.add.group();
        for (var i = 0; i < 15; i++) {
            var exp = explosiones.create(0, 0, 'explosion');
            exp.anchor.setTo(0.5);
            exp.animations.add('boom', [0, 1, 2, 3, 4, 5, 6, 7], 20, false);
            exp.kill();
        }

        // Grupo de Enemigos Nivel 1 (Matriz 3x3)
        enemigos = juego.add.group();
        enemigos.enableBody = true;
        enemigos.physicsBodyType = Phaser.Physics.ARCADE;

        for (var y = 0; y < 3; y++) {
            for (var x = 0; x < 3; x++) {
                var enem = enemigos.create(x * 60, y * 55, 'enemigo1');
                enem.anchor.setTo(0.5);
                enem.scale.setTo(0.68);
                enem.animations.add('mov', [0, 1, 2, 3, 4, 5], 6, true).play();
            }
        }
        enemigos.x = 80;
        enemigos.y = 260;

        // Vaivén lateral con Tween
        animacionEnemigos = juego.add.tween(enemigos).to(
            { x: 170 },
            1300,
            Phaser.Easing.Linear.None,
            true,
            0,
            1000,
            true
        );

        // Controles
        teclaDerecha = juego.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        teclaIzquierda = juego.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        teclaA = juego.input.keyboard.addKey(Phaser.Keyboard.A);
        teclaD = juego.input.keyboard.addKey(Phaser.Keyboard.D);

        // HUD Superior
        var estiloHUD = { font: 'bold 13px Arial', fill: '#ffffff', stroke: '#000', strokeThickness: 3 };
        txtNivel = juego.add.text(15, 12, 'NIVEL: 1', { font: 'bold 13px Arial', fill: '#38bdf8', stroke: '#000', strokeThickness: 3 });
        txtPuntos = juego.add.text(juego.width / 2, 12, 'PUNTOS: ' + puntos, estiloHUD);
        txtPuntos.anchor.setTo(0.5, 0);
        txtEnemigos = juego.add.text(juego.width - 15, 12, 'INVASORES: 9', estiloHUD);
        txtEnemigos.anchor.setTo(1, 0);

        // Vidas y firma de autor
        txtVidas = juego.add.text(15, 32, 'VIDAS: ❤️❤️❤️', { font: 'bold 12px Arial', fill: '#ef4444' });
        var txtAutor = juego.add.text(juego.width / 2, 835, 'ALDAIR LOZANO S. - UTP', {
            font: 'bold 11px Arial', fill: '#00e5ff', stroke: '#000', strokeThickness: 2
        });
        txtAutor.anchor.setTo(0.5, 1);
    },

    update: function() {
        fondoJuego.tilePosition.y += 1.5;
        if (this.transicionando) return;

        // Movimiento de la Nave
        if (teclaDerecha.isDown || teclaD.isDown) {
            personaje.x += 4;
        } else if (teclaIzquierda.isDown || teclaA.isDown) {
            personaje.x -= 4;
        }

        // Límites de pantalla
        if (personaje.x < 35) personaje.x = 35;
        if (personaje.x > juego.width - 35) personaje.x = juego.width - 35;

        // Disparo Láser
        if (botonDisparo.isDown || juego.input.activePointer.isDown) {
            if (juego.time.now > tiempoBala) {
                var bala = balas.getFirstExists(false);
                if (bala) {
                    bala.reset(personaje.x, personaje.y - 35);
                    bala.body.velocity.y = -420;
                    tiempoBala = juego.time.now + 220;
                    if (typeof Sonidos !== 'undefined') Sonidos.playDisparo();
                }
            }
        }

        // Colisión Bala -> Invasor
        juego.physics.arcade.overlap(balas, enemigos, this.colisionBalaEnemigo, null, this);
    },

    colisionBalaEnemigo: function(bala, enemigo) {
        var ex = enemigo.x + enemigos.x;
        var ey = enemigo.y + enemigos.y;

        bala.kill();
        enemigo.kill();

        // Efecto visual de explosión
        var explosion = explosiones.getFirstExists(false);
        if (explosion) {
            explosion.reset(ex, ey);
            explosion.play('boom', 20, false, true);
        }

        // Sonido de colisión
        if (typeof Sonidos !== 'undefined') Sonidos.playColision();

        puntos += 10;
        txtPuntos.text = 'PUNTOS: ' + puntos;
        var vivos = enemigos.countLiving();
        txtEnemigos.text = 'INVASORES: ' + vivos;

        // Condición de Victoria de Nivel 1 -> Transición al Nivel 2
        if (vivos === 0 && !this.transicionando) {
            this.transicionando = true;
            if (typeof Sonidos !== 'undefined') Sonidos.playVictoria();

            var cartel = juego.add.text(juego.width / 2, 400, '¡NIVEL 1 COMPLETADO!\nPREPARANDO NIVEL 2...', {
                font: 'bold 20px "Arial Black", Arial',
                fill: '#00ffcc',
                stroke: '#000000',
                strokeThickness: 5,
                align: 'center'
            });
            cartel.anchor.setTo(0.5);

            juego.time.events.add(Phaser.Timer.SECOND * 1.8, function() {
                juego.state.start('nivel2');
            }, this);
        }
    }
};

// ==========================================================================
// 3. ESTADO NIVEL 2: DESTRUCTORES PESADOS CON CONTRAATAQUE (12 Invasores)
// ==========================================================================
var estadoNivel2 = {
    create: function() {
        nivelActual = 2;
        this.transicionando = false;
        this.siguienteDisparoEnemigo = juego.time.now + 1200;

        // Fondo espacial rojo acelerado
        fondoJuego = juego.add.tileSprite(0, 0, 370, 850, 'fondo2');

        // Nave del jugador
        personaje = juego.add.sprite(juego.width / 2, 740, 'nave');
        personaje.anchor.setTo(0.5, 0.5);
        personaje.scale.setTo(0.7);
        personaje.animations.add('vuelo', [0, 1, 2, 3, 4, 5], 14, true).play();
        juego.physics.arcade.enable(personaje);

        // Balas del Jugador
        balas = juego.add.group();
        balas.enableBody = true;
        balas.physicsBodyType = Phaser.Physics.ARCADE;
        balas.createMultiple(35, 'laser');
        balas.setAll('anchor.x', 0.5);
        balas.setAll('anchor.y', 0.5);
        balas.setAll('outOfBoundsKill', true);
        balas.setAll('checkWorldBounds', true);

        // Balas Enemigas (Láser Rojo)
        this.balasEnemigas = juego.add.group();
        this.balasEnemigas.enableBody = true;
        this.balasEnemigas.physicsBodyType = Phaser.Physics.ARCADE;
        this.balasEnemigas.createMultiple(20, 'laser_enemigo');
        this.balasEnemigas.setAll('anchor.x', 0.5);
        this.balasEnemigas.setAll('anchor.y', 0.5);
        this.balasEnemigas.setAll('outOfBoundsKill', true);
        this.balasEnemigas.setAll('checkWorldBounds', true);

        // Explosiones
        explosiones = juego.add.group();
        for (var i = 0; i < 20; i++) {
            var exp = explosiones.create(0, 0, 'explosion');
            exp.anchor.setTo(0.5);
            exp.animations.add('boom', [0, 1, 2, 3, 4, 5, 6, 7], 20, false);
            exp.kill();
        }

        // 12 Destructores Alienígenas (4 columnas x 3 filas)
        enemigos = juego.add.group();
        enemigos.enableBody = true;
        enemigos.physicsBodyType = Phaser.Physics.ARCADE;

        for (var y = 0; y < 3; y++) {
            for (var x = 0; x < 4; x++) {
                var enem = enemigos.create(x * 55, y * 52, 'enemigo2');
                enem.anchor.setTo(0.5);
                enem.scale.setTo(0.68);
                enem.animations.add('mov', [0, 1, 2, 3, 4, 5], 8, true).play();
            }
        }
        enemigos.x = 60;
        enemigos.y = 230;

        // Vaivén lateral más rápido
        animacionEnemigos = juego.add.tween(enemigos).to(
            { x: 145 },
            950,
            Phaser.Easing.Linear.None,
            true,
            0,
            1000,
            true
        );

        // HUD Nivel 2
        var estiloHUD = { font: 'bold 13px Arial', fill: '#ffffff', stroke: '#000', strokeThickness: 3 };
        txtNivel = juego.add.text(15, 12, 'NIVEL: 2 (ÉLITE)', { font: 'bold 13px Arial', fill: '#f59e0b', stroke: '#000', strokeThickness: 3 });
        txtPuntos = juego.add.text(juego.width / 2, 12, 'PUNTOS: ' + puntos, estiloHUD);
        txtPuntos.anchor.setTo(0.5, 0);
        txtEnemigos = juego.add.text(juego.width - 15, 12, 'DESTRUCTORES: 12', estiloHUD);
        txtEnemigos.anchor.setTo(1, 0);

        this.actualizarVidasHUD();

        var txtAutor = juego.add.text(juego.width / 2, 835, 'ALDAIR LOZANO S. - UTP', {
            font: 'bold 11px Arial', fill: '#00e5ff', stroke: '#000', strokeThickness: 2
        });
        txtAutor.anchor.setTo(0.5, 1);
    },

    actualizarVidasHUD: function() {
        var str = 'VIDAS: ';
        for (var i = 0; i < vidas; i++) str += '❤️';
        if (txtVidas) txtVidas.destroy();
        txtVidas = juego.add.text(15, 32, str, { font: 'bold 12px Arial', fill: '#ef4444' });
    },

    update: function() {
        fondoJuego.tilePosition.y += 2.8;
        if (this.transicionando) return;

        // Controles de Nave
        if (teclaDerecha.isDown || teclaD.isDown) {
            personaje.x += 4.5;
        } else if (teclaIzquierda.isDown || teclaA.isDown) {
            personaje.x -= 4.5;
        }

        if (personaje.x < 35) personaje.x = 35;
        if (personaje.x > juego.width - 35) personaje.x = juego.width - 35;

        // Disparo Jugador
        if (botonDisparo.isDown || juego.input.activePointer.isDown) {
            if (juego.time.now > tiempoBala) {
                var bala = balas.getFirstExists(false);
                if (bala) {
                    bala.reset(personaje.x, personaje.y - 35);
                    bala.body.velocity.y = -450;
                    tiempoBala = juego.time.now + 210;
                    if (typeof Sonidos !== 'undefined') Sonidos.playDisparo();
                }
            }
        }

        // Contraataque enemigo: Disparo láser rojo aleatorio
        if (juego.time.now > this.siguienteDisparoEnemigo && enemigos.countLiving() > 0) {
            this.dispararLaserEnemigo();
            this.siguienteDisparoEnemigo = juego.time.now + 1100;
        }

        // Colisión Balas Jugador -> Destructores
        juego.physics.arcade.overlap(balas, enemigos, this.colisionBalaEnemigo, null, this);

        // Colisión Balas Enemigas -> Nave Jugador
        juego.physics.arcade.overlap(this.balasEnemigas, personaje, this.impactoJugador, null, this);
    },

    dispararLaserEnemigo: function() {
        var vivos = [];
        enemigos.forEachAlive(function(enem) { vivos.push(enem); });
        if (vivos.length === 0) return;

        var tirador = Phaser.ArrayUtils.getRandomItem(vivos);
        var balaEnem = this.balasEnemigas.getFirstExists(false);
        if (balaEnem) {
            balaEnem.reset(tirador.x + enemigos.x, tirador.y + enemigos.y + 20);
            balaEnem.body.velocity.y = 280;
            if (typeof Sonidos !== 'undefined') Sonidos.playLaserEnemigo();
        }
    },

    colisionBalaEnemigo: function(bala, enemigo) {
        var ex = enemigo.x + enemigos.x;
        var ey = enemigo.y + enemigos.y;

        bala.kill();
        enemigo.kill();

        var explosion = explosiones.getFirstExists(false);
        if (explosion) {
            explosion.reset(ex, ey);
            explosion.play('boom', 20, false, true);
        }

        if (typeof Sonidos !== 'undefined') Sonidos.playColision();

        puntos += 15;
        txtPuntos.text = 'PUNTOS: ' + puntos;
        var restantes = enemigos.countLiving();
        txtEnemigos.text = 'DESTRUCTORES: ' + restantes;

        // Victoria Final
        if (restantes === 0 && !this.transicionando) {
            this.transicionando = true;
            if (typeof Sonidos !== 'undefined') Sonidos.playVictoria();
            juego.time.events.add(Phaser.Timer.SECOND * 1.5, function() {
                juego.state.start('ganaste');
            }, this);
        }
    },

    impactoJugador: function(personaje, balaEnem) {
        balaEnem.kill();
        vidas--;
        this.actualizarVidasHUD();

        // Explosión de impacto
        var explosion = explosiones.getFirstExists(false);
        if (explosion) {
            explosion.reset(personaje.x, personaje.y);
            explosion.play('boom', 20, false, true);
        }

        if (typeof Sonidos !== 'undefined') Sonidos.playColision();
        juego.camera.shake(0.015, 200);

        if (vidas <= 0 && !this.transicionando) {
            this.transicionando = true;
            personaje.kill();
            if (typeof Sonidos !== 'undefined') Sonidos.playDerrota();
            juego.time.events.add(Phaser.Timer.SECOND * 1.5, function() {
                juego.state.start('perdiste');
            }, this);
        }
    }
};

// ==========================================================================
// 4. ESTADO GANASTE: PANTALLA DE VICTORIA TOTAL
// ==========================================================================
var estadoGanaste = {
    create: function() {
        var fondo = juego.add.tileSprite(0, 0, 370, 850, 'fondo');
        var overlay = juego.add.graphics(0, 0);
        overlay.beginFill(0x041324, 0.9);
        overlay.drawRect(0, 0, 370, 850);
        overlay.endFill();

        var txtVic = juego.add.text(juego.width / 2, 160, '🏆 ¡MISIÓN CUMPLIDA! 🏆', {
            font: 'bold 22px "Arial Black", Arial', fill: '#00ffcc', stroke: '#064e3b', strokeThickness: 5, align: 'center'
        });
        txtVic.anchor.setTo(0.5);

        var txtSub = juego.add.text(juego.width / 2, 210, '¡La Flota Invasora ha sido Aniquilada!\nHas Salvado la Galaxia', {
            font: 'bold 13px Arial', fill: '#ffeb3b', align: 'center'
        });
        txtSub.anchor.setTo(0.5);

        // Tarjeta de Resultados
        var boxRes = juego.add.graphics(25, 260);
        boxRes.beginFill(0x131f37, 0.95);
        boxRes.lineStyle(2, 0x10b981, 1);
        boxRes.drawRoundedRect(0, 0, 320, 190, 10);
        boxRes.endFill();

        juego.add.text(juego.width / 2, 285, 'PILOTO DEFENSOR:', { font: 'bold 11px Arial', fill: '#94a3b8' }).anchor.setTo(0.5);
        juego.add.text(juego.width / 2, 312, nombreEstudiante, { font: 'bold 16px Arial', fill: '#38bdf8' }).anchor.setTo(0.5);

        juego.add.text(juego.width / 2, 360, 'PUNTAJE FINAL: ' + puntos + ' PTS', { font: 'bold 20px "Arial Black", Arial', fill: '#ffffff' }).anchor.setTo(0.5);
        juego.add.text(juego.width / 2, 400, 'VIDAS RESTANTES: ' + vidas + ' ❤️', { font: 'bold 13px Arial', fill: '#f87171' }).anchor.setTo(0.5);

        // Botón Jugar de Nuevo
        var btn = juego.add.graphics(45, 480);
        btn.beginFill(0x059669);
        btn.lineStyle(2, 0x34d399, 1);
        btn.drawRoundedRect(0, 0, 280, 52, 10);
        btn.endFill();

        var txtBtn = juego.add.text(juego.width / 2, 506, '↺ JUGAR DE NUEVO', { font: 'bold 16px "Arial Black", Arial', fill: '#ffffff' });
        txtBtn.anchor.setTo(0.5);

        var hitRect = new Phaser.Rectangle(45, 480, 280, 52);
        juego.input.onDown.addOnce(function(p) {
            juego.state.start('portada');
        });

        var teclaR = juego.input.keyboard.addKey(Phaser.Keyboard.R);
        var teclaEsp = juego.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        var checkReset = function() {
            if (teclaR.isDown || teclaEsp.isDown) juego.state.start('portada');
        };
        juego.time.events.loop(100, checkReset, this);
    }
};

// ==========================================================================
// 5. ESTADO PERDISTE: PANTALLA DE REINTENTAR
// ==========================================================================
var estadoPerdiste = {
    create: function() {
        var fondo = juego.add.tileSprite(0, 0, 370, 850, 'fondo2');
        var overlay = juego.add.graphics(0, 0);
        overlay.beginFill(0x1a0505, 0.9);
        overlay.drawRect(0, 0, 370, 850);
        overlay.endFill();

        var txtPer = juego.add.text(juego.width / 2, 180, '💀 MISIÓN FALLIDA 💀', {
            font: 'bold 24px "Arial Black", Arial', fill: '#ef4444', stroke: '#450a0a', strokeThickness: 5, align: 'center'
        });
        txtPer.anchor.setTo(0.5);

        var txtSub = juego.add.text(juego.width / 2, 230, 'Tu nave ha sido destruida en combate.', {
            font: 'bold 14px Arial', fill: '#fca5a5', align: 'center'
        });
        txtSub.anchor.setTo(0.5);

        var boxRes = juego.add.graphics(25, 280);
        boxRes.beginFill(0x271010, 0.95);
        boxRes.lineStyle(2, 0xef4444, 1);
        boxRes.drawRoundedRect(0, 0, 320, 140, 10);
        boxRes.endFill();

        juego.add.text(juego.width / 2, 305, 'PILOTO: ' + nombreEstudiante, { font: 'bold 13px Arial', fill: '#fecaca' }).anchor.setTo(0.5);
        juego.add.text(juego.width / 2, 345, 'PUNTOS ACUMULADOS: ' + puntos, { font: 'bold 18px Arial', fill: '#ffffff' }).anchor.setTo(0.5);
        juego.add.text(juego.width / 2, 385, 'Alcanzaste el Nivel ' + nivelActual, { font: 'bold 12px Arial', fill: '#f87171' }).anchor.setTo(0.5);

        var btn = juego.add.graphics(45, 460);
        btn.beginFill(0xd97706);
        btn.lineStyle(2, 0xfbbf24, 1);
        btn.drawRoundedRect(0, 0, 280, 52, 10);
        btn.endFill();

        var txtBtn = juego.add.text(juego.width / 2, 486, '↺ REINTENTAR MISIÓN', { font: 'bold 16px "Arial Black", Arial', fill: '#ffffff' });
        txtBtn.anchor.setTo(0.5);

        juego.input.onDown.addOnce(function(p) {
            juego.state.start('portada');
        });

        var teclaR = juego.input.keyboard.addKey(Phaser.Keyboard.R);
        var teclaEsp = juego.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        var checkReset = function() {
            if (teclaR.isDown || teclaEsp.isDown) juego.state.start('portada');
        };
        juego.time.events.loop(100, checkReset, this);
    }
};

// ==========================================================================
// REGISTRO DE TODOS LOS ESTADOS PHASER
// ==========================================================================
juego.state.add('portada', estadoPortada);
juego.state.add('nivel1', estadoNivel1);
juego.state.add('nivel2', estadoNivel2);
juego.state.add('ganaste', estadoGanaste);
juego.state.add('perdiste', estadoPerdiste);

// Inicializa mostrando la Portada con Nombre y Apellido
juego.state.start('portada');
