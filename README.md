# Wikipath

Wikipath est un logiciel permettant de jouer en ligne avec d'autres personnes à la course wikipédienne (Wiki Wars, Wiki Race ou Wiki Game en anglais). Le principe de la course wikipédienne est d'aller d'une page de départ à une page d'arrivée le plus rapidement possible et avant les autres joueurs. Plus d'informations sont disponibles sur [la page Wikipedia de la pratique](https://fr.wikipedia.org/wiki/Wikip%C3%A9dia:Exercices/Course_wikip%C3%A9dienne).

## Utilisation

Les prérequis pour jouer à Wikipath sont :
 - Chaque joueur doit avoir le client sur son ordinateur (voir [installation](#installation))
 - Un serveur doit être lancé sur une machine accessible depuis internet
 - Les joueurs doivent rentrer le code fournis par le serveur dans le champ prévu à cet effet sur l'écran Rejoindre

:warning: L'ordinateur exécutant le serveur est l'hôte, si il n'est plus joignable ou que le serveur est coupé, la partie sera alors interrompue et les joueurs retournerons sur l'écran titre.

De plus c'est le serveur qui détermine les paramètres de la partie (langue, aide, ...)

Plus d'informations sur le serveur et son utilisation sont disponibles sur la page du [dépôt dédié du projet](https://github.com/Loquicom/Wikipath-Server)

## Installation

Pour installer le jeu il suffit de télécharger la version souhaitée sur la page [disponible ici](https://github.com/Loquicom/Wikipath/releases). Il existe plusieurs formats disponibles au téléchargement : des installeurs, des exécutables et des archives compressées.

Voici en detail ce à quoi correspondent les différents formats (\<version> correspond au numéro de la version présent dans le nom du fichier, par exemple `1.0.0`) :
 - Wikipath-\<version>-win.zip : Archive compressée contenant tous les fichiers et un exéctuables permettant de lancer le logiciel sur Windows
 - Wikipath.\<version>.exe : Exécutable standalone permettant de lancer le logiciel sur Windows
 - Wikipath.Setup.\<version>.exe : Installateur Windows qui ajoute le logiciel sur l'ordinateur
 - wikipath-\<version>.tar.gz : Archive compressée contenant tous les fichiers et un exéctuables permettant de lancer le logiciel sur Linux
 - wikipath_\<version>_amd64.deb : Installateur Linux (Debian) qui ajoute le logiciel sur l'ordinateur

## Compatibilité

Actuellement le protocole Wikipath (le protocole qui le client et le serveur utilisent pour communiquer) n'a qu'une seule version. Toutes les versions du client et du serveur sont donc compatibles entre elles et n'importe quelle version peut être utilisés.