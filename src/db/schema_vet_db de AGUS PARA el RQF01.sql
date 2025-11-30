--
-- PostgreSQL database dump
--

\restrict BMxwL3icEelOetnEGAflaDZCRt3cL5g8ARfKfMK6xiEcavcH2J2Tb1opJLJsPXx

-- Dumped from database version 16.10 (Ubuntu 16.10-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 16.10 (Ubuntu 16.10-0ubuntu0.24.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: tanimales; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tanimales (
    id_tipoanimal integer NOT NULL,
    categoria_id integer NOT NULL,
    nombre character varying(100) NOT NULL
);


ALTER TABLE public.tanimales OWNER TO postgres;

--
-- Name: tanimales_id_tipoanimal_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tanimales_id_tipoanimal_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tanimales_id_tipoanimal_seq OWNER TO postgres;

--
-- Name: tanimales_id_tipoanimal_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tanimales_id_tipoanimal_seq OWNED BY public.tanimales.id_tipoanimal;


--
-- Name: tcategorias; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tcategorias (
    id_categoria integer NOT NULL,
    nombre character varying(50) NOT NULL
);


ALTER TABLE public.tcategorias OWNER TO postgres;

--
-- Name: tcategorias_id_categoria_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tcategorias_id_categoria_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tcategorias_id_categoria_seq OWNER TO postgres;

--
-- Name: tcategorias_id_categoria_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tcategorias_id_categoria_seq OWNED BY public.tcategorias.id_categoria;


--
-- Name: tcitas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tcitas (
    id_cita integer NOT NULL,
    cliente_id integer NOT NULL,
    mascota_id integer,
    veterinario_id integer NOT NULL,
    animal_id integer NOT NULL,
    fecha_cita date NOT NULL,
    hora_cita time without time zone NOT NULL,
    motivo text NOT NULL,
    estado character varying(20) DEFAULT 'Pendiente'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT tcitas_estado_check CHECK (((estado)::text = ANY ((ARRAY['Pendiente'::character varying, 'Confirmada'::character varying, 'Cancelada'::character varying, 'Completada'::character varying, 'Reprogramada'::character varying])::text[])))
);


ALTER TABLE public.tcitas OWNER TO postgres;

--
-- Name: tcitas_id_cita_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tcitas_id_cita_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tcitas_id_cita_seq OWNER TO postgres;

--
-- Name: tcitas_id_cita_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tcitas_id_cita_seq OWNED BY public.tcitas.id_cita;


--
-- Name: tclientes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tclientes (
    id integer NOT NULL,
    nombre_completo character varying(100) NOT NULL,
    correo character varying(100) NOT NULL,
    telefono character varying(20) NOT NULL,
    direccion text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.tclientes OWNER TO postgres;

--
-- Name: tclientes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tclientes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tclientes_id_seq OWNER TO postgres;

--
-- Name: tclientes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tclientes_id_seq OWNED BY public.tclientes.id;


--
-- Name: tpacientes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tpacientes (
    id integer NOT NULL,
    cliente_id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    animal_id integer NOT NULL,
    raza character varying(50),
    edad integer,
    peso numeric(5,2),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.tpacientes OWNER TO postgres;

--
-- Name: tpacientes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tpacientes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tpacientes_id_seq OWNER TO postgres;

--
-- Name: tpacientes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tpacientes_id_seq OWNED BY public.tpacientes.id;


--
-- Name: tusuarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tusuarios (
    id integer NOT NULL,
    nombre_completo character varying(100) NOT NULL,
    correo character varying(100) NOT NULL,
    telefono character varying(20),
    rol character varying(20) NOT NULL,
    password_hash character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT tusuarios_rol_check CHECK (((rol)::text = ANY ((ARRAY['Veterinario'::character varying, 'Recepcionista'::character varying, 'Admin'::character varying])::text[])))
);


ALTER TABLE public.tusuarios OWNER TO postgres;

--
-- Name: tusuarios_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tusuarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tusuarios_id_seq OWNER TO postgres;

--
-- Name: tusuarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tusuarios_id_seq OWNED BY public.tusuarios.id;


--
-- Name: tanimales id_tipoanimal; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tanimales ALTER COLUMN id_tipoanimal SET DEFAULT nextval('public.tanimales_id_tipoanimal_seq'::regclass);


--
-- Name: tcategorias id_categoria; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tcategorias ALTER COLUMN id_categoria SET DEFAULT nextval('public.tcategorias_id_categoria_seq'::regclass);


--
-- Name: tcitas id_cita; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tcitas ALTER COLUMN id_cita SET DEFAULT nextval('public.tcitas_id_cita_seq'::regclass);


--
-- Name: tclientes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tclientes ALTER COLUMN id SET DEFAULT nextval('public.tclientes_id_seq'::regclass);


--
-- Name: tpacientes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tpacientes ALTER COLUMN id SET DEFAULT nextval('public.tpacientes_id_seq'::regclass);


--
-- Name: tusuarios id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tusuarios ALTER COLUMN id SET DEFAULT nextval('public.tusuarios_id_seq'::regclass);


--
-- Name: tanimales tanimales_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tanimales
    ADD CONSTRAINT tanimales_pkey PRIMARY KEY (id_tipoanimal);


--
-- Name: tcategorias tcategorias_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tcategorias
    ADD CONSTRAINT tcategorias_pkey PRIMARY KEY (id_categoria);


--
-- Name: tcitas tcitas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tcitas
    ADD CONSTRAINT tcitas_pkey PRIMARY KEY (id_cita);


--
-- Name: tclientes tclientes_correo_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tclientes
    ADD CONSTRAINT tclientes_correo_key UNIQUE (correo);


--
-- Name: tclientes tclientes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tclientes
    ADD CONSTRAINT tclientes_pkey PRIMARY KEY (id);


--
-- Name: tpacientes tpacientes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tpacientes
    ADD CONSTRAINT tpacientes_pkey PRIMARY KEY (id);


--
-- Name: tusuarios tusuarios_correo_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tusuarios
    ADD CONSTRAINT tusuarios_correo_key UNIQUE (correo);


--
-- Name: tusuarios tusuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tusuarios
    ADD CONSTRAINT tusuarios_pkey PRIMARY KEY (id);


--
-- Name: tcitas unique_veterinario_fecha_hora; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tcitas
    ADD CONSTRAINT unique_veterinario_fecha_hora UNIQUE (veterinario_id, fecha_cita, hora_cita);


--
-- Name: tanimales tanimales_categoria_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tanimales
    ADD CONSTRAINT tanimales_categoria_id_fkey FOREIGN KEY (categoria_id) REFERENCES public.tcategorias(id_categoria);


--
-- Name: tcitas tcitas_animal_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tcitas
    ADD CONSTRAINT tcitas_animal_id_fkey FOREIGN KEY (animal_id) REFERENCES public.tanimales(id_tipoanimal);


--
-- Name: tcitas tcitas_cliente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tcitas
    ADD CONSTRAINT tcitas_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.tclientes(id);


--
-- Name: tcitas tcitas_mascota_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tcitas
    ADD CONSTRAINT tcitas_mascota_id_fkey FOREIGN KEY (mascota_id) REFERENCES public.tpacientes(id);


--
-- Name: tcitas tcitas_veterinario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tcitas
    ADD CONSTRAINT tcitas_veterinario_id_fkey FOREIGN KEY (veterinario_id) REFERENCES public.tusuarios(id);


--
-- Name: tpacientes tpacientes_animal_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tpacientes
    ADD CONSTRAINT tpacientes_animal_id_fkey FOREIGN KEY (animal_id) REFERENCES public.tanimales(id_tipoanimal);


--
-- Name: tpacientes tpacientes_cliente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tpacientes
    ADD CONSTRAINT tpacientes_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.tclientes(id);


--
-- PostgreSQL database dump complete
--

\unrestrict BMxwL3icEelOetnEGAflaDZCRt3cL5g8ARfKfMK6xiEcavcH2J2Tb1opJLJsPXx

