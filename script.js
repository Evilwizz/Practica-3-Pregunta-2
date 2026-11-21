// ==========================================================================
// PROYECTO: JUEGO DE DISPAROS ESPACIAL 2D - PHASER
// CURSO: DESARROLLO DE VIDEOJUEGOS - UTP
// ESTUDIANTE: Aldair Jose Lozano Santiago
// ==========================================================================

// Inicialización de la pantalla del juego (370 x 850)
var juego = new Phaser.Game(370, 850, Phaser.CANVAS, 'bloque_juego');

// Variables globales del juego (según diapositivas de clase)
var fondoJuego;
var personaje;
var teclaDerecha;
var teclaIzquierda;
var enemigos;
var balas;
var tiempoBala = 0;
var botonDisparo;
var puntos = 0;
var txtPuntos;
var txtEnemigos;
var animacion;
var juegoTerminado = false;

// Nombre del estudiante para mostrar en la Portada y en el HUD
var nombreEstudiante = 'Aldair Jose Lozano Santiago';

// ==========================================================================
// 1. ESTADO PORTADA DE INICIO (Con Nombre y Apellido)
// ==========================================================================
var estadoPortada = {
    preload: function() {
        // Carga de recursos
        juego.load.image('fondo', 'img1.png');
        juego.load.spritesheet('jugador', 'jugador.png', 128, 128);
        juego.load.spritesheet('enemigo', 'enemigo.png', 80, 80);
        juego.load.image('laser', 'laser.png');
    },

    create: function() {
        juegoTerminado = false;

        // Fondo animado en movimiento
        this.fondo = juego.add.tileSprite(0, 0, 370, 850, 'fondo');

        // Capa translúcida para contraste y estética
        var overlay = juego.add.graphics(0, 0);
        overlay.beginFill(0x070b19, 0.82);
        overlay.drawRect(0, 0, 370, 850);
        overlay.endFill();

        // Encabezado UTP
        var estiloSub = { font: 'bold 11px Arial', fill: '#f43f5e', letterSpacing: 2 };
        var txtUTP = juego.add.text(juego.width / 2, 35, 'UTP • VIDEOJUEGOS 2D', estiloSub);
        txtUTP.anchor.setTo(0.5);

        // Título Principal
        var estiloTitulo = {
            font: 'bold 24px "Arial Black", Arial',
            fill: '#00e5ff',
            stroke: '#021e33',
            strokeThickness: 5,
            align: 'center'
        };
        var txtTitulo = juego.add.text(juego.width / 2, 70, 'DEFENSOR\nESPACIAL 2D', estiloTitulo);
        txtTitulo.anchor.setTo(0.5);

        // ================= Demos Animados =================
        // Enemigo izquierdo
        this.enemigoDemo1 = juego.add.sprite(75, 160, 'enemigo');
        this.enemigoDemo1.anchor.setTo(0.5);
        this.enemigoDemo1.scale.setTo(0.7);
        this.enemigoDemo1.animations.add('mov', [0, 1, 2, 3, 4, 5], 6, true).play();

        // Enemigo derecho
        this.enemigoDemo2 = juego.add.sprite(295, 160, 'enemigo');
        this.enemigoDemo2.anchor.setTo(0.5);
        this.enemigoDemo2.scale.setTo(0.7);
        this.enemigoDemo2.animations.add('mov', [0, 1, 2, 3, 4, 5], 6, true).play();

        // Nave del jugador en el centro
        this.jugadorDemo = juego.add.sprite(juego.width / 2, 165, 'jugador');
        this.jugadorDemo.anchor.setTo(0.5);
        this.jugadorDemo.scale.setTo(0.85);
        this.jugadorDemo.animations.add('mov', [0, 1, 2, 3, 4, 5], 8, true).play();

        // ================= TARJETA DE NOMBRE Y APELLIDO =================
        var boxNombre = juego.add.graphics(25, 230);
        boxNombre.beginFill(0x131f37, 0.95);
        boxNombre.lineStyle(2, 0x06b6d4, 1);
        boxNombre.drawRoundedRect(0, 0, 320, 85, 10);
        boxNombre.endFill();

        var lblAutor = juego.add.text(juego.width / 2, 252, '👤 ESTUDIANTE / AUTOR:', {
            font: 'bold 11px Arial',
            fill: '#94a3b8'
        });
        lblAutor.anchor.setTo(0.5);

        var nombreDisplay = window.getNombreJugador ? window.getNombreJugador() : nombreEstudiante;
        this.txtNombre = juego.add.text(juego.width / 2, 282, nombreDisplay, {
            font: 'bold 15px Arial',
            fill: '#38bdf8',
            stroke: '#082f49',
            strokeThickness: 3
        });
        this.txtNombre.anchor.setTo(0.5);

        // ================= TARJETA DE CONTROLES E INSTRUCCIONES =================
        var boxInfo = juego.add.graphics(25, 335);
        boxInfo.beginFill(0x0f172a, 0.92);
        boxInfo.lineStyle(1, 0x334155, 1);
        boxInfo.drawRoundedRect(0, 0, 320, 185, 10);
        boxInfo.endFill();

        var lblControles = juego.add.text(juego.width / 2, 355, '🎮 CONTROLES & REGLAS', {
            font: 'bold 12px Arial',
            fill: '#f59e0b'
        });
        lblControles.anchor.setTo(0.5);

        var textoInfo = 
            '• ⬅️ / ➡️  o  A / D : Mover Nave\n\n' +
            '• 🚀 ESPACIO / Clic : Disparar Láser\n\n' +
            '• 👾 Invasores : 9 enemigos en movimiento\n\n' +
            '• 💥 Colisión : Destruye al invasor (+10 pts)\n\n' +
            '• 🏆 Elimina a todos para alcanzar la VICTORIA!';

        juego.add.text(40, 380, textoInfo, {
            font: '11px Arial',
            fill: '#e2e8f0',
            lineSpacing: 2
        });

        // ================= BOTÓN INICIAR JUEGO =================
        var btnIniciar = juego.add.graphics(45, 545);
        btnIniciar.beginFill(0x059669);
        btnIniciar.lineStyle(3, 0x34d399, 1);
        btnIniciar.drawRoundedRect(0, 0, 280, 52, 12);
        btnIniciar.endFill();

        var txtBtn = juego.add.text(juego.width / 2, 571, '⚡ INICIAR JUEGO ⚡', {
            font: 'bold 17px "Arial Black", Arial',
            fill: '#ffffff',
            stroke: '#064e3b',
            strokeThickness: 3
        });
        txtBtn.anchor.setTo(0.5);

        // Texto parpadeante
        var txtComenzar = juego.add.text(juego.width / 2, 622, 'Presiona ESPACIO o ENTER para jugar', {
            font: '11px Arial',
            fill: '#94a3b8'
        });
        txtComenzar.anchor.setTo(0.5);
        juego.add.tween(txtComenzar).to({ alpha: 0.3 }, 500, Phaser.Easing.Linear.None, true, 0, -1, true);

        // Teclas para comenzar
        this.teclaEspacio = juego.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.teclaEnter = juego.input.keyboard.addKey(Phaser.Keyboard.ENTER);

        // Clic / Toque para comenzar
        var rectBoton = new Phaser.Rectangle(45, 545, 280, 52);
        juego.input.onDown.add(function(pointer) {
            if (rectBoton.contains(pointer.x, pointer.y) || pointer.y > 520) {
                estadoPortada.iniciar();
            }
        });
    },

    update: function() {
        this.fondo.tilePosition.x -= 0.6;

        // Efecto flotante en los personajes de portada
        var t = juego.time.totalElapsedSeconds();
        this.jugadorDemo.y = 165 + Math.sin(t * 3.2) * 4;
        this.enemigoDemo1.y = 160 + Math.cos(t * 3.0) * 5;
        this.enemigoDemo2.y = 160 + Math.sin(t * 2.8) * 5;

        // Iniciar con teclado
        if (this.teclaEspacio.isDown || this.teclaEnter.isDown) {
            this.iniciar();
        }
    },

    actualizarNombre: function(nuevoNombre) {
        if (this.txtNombre) {
            this.txtNombre.text = nuevoNombre;
        }
    },

    iniciar: function() {
        if (typeof Sonidos !== 'undefined') {
            Sonidos.playDisparo();
            Sonidos.playBGM();
        }
        juego.state.start('principal');
    }
};

// ==========================================================================
// 2. ESTADO PRINCIPAL (Disparos, Colisiones y Sonidos)
// ==========================================================================
var estadoPrincipal = {
    preload: function() {
        // Carga de recursos (según diapositivas de clase)
        juego.load.image('fondo', 'img1.png');
        juego.load.spritesheet('jugador', 'jugador.png', 128, 128);
        juego.load.spritesheet('enemigo', 'enemigo.png', 80, 80);
        juego.load.image('laser', 'laser.png');
    },

    create: function() {
        juegoTerminado = false;
        puntos = 0;

        // 1. Fondo con movimiento
        fondoJuego = juego.add.tileSprite(0, 0, 370, 850, 'fondo');

        // 2. Personaje Jugador
        personaje = juego.add.sprite(juego.width / 2, 730, 'jugador');
        personaje.anchor.setTo(0.5, 0.5);
        personaje.animations.add('movimiento', [0, 1, 2, 3, 4, 5], 10, true);

        // 3. Sistema de Balas / Disparos (de la diapositiva UTP)
        botonDisparo = juego.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        balas = juego.add.group();
        balas.enableBody = true;
        balas.physicsBodyType = Phaser.Physics.ARCADE;
        balas.createMultiple(30, 'laser');
        balas.setAll('anchor.x', 0.5);
        balas.setAll('anchor.y', 0.5);
        balas.setAll('outOfBoundsKill', true);
        balas.setAll('checkWorldBounds', true);

        // 4. Grupo de Enemigos (cuadrícula 3x3 de la diapositiva UTP)
        enemigos = juego.add.group();
        enemigos.enableBody = true;
        enemigos.physicsBodyType = Phaser.Physics.ARCADE;

        for (var y = 0; y < 3; y++) {
            for (var x = 0; x < 3; x++) {
                var enemig = enemigos.create(x * 55, y * 55, 'enemigo');
                enemig.anchor.setTo(0.5);
                enemig.scale.setTo(0.65);
                enemig.animations.add('movimiento', [0, 1, 2, 3, 4, 5], 6, true);
                enemig.animations.play('movimiento');
            }
        }
        enemigos.x = 85;
        enemigos.y = 280;

        // Animación Tween lateral para los enemigos
        animacion = juego.add.tween(enemigos).to(
            { x: 175 },
            1200,
            Phaser.Easing.Linear.None,
            true,
            0,
            1000,
            true
        );

        // 5. Controles de Teclado
        teclaDerecha = juego.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        teclaIzquierda = juego.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        this.teclaA = juego.input.keyboard.addKey(Phaser.Keyboard.A);
        this.teclaD = juego.input.keyboard.addKey(Phaser.Keyboard.D);

        // 6. HUD / Marcador en pantalla
        var estiloHUD = {
            font: 'bold 13px Arial',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3
        };
        txtPuntos = juego.add.text(15, 15, 'PUNTOS: 0', estiloHUD);

        txtEnemigos = juego.add.text(juego.width - 15, 15, 'ENEMIGOS: 9', estiloHUD);
        txtEnemigos.anchor.setTo(1, 0);

        // Marca de agua con el nombre del estudiante
        var estiloFirma = {
            font: 'bold 11px Arial',
            fill: '#00e5ff',
            stroke: '#000000',
            strokeThickness: 2
        };
        var txtFirma = juego.add.text(juego.width / 2, 835, 'ALDAIR LOZANO S. - UTP', estiloFirma);
        txtFirma.anchor.setTo(0.5, 1);
    },

    update: function() {
        // Desplazamiento del fondo
        fondoJuego.tilePosition.x -= 1;

        if (juegoTerminado) return;

        // Movimiento del personaje hacia la derecha
        if (teclaDerecha.isDown || this.teclaD.isDown) {
            personaje.x += 3.5;
            personaje.animations.play('movimiento');
        }
        // Movimiento del personaje hacia la izquierda
        else if (teclaIzquierda.isDown || this.teclaA.isDown) {
            personaje.x -= 3.5;
            personaje.animations.play('movimiento');
        }
        // Reposo
        else {
            personaje.animations.stop();
            personaje.frame = 0;
        }

        // Delimitadores de pantalla para el personaje
        if (personaje.x < 35) personaje.x = 35;
        if (personaje.x > juego.width - 35) personaje.x = juego.width - 35;

        // ================= SISTEMA DE DISPARO =================
        var bala;
        // Permite disparar con Barra Espaciadora o clic del ratón / toque
        if (botonDisparo.isDown || juego.input.activePointer.isDown) {
            if (juego.time.now > tiempoBala) {
                bala = balas.getFirstExists(false);
                if (bala) {
                    // Posiciona la bala en el centro superior del personaje
                    bala.reset(personaje.x, personaje.y - 45);
                    bala.body.velocity.y = -380;
                    tiempoBala = juego.time.now + 240;

                    // Reproducir sonido de disparo
                    if (typeof Sonidos !== 'undefined') {
                        Sonidos.playDisparo();
                    }
                }
            }
        }

        // ================= DETECCIÓN DE COLISIONES =================
        // Detección física entre balas y el grupo de enemigos
        juego.physics.arcade.overlap(balas, enemigos, colision, null, this);
    }
};

// ==========================================================================
// 3. FUNCIÓN DE COLISIÓN (Impacto Bala -> Enemigo + Sonido de Colisión)
// ==========================================================================
function colision(bala, enemigo) {
    // Destruye la bala y el enemigo impactado
    bala.kill();
    enemigo.kill();

    // Reproducir Sonido de Colisión / Explosión
    if (typeof Sonidos !== 'undefined') {
        Sonidos.playColision();
    }

    // Aumentar puntaje
    puntos += 10;
    if (txtPuntos) {
        txtPuntos.text = 'PUNTOS: ' + puntos;
    }

    var restantes = enemigos.countLiving();
    if (txtEnemigos) {
        txtEnemigos.text = 'ENEMIGOS: ' + restantes;
    }

    // Verificar si se eliminaron todos los enemigos
    if (restantes === 0 && !juegoTerminado) {
        juegoTerminado = true;
        if (typeof Sonidos !== 'undefined') {
            Sonidos.playVictoria();
        }
        mostrarPantallaVictoria();
    }
}

// ==========================================================================
// 4. PANTALLA DE VICTORIA Y REINICIO
// ==========================================================================
function mostrarPantallaVictoria() {
    var overlay = juego.add.graphics(0, 0);
    overlay.beginFill(0x0a0f1d, 0.88);
    overlay.drawRect(0, 0, juego.width, juego.height);
    overlay.endFill();

    var estiloVic = {
        font: 'bold 26px "Arial Black", Arial',
        fill: '#00ffcc',
        stroke: '#064e3b',
        strokeThickness: 5,
        align: 'center'
    };
    var txtVic = juego.add.text(juego.width / 2, 280, '¡VICTORIA!', estiloVic);
    txtVic.anchor.setTo(0.5);

    var estiloSub = { font: 'bold 14px Arial', fill: '#ffeb3b', align: 'center' };
    var txtSub = juego.add.text(juego.width / 2, 320, '¡Todos los Invasores Eliminados!', estiloSub);
    txtSub.anchor.setTo(0.5);

    var estiloNom = { font: 'bold 15px Arial', fill: '#38bdf8' };
    var txtNom = juego.add.text(juego.width / 2, 380, 'Estudiante: ' + nombreEstudiante, estiloNom);
    txtNom.anchor.setTo(0.5);

    var estiloPts = { font: 'bold 20px Arial', fill: '#ffffff' };
    var txtPts = juego.add.text(juego.width / 2, 420, 'PUNTAJE: ' + puntos + ' PTS', estiloPts);
    txtPts.anchor.setTo(0.5);

    // Botón Jugar de Nuevo
    var btnVolver = juego.add.graphics(juego.width / 2 - 110, 480);
    btnVolver.beginFill(0x10b981);
    btnVolver.lineStyle(2, 0x34d399, 1);
    btnVolver.drawRoundedRect(0, 0, 220, 50, 10);
    btnVolver.endFill();

    var txtBtn = juego.add.text(juego.width / 2, 505, '↺ VOLVER A JUGAR', {
        font: 'bold 15px Arial',
        fill: '#ffffff'
    });
    txtBtn.anchor.setTo(0.5);

    var rectVolver = new Phaser.Rectangle(juego.width / 2 - 110, 480, 220, 50);
    juego.input.onDown.addOnce(function(pointer) {
        juego.state.start('portada');
    });

    var teclaR = juego.input.keyboard.addKey(Phaser.Keyboard.R);
    var teclaEsp = juego.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    var teclaEnt = juego.input.keyboard.addKey(Phaser.Keyboard.ENTER);

    var revisarReinicio = function() {
        if (teclaR.isDown || teclaEsp.isDown || teclaEnt.isDown) {
            juego.state.start('portada');
        }
    };
    juego.time.events.loop(100, revisarReinicio, this);
}

// ==========================================================================
// 5. REGISTRO Y LANZAMIENTO DE ESTADOS
// ==========================================================================
juego.state.add('portada', estadoPortada);
juego.state.add('principal', estadoPrincipal);

// Inicia mostrando la Portada de Inicio con el Nombre y Apellido
juego.state.start('portada');
