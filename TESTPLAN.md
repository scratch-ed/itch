# Lokaal uitvoeren om testplan te controleren

## Benodigdheden

1. Installeer git via https://git-scm.com/download/win.
2. Installeer Windows Terminal uit de MS Store: https://www.microsoft.com/store/productId/9N0DX20HK701 (dit is optioneel, is een betere command line, maar zeker niet verplicht).
3. Installer NodeJS via https://nodejs.org/en/ (Kies de versie 16.XX Current)

## Code lokaal hebben

1. Ga naar een map waar je de code zult willen.
2. Ga in deze map en open de command line (met Windows Terminal van hierboven zou dat Rechter muisknop > Open in Windows Terminal zijn).
   - Als je gewoon de command line opent en je zit niet in de juiste map, kan je in de command line naar de juiste map gaan door `cd <locatie van de map>` te typen (en op enter te duwen natuurlijk).
3. Kloon de repository lokaal met https://github.com/FTRPRF/scratch-judge.git. Voer dus uit (typen + enter):

   ```
   git clone https://github.com/FTRPRF/scratch-judge.git
   ```

   Hier zul je een GitHub-account voor nodig hebben, en toegang tot de repo.

4. Ga nu in de command line naar deze map, opnieuw met `cd scratch-judge`, of sluit de command line en open een nieuwe command line in de map.
5. Typ `npm install`.

## Testplan proberen

1. Ga naar de map waarin de judge staat.
2. Open een terminal in die map.
3. Voer uit:

```
npm run itch -- -e <oefening> [-l <level>] <oplossing>
```

Dit zal een browser openen waarin de test gebeurt.
Onder het Scratch-venster komt de uitvoer (in een iets ander formaat).

Waarbij:

- `<oefening>` - de interne naam van de oefening in de judge. De mogelijkheden worden getoond als je het verkeerde invult.
- `<level>` - optioneel het level van de oefening
- `<oplossing>` - de locatie van een sb3-bestand met de oplossing

Merk op dat zowel oefening als level een "optie" zijn, dus moet er respectievelijk -e en -l voor.
Een volledig voorbeeld is:

(zonder level)

```
npm run itch -- -e bouw-de-rakket "C:\Users\strij\Ontwikkeling\Scratch4D\itch-scratch-judge\exercises\bouw-de-rakket\projects\solution.sb3"
```

(met level, level 2 van pico)

```
npm run itch -- -e pico -l 2 "C:\Users\strij\Downloads\pico.sb3"
```

## Vragen

- Hoe update ik naar de laatste versie van de judge?

  - Open de map in de command line en voer uit `git pull`.

- Updaten lukt niet. Dit is vaak doordat je dingen gewijzigd hebt in die map. Om de map te resetten, typ `git reset --hard` in een command line in die map.
