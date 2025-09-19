<div align="center">

# OpenClassrooms - Eco-Bliss-Bath
</div>

<p align="center">
    <img src="https://img.shields.io/badge/MariaDB-v11.7.2-blue">
    <img src="https://img.shields.io/badge/Symfony-v6.2-blue">
    <img src="https://img.shields.io/badge/Angular-v13.3.0-blue">
    <img src="https://img.shields.io/badge/docker--build-passing-brightgreen">
    <img src="https://img.shields.io/badge/Cypress-v14.5.2-blue">
  <br><br><br>
</p>

# Prérequis
Pour démarrer cet applicatif web vous devez avoir les outils suivants:
- Docker
- NodeJs

# Installation et démarrage
Clonez le projet pour le récupérer
``` 
git clone https://github.com/OpenClassrooms-Student-Center/Eco-Bliss-Bath-V2.git
cd Eco-Bliss-Bath-V2
```
Pour démarrer l'API avec ça base de données.
```
docker compose up -d
```
# Pour démarrer le frontend de l'applicatif
Rendez-vous dans le dossier frontend
```
cd ./frontend
```
Installez les dépendances du projet
```
npm i
ou
npm install (si vous préférez)
```
Lancer l'interface
```
npm start
```

# Pour lancer les tests automatisé avec Cypress
### Utilisation de Cypress pour la première fois
Installer Cypress
```
cd ./frontend
npm install cypress --save-dev
```
Configurer Cypress
```
npx cypress open
```  
Ouverture du **launchpad** de Cypress :   
* Cliquer sur "E2E Testing"
* Cliquer sur "Continue"  
* Sélectionner votre browser préféré

### Exécuter les tests
Via le launchpad
```
cd ./frontend
npx cypress open
```
* Cliquer sur "Start E2E Testing"
* Sélectionner le script à tester

Générer le rapport
```
cd ./frontend
npx cypress run
```
