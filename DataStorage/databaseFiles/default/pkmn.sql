drop table if exists pkmn_pokemon cascade;
drop table if exists pkmn_type cascade;
drop table if exists pkmn_move cascade;
drop table if exists pkmn_used_in_teams_with cascade;
drop table if exists pkmn_used_with_move cascade;
drop table if exists pkmn_move_may_learn cascade;

----------------------------------------
-- TABLE CREATION
----------------------------------------

create table pkmn_type (
    "Type" varchar(255) not null,
    constraint pk_type primary key("Type")
);

create table pkmn_move (
    "Move" varchar(255) not null,
    "Generation" int not null,
    "Type" varchar(255) not null,
    "Power" int,
    "Accuracy" int, 
    "PP" int,
    "Damage Class" varchar(255),
    "Effect" varchar(255),
    "Probability (%)" float,
    constraint pk_move primary key("Move"),
    constraint fk_move_type foreign key("Type") references pkmn_type("Type")
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

create table pkmn_pokemon (
    "ID" int not null,
    "Pokemon" varchar(255) not null,
    "Species" varchar(255) not null,
    "Variant" varchar(255),
    "Generation" int not null,
    "Rarity" varchar(255),
    "Evolves From" varchar(255),
    "Has Gender Difference" varchar(255),
    "Type1" varchar(255),
    "Type2" varchar(255),
    "Total" int,
    "HP" int,
    "Attack" int,
    "Defense" int,
    "Special Atk" int,
    "Special Def" int,
    "Speed" int,
    "Image Url" varchar(255), 
    "Permissions" varchar(255),
    "Monthly Usage (k)" int,
    "Usage (%)" float,
    "Monthly Rank" varchar(255),
    constraint pk_pokemon primary key("Pokemon"),
    constraint fk_pokemon_type1 foreign key("Type1") references pkmn_type("Type")
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    constraint fk_pokemon_type2 foreign key("Type2") references pkmn_type("Type")
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

create table pkmn_move_may_learn (
    "Move" varchar(255),
    "Pokemon" varchar(255),
    constraint pk_move_may_learn primary key("Move", "Pokemon"),
    constraint fk_move_may_learn_move foreign key("Move") references pkmn_move("Move")
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    constraint fk_move_may_learn_pokemon foreign key("Pokemon") references pkmn_pokemon("Pokemon")
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

create table pkmn_used_in_teams_with (
    "Use Percentage" float,
    "Pokemon" varchar(255),
    "Teammate" varchar(255),
    constraint pk_used_in_teams_with primary key("Pokemon", "Teammate"),
    constraint fk_used_in_teams_with_pokemon foreign key("Pokemon") references pkmn_pokemon("Pokemon")
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    constraint fk_used_in_teams_with_teammate foreign key("Teammate") references pkmn_pokemon("Pokemon")
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

create table pkmn_used_with_move (
    "Move" varchar(255),
    "Use Percentage" float,
    "Pokemon" varchar(255),
    "Name" varchar(255),
    constraint pk_used_with_move primary key("Move", "Pokemon"),
    constraint fk_used_with_move_move foreign key("Move") references pkmn_move("Move")
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    constraint fk_used_with_move_pokemon foreign key("Pokemon") references pkmn_pokemon("Pokemon")
        ON UPDATE CASCADE
        ON DELETE CASCADE
);