DONE:
- delete from df_pokemon where "Variant"='Gigantamax'
- delete from df_pokemon
where "Permissions" like 'Restricted%'
or "Permissions" like 'Banned%';
- alter table df_pokemon
drop column "Permissions"
- alter table df_pokemon
drop column "Evolves From"
- alter table df_pokemon
drop column "Has Gender Difference"
- alter table df_pokemon
drop column "Monthly Rank";
- alter table df_pokemon
drop column "Usage (%)";
- alter table df_pokemon
drop column "Variant";
- insert into df_types
values('NULL')
- update df_pokemon
set "Type2"='NULL'
where "Type2" is null
- update df_pokemon
set "Monthly Usage (k)"=0 where "Monthly Usage (k)" is null
- alter table df_moves 
drop column "Effect";
- alter table df_moves 
drop column "Probability (%)";
- update df_moves 
set "Power"=-1
where "Power" is null
- delete from df_moves
where "Move" like 'Max %'
- delete from df_moves
where "Move" like 'G-Max%'
- update df_moves 
set "Accuracy"=-1 
where "Accuracy" is null
- delete FROM df_pokemon
where "Pokemon" like '%max%'


TO-DO:
- Missing nominal: "NULL"
- Missing Ratio: 
    - Impute (0 for Monthly Usage, for ex)
    - Sentinel (101 for Acc. when infinite)
- averages, max, min
- normalized ratio
