drop table if exists pokemon cascade;
drop table if exists df_types cascade;
drop table if exists df_moves cascade;
drop table if exists df_used_in_teams_with cascade;
drop table if exists df_used_with_move cascade;
drop table if exists df_move_may_learn cascade;

----------------------------------------
-- TABLE CREATION
----------------------------------------

create table df_types (
    "Type" varchar(255) not null,
    constraint pk_df_types primary key("Type")
);

create table df_moves (
    "Move" varchar(255) not null,
    "Generation" int not null,
    "Type" varchar(255) not null,
    "Power" int,
    "Accuracy" int, 
    "PP" int,
    "Damage Class" varchar(255),
    "Effect" varchar(255),
    "Probability (%)" float,
    constraint pk_df_moves primary key("Move"),
    constraint fk_df_moves_types foreign key("Type") references df_types("Type")
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

create table df_pokemon (
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
    constraint pk_df_pokemon primary key("Pokemon"),
    constraint fk_df_pokemon_type_one foreign key("Type1") references df_types("Type")
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    constraint fk_df_pokemon_type_two foreign key("Type2") references df_types("Type")
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

create table df_move_may_learn (
    "Move" varchar(255),
    "Pokemon" varchar(255),
    constraint pk_df_move_may_learn primary key("Move", "Pokemon"),
    constraint fk_df_move_may_learn_move foreign key("Move") references df_moves("Move")
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    constraint fk_df_move_may_learn_pokemon foreign key("Pokemon") references df_pokemon("Pokemon")
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

create table df_used_in_teams_with (
    "Use Percentage" float,
    "Pokemon" varchar(255),
    "Teammate" varchar(255),
    constraint pk_df_used_in_teams_with primary key("Pokemon", "Teammate"),
    constraint fk_df_used_in_teams_with_pokemon foreign key("Pokemon") references df_pokemon("Pokemon")
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    constraint fk_df_used_in_teams_with_teammate foreign key("Teammate") references df_pokemon("Pokemon")
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

create table df_used_with_move (
    "Move" varchar(255),
    "Use Percentage" float,
    "Pokemon" varchar(255),
    "Name" varchar(255),
    constraint pk_df_used_with_move primary key("Move", "Pokemon"),
    constraint fk_df_used_with_move_move foreign key("Move") references df_moves("Move")
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    constraint fk_df_used_with_move_pokemon foreign key("Pokemon") references df_pokemon("Pokemon")
        ON UPDATE CASCADE
        ON DELETE CASCADE
);