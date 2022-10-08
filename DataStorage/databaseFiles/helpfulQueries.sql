select
(select count(*) from df_pokemon) as Pokemon,
(select count(*) from df_move_may_learn) as MoveMayLearn,
(select count(*) from df_moves) as "Move",
(select count(*) from df_used_in_teams_with) as Teams,
(select count(*) from df_used_with_move) as UsedWithMove

Alter table pkmn_move
add constraint fk_move_type2 
foreign key("Type")
references pkmn_type("Type")
on update cascade

alter table pkmn_move
rename constraint fk_move_type2
to fk_move_type