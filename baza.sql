--
-- PostgreSQL database dump
--

-- Dumped from database version 14.3
-- Dumped by pg_dump version 14.3

-- Started on 2022-06-02 14:49:44

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

--
-- TOC entry 827 (class 1247 OID 24947)
-- Name: categ_barca; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.categ_barca AS ENUM (
    'barca motor',
    'barca pescuit',
    'ski jet',
    'yacht',
    'barca gonflabila',
    'caiac',
    'barca vela'
);


ALTER TYPE public.categ_barca OWNER TO postgres;

--
-- TOC entry 836 (class 1247 OID 24987)
-- Name: roluri; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.roluri AS ENUM (
    'admin',
    'moderator',
    'comun'
);


ALTER TYPE public.roluri OWNER TO postgres;

--
-- TOC entry 830 (class 1247 OID 24962)
-- Name: tipuri_barca; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.tipuri_barca AS ENUM (
    'mica',
    'mare',
    'imensa',
    'medie'
);


ALTER TYPE public.tipuri_barca OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 214 (class 1259 OID 25152)
-- Name: accesari; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.accesari (
    id integer NOT NULL,
    ip character varying(100) NOT NULL,
    user_id integer,
    pagina character varying(500) NOT NULL,
    data_accesare timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.accesari OWNER TO postgres;

--
-- TOC entry 213 (class 1259 OID 25151)
-- Name: accesari_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.accesari_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.accesari_id_seq OWNER TO postgres;

--
-- TOC entry 3357 (class 0 OID 0)
-- Dependencies: 213
-- Name: accesari_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.accesari_id_seq OWNED BY public.accesari.id;


--
-- TOC entry 210 (class 1259 OID 24972)
-- Name: barci; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.barci (
    id integer NOT NULL,
    nume character varying(50) NOT NULL,
    descriere text,
    pret numeric(8,2) NOT NULL,
    viteza_maxima integer NOT NULL,
    tip_produs public.tipuri_barca DEFAULT 'medie'::public.tipuri_barca,
    categorie public.categ_barca,
    producator character varying(50) NOT NULL,
    culori character varying[],
    suport_vasle boolean DEFAULT false NOT NULL,
    imagine character varying(300),
    data_adaugare timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT barci_viteza_maxima_check CHECK ((viteza_maxima >= 0))
);


ALTER TABLE public.barci OWNER TO postgres;

--
-- TOC entry 209 (class 1259 OID 24971)
-- Name: barci_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.barci_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.barci_id_seq OWNER TO postgres;

--
-- TOC entry 3358 (class 0 OID 0)
-- Dependencies: 209
-- Name: barci_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.barci_id_seq OWNED BY public.barci.id;


--
-- TOC entry 212 (class 1259 OID 25136)
-- Name: utilizatori; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.utilizatori (
    id integer NOT NULL,
    username character varying(50) NOT NULL,
    nume character varying(100) NOT NULL,
    prenume character varying(100) NOT NULL,
    parola character varying(500) NOT NULL,
    rol public.roluri DEFAULT 'comun'::public.roluri NOT NULL,
    email character varying(100) NOT NULL,
    culoare_chat character varying(50) NOT NULL,
    data_adaugare timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    cod character varying(200),
    confirmat_mail boolean DEFAULT false,
    ocupatie character varying(50) DEFAULT 'nu doresc să spun'::character varying,
    saltstring character varying(500) NOT NULL,
    tema character varying(100) DEFAULT 'light'::character varying,
    cale_poza character varying(200) DEFAULT NULL::character varying,
    trimis_mail_validare boolean DEFAULT false,
    token_resetare_parola character varying(200),
    token_sterge_cont character varying(200)
);


ALTER TABLE public.utilizatori OWNER TO postgres;

--
-- TOC entry 211 (class 1259 OID 25135)
-- Name: utilizatori_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.utilizatori_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.utilizatori_id_seq OWNER TO postgres;

--
-- TOC entry 3359 (class 0 OID 0)
-- Dependencies: 211
-- Name: utilizatori_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.utilizatori_id_seq OWNED BY public.utilizatori.id;


--
-- TOC entry 3196 (class 2604 OID 25155)
-- Name: accesari id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.accesari ALTER COLUMN id SET DEFAULT nextval('public.accesari_id_seq'::regclass);


--
-- TOC entry 3183 (class 2604 OID 24975)
-- Name: barci id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.barci ALTER COLUMN id SET DEFAULT nextval('public.barci_id_seq'::regclass);


--
-- TOC entry 3188 (class 2604 OID 25139)
-- Name: utilizatori id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.utilizatori ALTER COLUMN id SET DEFAULT nextval('public.utilizatori_id_seq'::regclass);


--
-- TOC entry 3351 (class 0 OID 25152)
-- Dependencies: 214
-- Data for Name: accesari; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3347 (class 0 OID 24972)
-- Dependencies: 210
-- Data for Name: barci; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.barci (id, nume, descriere, pret, viteza_maxima, tip_produs, categorie, producator, culori, suport_vasle, imagine, data_adaugare) VALUES (17, 'Barca cu motor', 'Barca cu motor puternic', 9600.00, 130, 'medie', 'barca motor', 'All American Marine', '{albastru,alb,rosu}', false, '\resurse\imagini\galerie\barca_motor.png', '2022-09-11 12:03:24.612048');
INSERT INTO public.barci (id, nume, descriere, pret, viteza_maxima, tip_produs, categorie, producator, culori, suport_vasle, imagine, data_adaugare) VALUES (18, 'Barca gonflabila 1', 'Barca gonflabila', 1400.00, 0, 'mica', 'barca gonflabila', 'All American Marine', '{verde,gri,rosu}', true, '\resurse\imagini\galerie\barca_gonflabila_2.png', '2022-09-11 12:15:07.699781');
INSERT INTO public.barci (id, nume, descriere, pret, viteza_maxima, tip_produs, categorie, producator, culori, suport_vasle, imagine, data_adaugare) VALUES (19, 'Barca gonflabila 2', 'Barca gonflabila', 1400.00, 0, 'mica', 'barca gonflabila', 'All American Marine', '{verde,mov,galben,magenta}', true, '\resurse\imagini\galerie\barca_gonflabila_1.png', '2022-10-11 12:15:14.442414');
INSERT INTO public.barci (id, nume, descriere, pret, viteza_maxima, tip_produs, categorie, producator, culori, suport_vasle, imagine, data_adaugare) VALUES (13, 'Barca pirat mare', 'Barca de pirati de colectie', 50000.00, 65, 'imensa', 'barca vela', 'Jack Sparrow', '{negru,magenta,portocaliu,maro}', false, '\resurse\imagini\galerie\barca_pirat_3.png', '2022-07-11 11:54:35.562452');
INSERT INTO public.barci (id, nume, descriere, pret, viteza_maxima, tip_produs, categorie, producator, culori, suport_vasle, imagine, data_adaugare) VALUES (1, 'Yacht mic', 'Yacht mic destinat celor care su sunt chiar atat de bogati', 3000.00, 40, 'medie', 'yacht', 'LEXUS', '{alb,albastru,turcoaz,negru}', false, '\resurse\imagini\galerie\yacht_mic.png', '2022-01-11 11:34:06.928197');
INSERT INTO public.barci (id, nume, descriere, pret, viteza_maxima, tip_produs, categorie, producator, culori, suport_vasle, imagine, data_adaugare) VALUES (2, 'Yacht mare merge schimbat', 'Yacht mare destinat celor bogati', 30000.00, 80, 'mare', 'yacht', 'LEXUS', '{alb,negru,mov}', false, '\resurse\imagini\galerie\yacht_mare.png', '2022-04-11 11:36:32.161976');
INSERT INTO public.barci (id, nume, descriere, pret, viteza_maxima, tip_produs, categorie, producator, culori, suport_vasle, imagine, data_adaugare) VALUES (3, 'Motoreta', 'Barca cu motor de mare viteza', 1000.00, 150, 'medie', 'barca motor', 'Honda Marine Group', '{galben,albastru,portocaliu,kaki}', false, '\resurse\imagini\galerie\motoreta.png', '2022-04-11 11:37:51.141925');
INSERT INTO public.barci (id, nume, descriere, pret, viteza_maxima, tip_produs, categorie, producator, culori, suport_vasle, imagine, data_adaugare) VALUES (4, 'Ski jet', 'Ski jet de mare viteza', 1590.00, 180, 'mica', 'ski jet', 'Honda Marine Group', '{alb,albastru,negru}', false, '\resurse\imagini\galerie\jet_ski.png', '2022-01-11 11:34:06.928197');
INSERT INTO public.barci (id, nume, descriere, pret, viteza_maxima, tip_produs, categorie, producator, culori, suport_vasle, imagine, data_adaugare) VALUES (5, 'Barca industriala pescuit', 'Barca industriala pentru pescuit', 50000.00, 50, 'imensa', 'barca pescuit', 'Kawasaki Heavy Industries', '{rosu,albastru,negru,auriu}', false, '\resurse\imagini\galerie\industriala.png', '2022-11-11 11:34:06.928197');
INSERT INTO public.barci (id, nume, descriere, pret, viteza_maxima, tip_produs, categorie, producator, culori, suport_vasle, imagine, data_adaugare) VALUES (14, 'Barca pirat medie', 'Barca de pirati de colectie', 45000.00, 60, 'medie', 'barca vela', 'Jack Sparrow', '{maro,alb,maro}', false, '\resurse\imagini\galerie\barca_pirat_2.png', '2022-07-11 11:55:12.722515');
INSERT INTO public.barci (id, nume, descriere, pret, viteza_maxima, tip_produs, categorie, producator, culori, suport_vasle, imagine, data_adaugare) VALUES (6, 'Caiac ', 'Caiac pentru doua persoane', 50.00, 0, 'mica', 'caiac', 'Zodiac Group', '{alb,albastru,negru}', false, '\resurse\imagini\galerie\caiac_vaslese.png', '2022-02-11 11:34:06.928197');
INSERT INTO public.barci (id, nume, descriere, pret, viteza_maxima, tip_produs, categorie, producator, culori, suport_vasle, imagine, data_adaugare) VALUES (7, 'Caiac2 ', 'Caiac pentru o persoana', 50.00, 0, 'mica', 'caiac', 'Zodiac Group', '{kaki,gri}', false, '\resurse\imagini\galerie\caiac.png', '2022-03-11 11:34:06.928197');
INSERT INTO public.barci (id, nume, descriere, pret, viteza_maxima, tip_produs, categorie, producator, culori, suport_vasle, imagine, data_adaugare) VALUES (8, 'Barci cu vela ', 'Set barci cu vela foarte scump', 100000.00, 70, 'mare', 'barca vela', 'Corsair Marine', '{maro,turcoaz}', false, '\resurse\imagini\galerie\barci_vele.png', '2022-03-11 11:36:00.609503');
INSERT INTO public.barci (id, nume, descriere, pret, viteza_maxima, tip_produs, categorie, producator, culori, suport_vasle, imagine, data_adaugare) VALUES (9, 'Barci dubioase', 'Barci mici si ieftine', 100.00, 0, 'mica', 'caiac', 'Zodiac Group', '{maro,negru}', false, '\resurse\imagini\galerie\barci_dubioase.png', '2022-11-11 11:38:55.580367');
INSERT INTO public.barci (id, nume, descriere, pret, viteza_maxima, tip_produs, categorie, producator, culori, suport_vasle, imagine, data_adaugare) VALUES (10, 'Barca cu vela mare', 'Barca cu vela gigantica', 10000.00, 90, 'mare', 'barca vela', 'Corsair Marine', '{maro,alb,albastru,mov,argintiu}', false, '\resurse\imagini\galerie\barca_vela_mare.png', '2022-05-11 11:44:44.361429');
INSERT INTO public.barci (id, nume, descriere, pret, viteza_maxima, tip_produs, categorie, producator, culori, suport_vasle, imagine, data_adaugare) VALUES (11, 'Barca cu vela lunga', 'Barca cu vela', 16000.00, 95, 'mare', 'barca vela', 'Corsair Marine', '{maro,alb,gri}', false, '\resurse\imagini\galerie\barca_vela.png', '2022-06-11 11:45:38.321065');
INSERT INTO public.barci (id, nume, descriere, pret, viteza_maxima, tip_produs, categorie, producator, culori, suport_vasle, imagine, data_adaugare) VALUES (15, 'Barca pirat mare unicat', 'Barca de pirati de colectie exclusivista', 95000.00, 60, 'mare', 'barca vela', 'Jack Sparrow', '{negru,rosu}', false, '\resurse\imagini\galerie\barca_pirat_1.png', '2022-08-11 11:56:04.369583');
INSERT INTO public.barci (id, nume, descriere, pret, viteza_maxima, tip_produs, categorie, producator, culori, suport_vasle, imagine, data_adaugare) VALUES (16, 'Barca de pescuit', 'Barca specializata in pescuit', 5600.00, 80, 'medie', 'barca pescuit', 'All American Marine', '{albastru,alb}', false, '\resurse\imagini\galerie\barca_pescuit.png', '2022-08-11 12:02:25.375047');
INSERT INTO public.barci (id, nume, descriere, pret, viteza_maxima, tip_produs, categorie, producator, culori, suport_vasle, imagine, data_adaugare) VALUES (20, 'test', 'test', 1.00, 1, 'mica', 'caiac', 'test', '{test}', false, '/produse/1222104/poza.png', '2022-05-26 18:59:12.199999');
INSERT INTO public.barci (id, nume, descriere, pret, viteza_maxima, tip_produs, categorie, producator, culori, suport_vasle, imagine, data_adaugare) VALUES (12, 'Barca chinezeasca', 'Barca din china', 50.00, 0, 'mica', 'caiac', 'Zodiac Group', '{negru}', false, '/produse/719261/poza.png', '2022-06-11 11:46:26.133996');


--
-- TOC entry 3349 (class 0 OID 25136)
-- Dependencies: 212
-- Data for Name: utilizatori; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.utilizatori (id, username, nume, prenume, parola, rol, email, culoare_chat, data_adaugare, cod, confirmat_mail, ocupatie, saltstring, tema, cale_poza, trimis_mail_validare, token_resetare_parola, token_sterge_cont) VALUES (11, 'Cata1', 'aaa', 'bbb', 'bd88431ae2da226af4956028050cd6bf27f89c55c02b1ff4f97b1b633de6ec8dd38e42d8e929881d7be79dc36ccdc1281f51d46c485177c7c66597061df1330b', 'comun', 'cata.stan11@gmail.com', 'green', '2022-05-30 23:09:04.360891', 'CSOF83a0d551a40505bca61fac47e86c1975092f2337382b397ec9f3824a60319fd790fa72f1aa25a8ca', true, 'programator', 'a08p8DczuKwRGlSq', 'light', '/poze_uploadate/Cata1/poza.png', false, '8k4aErJY5i1bUOUI', 'j6FvrsQOeqQeCpqG');
INSERT INTO public.utilizatori (id, username, nume, prenume, parola, rol, email, culoare_chat, data_adaugare, cod, confirmat_mail, ocupatie, saltstring, tema, cale_poza, trimis_mail_validare, token_resetare_parola, token_sterge_cont) VALUES (12, 'Cata2', 'ccc', 'ddd', 'b6e89969ba2f23ee73a9f0d9c417fb10ea49513c027a8172cde93b18dda1c39a2696fcbd336b1d2db5c296b6f239fe6958d8df9c950e205836366c9d1e87364c', 'comun', 'cata.stan11@gmail.com', 'green', '2022-05-31 00:55:47.415708', 'QZLYb3c750e2d66018614599f49fea4914b4d9387efedf14d679736cfdce0f93d27d7a720b468437fb5b', true, 'programator', '03iulnQAqfrV5B8w', 'party', '/poze_uploadate/Cata2/poza.png', false, '9xdMi5t3sJYKLoqQ', 'etQXQ2y4LAUiWCvQ');
INSERT INTO public.utilizatori (id, username, nume, prenume, parola, rol, email, culoare_chat, data_adaugare, cod, confirmat_mail, ocupatie, saltstring, tema, cale_poza, trimis_mail_validare, token_resetare_parola, token_sterge_cont) VALUES (13, 'Cata_adm', 'Cata', 'Cata', 'c087b6d669722fb1d150d0820a2a2a1ffe29235f0e295c59300f363b8946c1f4738e9fa8313c7963696b72f2239ccf47c6bd4b5c2e101cfe8c04b2eadef3044f', 'admin', 'cata.stan11@gmail.com', 'blue', '2022-06-02 10:51:13.287685', 'WGDV41b384a9e378968467e4876a18ab6c813cf5a774206f1b6f636990ddff6e5585a3bca039ee9abf72', true, 'programator', 'GEU3zzOBR0jepEVp', 'light', '/poze_uploadate/Cata_adm/poza.png', false, 'WVG9hVT15yso3zEa', 'TZxWohw4OylTE2Mn');
INSERT INTO public.utilizatori (id, username, nume, prenume, parola, rol, email, culoare_chat, data_adaugare, cod, confirmat_mail, ocupatie, saltstring, tema, cale_poza, trimis_mail_validare, token_resetare_parola, token_sterge_cont) VALUES (1, 'Cata', 'Cata', 'Cata', '4cc812c5b388be249bbdc35828bbe8e3e29369bb71ada6d0e00ba4c84bb4865f790ef8fa22a77456a9f75b034a458465c1bdd29e23a1e0e0a07d9234cc4b5dee', 'admin', 'cata.stan11@gmail.com', 'green', '2022-05-26 20:52:33.764119', 'NNJVe2772753b444eebe12c2171a48ec9c8af9cced32bcc10ce66b8fab7c84de9e4fed121476950e05d6', true, 'programator', 'HmmfBFTFlBYgye8L', 'light', '/poze_uploadate/Cata/poza.png', false, '2jvNTsHvafquKBc4', 'Ehw1ZLhPChovTW5V');


--
-- TOC entry 3360 (class 0 OID 0)
-- Dependencies: 213
-- Name: accesari_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.accesari_id_seq', 453, true);


--
-- TOC entry 3361 (class 0 OID 0)
-- Dependencies: 209
-- Name: barci_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.barci_id_seq', 20, true);


--
-- TOC entry 3362 (class 0 OID 0)
-- Dependencies: 211
-- Name: utilizatori_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.utilizatori_id_seq', 13, true);


--
-- TOC entry 3205 (class 2606 OID 25160)
-- Name: accesari accesari_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.accesari
    ADD CONSTRAINT accesari_pkey PRIMARY KEY (id);


--
-- TOC entry 3199 (class 2606 OID 24985)
-- Name: barci barci_nume_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.barci
    ADD CONSTRAINT barci_nume_key UNIQUE (nume);


--
-- TOC entry 3201 (class 2606 OID 24983)
-- Name: barci barci_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.barci
    ADD CONSTRAINT barci_pkey PRIMARY KEY (id);


--
-- TOC entry 3203 (class 2606 OID 25150)
-- Name: utilizatori utilizatori_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.utilizatori
    ADD CONSTRAINT utilizatori_pkey PRIMARY KEY (id);


--
-- TOC entry 3206 (class 2606 OID 25161)
-- Name: accesari accesari_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.accesari
    ADD CONSTRAINT accesari_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.utilizatori(id);


-- Completed on 2022-06-02 14:49:45

--
-- PostgreSQL database dump complete
--

