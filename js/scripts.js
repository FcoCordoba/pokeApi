let totalCartas = 10;
let pokemons = [];
let cartasMaquina = [];
let cartasJugador = [];
let juegaLaMaquina;

let empiezaMaquina = false;

window.onload = async () => {
  cartel.classList.toggle("ocultar");
  await cargarPokemons();
  quienEmpieza();
  cargarEventos();
};

function cargarEventos() {
  let cartasJugador = document.querySelectorAll("#player .carta");
  for (carta of cartasJugador) {
    carta.addEventListener("click", lanzarCarta);
  }
}

function lanzarCarta() {
  jugadaPlayer.appendChild(this);
  if (cuentaCartas() >= 2) comprobarJugada()
  else lanzarCartaMaquina();
}

function quienEmpieza() {
  // 0 -> Maquina y 1 -> Jugador
  let juegaLaMaquina = Math.floor(Math.random() * 2);
  if (juegaLaMaquina) lanzarCartaMaquina();
}

// La carta tira una carta al tapete de
function lanzarCartaMaquina() {
  reportError.innerText = "Juega la maquina...";
  setTimeout(() => {
    console.log("Juega la maquina");
    let cartasMaquina = document.querySelectorAll("#machine .carta");
    let cartaMaquina = cartasMaquina[Math.floor(Math.random() * cartasMaquina.length)];
    
    
    cartaMaquina.querySelector("img.dorso").remove();
    jugadaMachine.appendChild(cartaMaquina);
    if (cuentaCartas() >= 2){
      empiezaMaquina = true;
      comprobarJugada();
    } else empiezaMaquina = false
    
  }, 2000);
}

function elegirCarta() {
  let cartaElegida;
  if (play.querySelectorAll(".carta").length == 1) {
    // Experiencia carta jugador
    let exp = parseInt(jugadaPlayer.querySelector(".carta .experiencia").innerText);
    let cartasMaquina = tableroMachine.querySelectorAll(".carta");

    let i = 0;
    while (!cartaElegida || i > cartasMaquina.length) {
      if(parseInt(cartasMaquina[i].querySelector(".experiencia").innerText) == exp){
        // Comprobar puntuacion
        if (parseInt(totalMachine.innerText) + parseInt(cartasMaquina[i].querySelector(".experiencia").innerText) >= 1000){
          cartaElegida = cartasMaquina[i];
        } 

      } else if (parseInt(cartasMaquina[i].querySelector(".experiencia").innerText) > exp) cartaElegida = cartasMaquina[i];
      i++
    }
    
    if (!cartaElegida) cartaElegida = cartasMaquina[0];

  }else{
    // La maquina elige una carta aleatoria
    cartaElegida = cartasMaquina[Math.floor(Math.random()* cartasMaquina.length)];
  }
}

async function cargarPokemons() {
  let iniURL = "https://pokeapi.co/api/v2/pokemon";
  let totalURL;
  let total;

  await fetch(iniURL)
    .then((data) => data.json())
    .then((info) => {
      total = info.count;
      totalURL = "https://pokeapi.co/api/v2/pokemon/?limit=" + total;
    });

  await fetch(totalURL)
    .then((data) => data.json())
    .then((info) => (pokemons = info.results));
  let pokemonsSelec = [];

  let i = 0;

  while (i < totalCartas) {
    let pos = Math.floor(Math.random() * total);

    if (pokemonsSelec[pos] != "X") {
      pokemonsSelec[pos] = "X";

      let cartaPokemon = await cargarPokemon(pokemons[pos].url);
      if (cartaPokemon[0]) {
        if (i % 2 == 0)
          cartasJugador.push(await cargarPokemon(pokemons[pos].url));
        else cartasMaquina.push(await cargarPokemon(pokemons[pos].url));

        i++;
      }
    }
  }

  cartasMaquina.sort((a,b) => a[0] - b[0]);
  cartasJugador.sort((a,b) => a[0] - b[0]);

  for (carta of cartasJugador) {
    player.appendChild(crearCarta(carta[0], carta[1], carta[2]));
  }

  for (carta of cartasMaquina) {
    machine.appendChild(crearCarta(carta[0], carta[1], carta[2], true));
  }

  console.table(cartasJugador);
  console.table(cartasMaquina);
}

function cuentaCartas(params) {
  return play.querySelectorAll(".carta").length;
}

function repartirCartas(params) {}

function crearCarta(exp, nombre, imagen, maq) {
  let carta = document.createElement("div");
  carta.classList.add("carta");

  let img = document.createElement("img");
  img.src = imagen;

  let nomPokemon = document.createElement("div");
  nomPokemon.innerText = nombre;

  let experiencia = document.createElement("div");
  experiencia.classList.add("experiencia");
  experiencia.innerText = exp;

  carta.appendChild(img);
  carta.appendChild(experiencia);
  carta.appendChild(nomPokemon);

  if (maq) {
    let dorso = document.createElement("img");
    dorso.src = "./img/dorso.png";
    dorso.classList.add("dorso");
    carta.appendChild(dorso);
  }

  return carta;
}

async function cargarPokemon(url) {
  console.log(url);
  let pokemon = [];
  await fetch(url)
    .then((data) => data.json())
    .then((info) => {
      pokemon.push(info.base_experience);
      pokemon.push(info.name);
      pokemon.push(info.sprites.other["official-artwork"].front_default);
    });
  return pokemon;
}

function comprobarJugada() {
  console.log("Comprobar jugada");
  let cartasJugadas = play.querySelectorAll(".carta");

  if (
    parseInt(jugadaMachine.querySelector(".carta .experiencia").innerText) >
    parseInt(jugadaPlayer.querySelector(".carta .experiencia").innerText)
  ) {
    for (carta of cartasJugadas) {
      cartasMachine.appendChild(carta);
      totalMachine.innerText =
        parseInt(totalMachine.innerText) +
        parseInt(carta.querySelector(".experiencia").innerText);
    }
    lanzarCartaMaquina();
  } else if (
    parseInt(jugadaMachine.querySelector(".carta .experiencia").innerText) <
    parseInt(jugadaPlayer.querySelector(".carta .experiencia").innerText)
  ) {
    for (carta of cartasJugadas) {
      cartasPlayer.appendChild(carta);
      console.log(carta[0]);
      totalPlayer.innerText =
        parseInt(totalPlayer.innerText) +
        parseInt(carta.querySelector(".experiencia").innerText);
    }
  } else {
    cartasPlayer.appendChild(jugadaPlayer.querySelector(".carta"));
    cartasMachine.appendChild(jugadaMachine.querySelector(".carta"));

    if(empiezaMaquina) lanzarCartaMaquina();
  }
}
