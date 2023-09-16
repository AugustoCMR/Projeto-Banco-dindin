CREATE DATABASE dindin

CREATE TABLE usuarios (
	id serial primary key unique ,
	nome text,
	email text unique,
	senha text
);

CREATE TABLE categorias (
	id serial primary key unique ,
	usuario_id integer references usuarios(id),
	descricao text
);

CREATE TABLE transacoes (
	id serial primary key unique ,
	descricao text,
	valor numeric,
	data date,
	categoria_id integer references categorias(id),
	usuario_id integer references usuarios(id),
	tipo text

);