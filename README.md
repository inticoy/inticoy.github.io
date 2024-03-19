<h1 align="center">
  so_long
</h1>

<h3 align="center">
  Small 2D Game from 42Seoul Assignment.
</h3>

---

Imitation of a classic profile-view game, **Super Mario Bros. (Nintendo, 1985)**

## About this project

<img width="768" alt="Screenshot 2023-11-03 at 14 46 48" src="https://github.com/inticoy/so_long/assets/55380241/6f7aa194-d0f1-42df-9262-e25004a2eed7">

This game is imitation of the game Super Mario Bros. (1985)

Movement of Goomba and Mario are implemented.

You can collect coins with your character, Mario by using WASD keys.

## Getting Started

### Environment

Compatible with M1(ARM) Macs and Intel Macs.

### Installation

1. Clone this repo.

```
git clone https://github.com/inticoy/so_long.git
```

2. Compile so_long with Makefile

```
make all
```

## Usage

### Execution

You need a valid map path for play.

```
./so_long [map path]
```

Sample valid maps are in maps/valid/.

```
./so_long maps/valid/1.ber
```

### Valid map

There are six conditions for valid map below.

You can make your own map that follows these conditions.

- The map must be rectangular.
- The map must be closed/surrounded by walls.
- The map must have only five characters, 0(Space), 1(Wall), P(layer), C(ollectibles, and E(xit).
- The map must have only one P(layer) and E(xit).
- The map must have at least one C(ollectibles).
- You have to check if there's a valid path in the map.

### Game play

You are a player Mario. Collect every coins and reach to princess Peach.

Please be carefull, a enemy Goomba is moving around princess Peach.

You can jump and smash the enemy Goomba, but if you meet with Goomba at Goomba's eye level, game will be over.

### Instructions

jump - `W, S`, left - `a`, right - `d`, retry - `r`, quit the game - `esc`

Please Enjoy!
