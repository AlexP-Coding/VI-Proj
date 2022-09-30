NORMALIZAR TODOS OS VALORES

P1:
- bridge_pokemon_pokemon_USED_IN_TEAMS_WITH:
    - Para cada item:
        - Ver o nome do pokemon Inicial e seus types (df_pokemon)
        - Ver o nome do pokemon teammate e seus types (df_pokemon)
        - Cross join dos 2 grupos de types (type1, type2), retirar repetidos
        - Para cada combinação, multiplicar percentagem de vezes que a combinação dos pokemons ocorre (USED_IN_TEAMS_WITH) pela frequência com que são usados os pokémon (df_pokemon)
    - Somar frequências para cada combinação diferente

P2:
- bridge_pokemon_pokemon_USED_IN_TEAMS_WITH:
    - Para cada item:
        - Ver o nome do Pokemon pretendido
        - Ver a percentagem
        - Selecionar a maior percentagem

P3: 
- df_pokemon:
    - Para cada item:
        - Ver os Type (1,2)
        - Somar ao Type o nr de vezes que o pokemon foi utilizado

P4:
- df_pokemon:
    - Para cada item:
        - Ver o Type pretendido
        - Ver a Stat pretendida
        - Ver o intervalo de gerações pretendido

P5:
- df_pokemon:
    - Aproveitar o P1, fazer parecido
    - Mas guardar também os itens usados por cada pokémon (USED_WITH_ITEM)

P6:
- USED_WITH_MOVE:
    - Para cada item:
        - Guardar pokemon e percentagem de uso do move
        - Para cada medida (df_moves: PP, power, availability):
            - Guardar valor normalizado/percentual?
        - Multiplicar frequencia de uso do pokemon (df_pokemon) pela percentagem de uso do move pelo valor da medida