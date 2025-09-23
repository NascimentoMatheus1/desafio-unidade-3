CREATE DATABASE dindin; 

CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nome TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    senha TEXT NOT NULL
);

CREATE TABLE categorias (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER references usuarios(id),
    descricao TEXT
);

CREATE TABLE transacoes (
    id SERIAL PRIMARY KEY,
    descricao TEXT,
    valor INTEGER,
    data date,
    categoria_id INTEGER references categorias(id),
    usuario_id INTEGER references usuarios(id),
    tipo TEXT
);