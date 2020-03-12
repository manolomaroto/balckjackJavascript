const miModulo = (() => {
    let deck = [],
        puntosJugadores = [];
    const tipos = ['C', 'D', 'H', 'S'],
        especiales = ['A', 'J', 'Q', 'K'];

    // referencias HTML
    const btnPedir = document.querySelector('#btnPedir'),
        btnDetener = document.querySelector('#btnDetener'),
        btnNuevo = document.querySelector('#btnNuevo'),

        puntosHtml = document.querySelectorAll('small'),

        divCartasJugador = document.querySelectorAll('.div-cartas');

    const inicializarJuego = (numJugadores = 2) => {
        crearDeck();

        puntosJugadores = [];
        for (let i = 0; i < numJugadores; i++) {
            puntosJugadores.push(0);
        }

        puntosHtml.forEach(elem => elem.innerText = 0);

        divCartasJugador.forEach(elem => elem.innerHTML = '');

        btnPedir.disabled = false;
        btnDetener.disabled = false;
    }

    const crearDeck = () => {
        deck = [];
        for (let i = 2; i <= 10; i++) {
            for (let tipo of tipos) {
                deck.push(i + tipo);

            }
        }

        for (let tipo of tipos) {
            for (let especial of especiales) {
                deck.push(especial + tipo);
            }
        }
        deck = _.shuffle(deck);
        return deck;


    }



    // esta funcion permite tomar una carta

    const pedirCarta = () => {
        if (deck.length === 0) {
            throw 'No hay cartas en el deck';
        }
        return deck.pop();
    }



    const valorCarta = (carta) => {
        const valor = carta.substring(0, carta.length - 1);

        return (isNaN(valor)) ?
            (valor === 'A') ? 11 : 10 :
            +valor;

        /*     if (isNaN(valor)) {
                puntos = (valor === 'A') ? 11 : 10;
            } else {
                puntos = +valor;
            }
            console.log(puntos); */
    }


    // turno: 0 = primer jugador y el último es el de la computadora
    const acumularPuntos = (carta, turno) => {
        puntosJugadores[turno] = puntosJugadores[turno] + valorCarta(carta);
        puntosHtml[turno].innerText = puntosJugadores[turno];
        return puntosJugadores[turno];
    }

    const crearCarta = (carta, turno) => {
        const imgCarta = document.createElement('img');
        imgCarta.src = `assets/cartas/${carta}.png`;
        imgCarta.classList.add('carta');
        divCartasJugador[turno].append(imgCarta);
    }

    // turno de la computadora

    const turnoComputadora = (puntosMinimos) => {
        let puntosComputadora = 0;
        do {

            const carta = pedirCarta();

            puntosComputadora = acumularPuntos(carta, puntosJugadores.length - 1);

            crearCarta(carta, puntosJugadores.length - 1);

        } while ((puntosComputadora < puntosMinimos) && puntosMinimos <= 21);

        determinarGanador();
    }

    const determinarGanador = () => {

        const [puntosMinimos, puntosComputadora] = puntosJugadores;

        setTimeout(() => {

            if (puntosComputadora === puntosMinimos) {
                alert('Nadie gana');
            } else if (puntosMinimos > 21) {
                alert('Computadora gana');
            } else if (puntosComputadora > 21) {
                alert('Jugador gana');
            }
        }, 100);
    }

    // eventos

    btnPedir.addEventListener('click', () => {
        const carta = pedirCarta();

        acumularPuntos(carta, 0);

        crearCarta(carta, 0);

        if (puntosJugadores[0] > 21) {
            console.log('Perdiste');
            btnPedir.disabled = true;
            btnDetener.disabled = true;
            turnoComputadora(puntosJugadores[0]);
        } else if (puntosJugadores[0] == 21) {
            console.log('21, genial');
            btnPedir.disabled = true;
            btnDetener.disabled = true;
            turnoComputadora(puntosJugadores[0]);
        }


    });

    btnDetener.addEventListener('click', () => {
        btnPedir.disabled = true;
        btnDetener.disabled = true;
        turnoComputadora(puntosJugadores[0]);
    });

    btnNuevo.addEventListener('click', () => {
        /* deck = [];
        deck = crearDeck(); */
        inicializarJuego();

    });

    return {
        nuevoJuego: inicializarJuego
    };
})();