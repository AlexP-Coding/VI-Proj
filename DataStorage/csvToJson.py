import pandas as pd
#Pandas instalado pelo pip3

df = pd.read_csv("cleanData/bridge_pokemon_pokemon_USED_IN_TEAM_WITH.csv") #Path de onde esta o ficheiro
df.to_json(path_or_buf="json/bridge_pokemon_pokemon_USED_IN_TEAM_WITH.json", orient="records") # Path de onde queres guardar