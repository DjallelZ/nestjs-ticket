## Description

Gestion d'un ticket de caisse avec NestJS et TypeScript.

C'est mon premier projet avec TypeScript et NestJS. 

J'ai décidé d'utiliser NestJS afin de développer rapidement et efficacement cette application tout en m'assurant une architecture simple et lisible.

## Installation

```bash
$ npm install
```
## Configuration de l'ORM

La configuration du fichier "typeorm.config.ts" permet de renseigner les informations de connexion à votre base de données de test (port, username, etc.)

## Lancement de l'application (NPM)

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
L'application est accessible par défaut sur le port 3000.

## Fonctionnement

L'envoi du ticket doit se faire par l'émission d'un Body de type raw via Postman, ou autre, à l'URL suivante : localhost:3000/ticket via la méthode POST.

```
POST /ticket HTTP/1.1
Host: localhost:3000
Content-Type: text/plain
```

L'application permet de procéder à la bonne gestion du ticket de caisse si ces conditions sont respectées : 
 - Les attributs du ticket sont en première partie et séparés des produits par un saut de ligne.
 - Les 3 attributs fournis pour le ticket sont exclusivement et obligatoirement : "order", "vat", "total". Insensibles à la casse, l'ordre n'importe pas.
 - Les 3 entêtes des produits sont exclusivement et obligatoirement : "product", "product_id", "price". Insensibles à la casse, l'ordre n'importe pas.
 - Les valeurs des attributs et des entêtes ne sont pas vides et correspondent bien aux types qu'ils représentent (ex: un prix ne doit pas inclure de lettres).

Si une de ces conditions n'est pas respectée, un ticket brut est créé en base de données avec la valeur émise par le client. 

Si tout se passe bien, le ticket et les produits liés sont créés/mis à jour. Une table d'association stocke également les associations entre chaque ticket et produits liés avec une relation n à n.

## Réalisations :
 - Insertion et mise à jour des tickets et produits en base
 - Insertion en base du ticket brut en cas de format incorrect
 - Renvoi du ticket et des produits insérés pour la partie Front en cas de réussite (pas nécessaire selon le contexte d'émission du ticket)
 - Architecture simple et modulaire
 - Gestion automatisée et orientée objet du CRUD avec TypeORM ne nécessitant pas de requêtes SQL
 - Gestion des dépendances facilitée par les décorateurs

## Compromis :
 - Validation des données saisies et transmises entre fonctions non assurées par des DTO
 - Problématiques de volumétrie et performances insuffisamment traitées

