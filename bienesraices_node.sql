-- -------------------------------------------------------------
-- TablePlus 5.3.8(500)
--
-- https://tableplus.com/
--
-- Database: bienesraices_node
-- Generation Time: 2023-08-18 03:14:14.3260
-- -------------------------------------------------------------


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


CREATE TABLE `categorias` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(30) COLLATE utf8mb4_general_ci NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `mensajes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `mensaje` varchar(200) COLLATE utf8mb4_general_ci NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `propiedadId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `usuarioId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `propiedadId` (`propiedadId`),
  KEY `usuarioId` (`usuarioId`),
  CONSTRAINT `mensajes_ibfk_5` FOREIGN KEY (`propiedadId`) REFERENCES `propiedades` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `mensajes_ibfk_6` FOREIGN KEY (`usuarioId`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `precios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(30) COLLATE utf8mb4_general_ci NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `propiedades` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `titulo` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `descripcion` text COLLATE utf8mb4_general_ci NOT NULL,
  `habitaciones` int NOT NULL,
  `estacionamiento` int NOT NULL,
  `wc` int NOT NULL,
  `calle` varchar(60) COLLATE utf8mb4_general_ci NOT NULL,
  `lat` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `lng` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `imagen` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `publicado` tinyint(1) NOT NULL DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `precioId` int DEFAULT NULL,
  `categoriaId` int DEFAULT NULL,
  `usuarioId` int DEFAULT NULL,
  `mensajeId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `precioId` (`precioId`),
  KEY `categoriaId` (`categoriaId`),
  KEY `usuarioId` (`usuarioId`),
  KEY `mensajeId` (`mensajeId`),
  CONSTRAINT `propiedades_ibfk_10` FOREIGN KEY (`mensajeId`) REFERENCES `mensajes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `propiedades_ibfk_7` FOREIGN KEY (`precioId`) REFERENCES `precios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `propiedades_ibfk_8` FOREIGN KEY (`categoriaId`) REFERENCES `categorias` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `propiedades_ibfk_9` FOREIGN KEY (`usuarioId`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `confirmado` tinyint(1) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `categorias` (`id`, `nombre`, `createdAt`, `updatedAt`) VALUES
(1, 'Casa', '2023-08-14 02:13:31', '2023-08-14 02:13:31'),
(2, 'Departamento', '2023-08-14 02:13:31', '2023-08-14 02:13:31'),
(3, 'Bodega', '2023-08-14 02:13:31', '2023-08-14 02:13:31'),
(4, 'Terreno', '2023-08-14 02:13:31', '2023-08-14 02:13:31'),
(5, 'Cabaña', '2023-08-14 02:13:31', '2023-08-14 02:13:31');

INSERT INTO `mensajes` (`id`, `mensaje`, `createdAt`, `updatedAt`, `propiedadId`, `usuarioId`) VALUES
(1, '¿Cuál es el precio exacto de la propiedad?', '2023-08-18 04:10:19', '2023-08-18 04:10:19', '74a47205-584d-4a03-bb4c-5587b0b11e46', 2),
(2, '¿Cuál es el precio exacto de la propiedad?', '2023-08-18 04:11:51', '2023-08-18 04:11:51', '74a47205-584d-4a03-bb4c-5587b0b11e46', 2);

INSERT INTO `precios` (`id`, `nombre`, `createdAt`, `updatedAt`) VALUES
(1, '0 - $10,000 USD', '2023-08-14 02:13:31', '2023-08-14 02:13:31'),
(2, '$10,000 - $30,000 USD', '2023-08-14 02:13:31', '2023-08-14 02:13:31'),
(3, '$30,000 - $50,000 USD', '2023-08-14 02:13:31', '2023-08-14 02:13:31'),
(4, '$50,000 - $75,000 USD', '2023-08-14 02:13:31', '2023-08-14 02:13:31'),
(5, '$75,000 - $100,000 USD', '2023-08-14 02:13:31', '2023-08-14 02:13:31'),
(6, '$100,000 - $150,000 USD', '2023-08-14 02:13:31', '2023-08-14 02:13:31'),
(7, '$150,000 - $200,000 USD', '2023-08-14 02:13:31', '2023-08-14 02:13:31'),
(8, '$200,000 - $300,000 USD', '2023-08-14 02:13:31', '2023-08-14 02:13:31'),
(9, '$300,000 - $500,000 USD', '2023-08-14 02:13:31', '2023-08-14 02:13:31'),
(10, '+ $500,000 USD', '2023-08-14 02:13:31', '2023-08-14 02:13:31');

INSERT INTO `propiedades` (`id`, `titulo`, `descripcion`, `habitaciones`, `estacionamiento`, `wc`, `calle`, `lat`, `lng`, `imagen`, `publicado`, `createdAt`, `updatedAt`, `precioId`, `categoriaId`, `usuarioId`, `mensajeId`) VALUES
('08ea8e51-bc60-45ad-a510-309cddb58418', 'Casa con Alberca', 'Hermosa casa con alberca de buen tamaño para disfrutar con la familia.', 3, 2, 4, 'Calle Edgar Allan Poe 43', '19.430652426723224', '-99.19998214499202', 'f2scfbmhomo1h7u8f56a.jpg', 0, '2023-08-16 04:07:23', '2023-08-18 08:59:33', 6, 1, 1, NULL),
('1ef6f02b-ab7c-4a15-80be-5a40a92f3631', 'Casa en el bosque', 'Bonita casa en el bosque con terraza de lujo y una vista hermosa a la naturaleza', 5, 5, 5, 'Avenida Rubén Darío 167', '19.426168853788404', '-99.19111354096556', 'qpq1hiv6i8o1h7pa2cgn.jpg', 1, '2023-08-14 02:54:05', '2023-08-18 08:57:43', 7, 1, 1, NULL),
('70012565-24fb-4484-b3c6-61e6b2409f1e', 'Casa en la Ciudad', 'Hermosa casa en las orillas de la Ciudad de México con jardín muy bonito.', 5, 3, 5, 'Vialidad de la Barranca 78', '19.39392581810711', '-99.28035736083986', 'vfb10jdkag81h7u820dn.jpg', 1, '2023-08-16 04:00:50', '2023-08-18 08:57:41', 10, 1, 1, NULL),
('74a47205-584d-4a03-bb4c-5587b0b11e46', 'Almacén', 'Amplio almacén que puede ser adaptado para guardar lo que sea.', 1, 5, 5, 'Thomas Alva Edison', '19.438860000000034', '-99.15828999999997', 'jf64suffo681h7u8o244.jpg', 1, '2023-08-16 04:12:39', '2023-08-18 08:57:39', 7, 3, 1, NULL),
('86c20142-3bbb-47b1-ad98-47d63f3f58d6', 'Departamento en la Playa', 'Hermoso departamento en rascacielos con hermosa vista al mar. Perfecto para descansar.', 3, 2, 4, 'Avenida Kukulkán', '20.19318375329975', '-87.4638224456655', 'b7slqaorvo1h7u7v8i8.jpg', 1, '2023-08-16 03:59:11', '2023-08-18 08:57:38', 8, 2, 1, NULL),
('9cd8ef1c-960a-4e00-92b0-a8f102281ce3', 'Casa en la Playa', 'Hermosa cada con hermosa vista', 2, 3, 4, 'Boulevard de las Naciones', '16.79549846854892', '-99.8107819178586', '4cnpefc9lt1h7rffiah.jpg', 1, '2023-08-15 02:12:49', '2023-08-15 02:13:01', 9, 1, 1, NULL),
('c9e2a748-5744-4e08-bfbe-8bc1bdd236d5', 'Departamento de Lujo', 'Lujoso Penthouse en rascacielos con hermosa vista a la ciudad', 5, 5, 5, 'Avenida Rubén Darío 167', '19.426168853788404', '-99.19111354096556', 'qb1kt2vbi9g1h7r0p0oh.jpg', 1, '2023-08-14 02:52:08', '2023-08-18 08:57:06', 4, 2, 1, NULL),
('d3315b90-e636-4ca6-a921-5c09054df355', 'Mansión en la Montaña', 'Hermosa casa en la montaña rodeada de naturaleza.', 5, 4, 5, 'Calle Cerro El Nabo 314', '20.722855736791047', '-100.44386808426796', 'do21bq8jt0g1h7u8bkn8.jpg', 1, '2023-08-16 04:05:31', '2023-08-16 04:06:16', 7, 1, 1, NULL),
('d41b942f-9815-4e74-b043-1c0efd0af07e', 'Casa con Alberca', 'Hermosa casa con acabados de lujos y con alberca para disfrutar con la familia.', 5, 5, 5, 'Sierra Madre 605', '19.42237999263331', '-99.21448998116631', '16ksn02tp1g1h7res5sq.jpg', 1, '2023-08-15 02:02:07', '2023-08-15 02:02:26', 10, 1, 1, NULL),
('d8df947c-571f-4b2a-a022-e8f8aa94da7d', 'Casa en la Playa', 'Hermosa casa a 10 minutos de la playa caminando', 2, 2, 4, 'Calle Huajuapan de León', '15.86260959573146', '-97.08266732575107', 'v4lt73a1smg1h7u8kpvd.jpg', 1, '2023-08-16 04:10:59', '2023-08-16 04:11:16', 7, 1, 1, NULL),
('e6a889bb-031a-496c-9062-dd8ea9c1ebbc', 'Cabaña Nueva', 'Hermosa cabaña nueva de buen tamaño', 2, 1, 2, 'Carretera Federal a Cuernavaca', '19.144838749834513', '-99.16762018739368', '5fm5veql4vo1h8010k9g.jpg', 1, '2023-08-16 20:36:07', '2023-08-16 20:36:24', 6, 5, 1, NULL),
('f0b74806-c2c5-467b-8561-bbafb4722b94', 'Edificio', 'Grande edificio en venta con 5 departamentos lujosos.', 5, 5, 5, 'Avenida Rubén Darío 61', '19.42943998585895', '-99.18350996411569', '4gjvkadqvc81h7u8hh6m.jpg', 1, '2023-08-16 04:09:20', '2023-08-16 04:09:29', 10, 4, 1, NULL),
('fb40735a-581e-4298-9356-6e880a26cfed', 'Casa Lujosa', 'Pequeña casa para pocas personas con acabados de lujos en zona tranquila a 30 minutos de la ciudad.', 1, 1, 2, 'MEX-15', '19.298623711503577', '-99.39270872678972', 'h4m1aks6ml81h7u874j9.jpg', 1, '2023-08-16 04:03:28', '2023-08-16 04:03:48', 10, 5, 1, NULL);

INSERT INTO `usuarios` (`id`, `nombre`, `email`, `password`, `token`, `confirmado`, `createdAt`, `updatedAt`) VALUES
(1, 'Remy Patgher', 'remypatgher@gmail.com', '$2b$10$x1u.91MpwSWtGHkKwADrz.GfDp3FzfruGFzHeqiBzmFgXWe2QhKvq', NULL, 1, '2023-08-14 02:13:31', '2023-08-14 02:13:31'),
(2, 'Carlos', 'correo@correo.com', '$2b$10$CLGF2dpFPv9xsX4Zp0aTQ.E/Fd6c/M1F5iNdFHEzJ5Xc9Iy3dCAKS', NULL, 1, '2023-08-18 01:15:08', '2023-08-18 01:15:22');



/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;