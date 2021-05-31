# Lokaal uitvoeren om testplan te controleren

## Benodigdheden

1. Installeer git via https://git-scm.com/download/win.
2. Installer NodeJS via https://nodejs.org/en/ (Kies de versie 16.XX Current)

**Tip**: als je in een map bent in de verkenner, duw op <kbd>Ctrl</kbd>+<kbd>Rechtermuisknop</kbd>, dan kan je vanuit het menu dat verschijnt Powershell openen in die map. Dit geeft een blauwe opdrachtprompt, maar in de correct map, waardoor je geen `cd` meer moet doen.

## Code lokaal hebben

1. Ga naar een map waar je de code zult willen.
2. Ga in deze map en open de opdrachtprompt.
   - Als je gewoon de opdrachtprompt opent en je zit niet in de juiste map, kan je in de opdrachtprompt naar de juiste map gaan door `cd <locatie van de map>` te typen (en op enter te duwen natuurlijk).
3. Kloon de repository lokaal met https://github.com/FTRPRF/scratch-judge.git. Voer dus uit (typen + enter):

   ```
   git clone https://github.com/FTRPRF/scratch-judge.git
   ```

   Hier zul je een GitHub-account voor nodig hebben, en toegang tot de repo.

4. Ga nu in de opdrachtprompt naar deze map, opnieuw met `cd scratch-judge`.
5. Typ `npm install`.
6. Typ `npm run build`.

## Testplan proberen

1. Ga naar de map waarin de judge staat.
2. Open een opdrachtprompt in die map.
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
npm run itch -- -e bouw-de-rakket "C:\Users\strij\Downloads\solution.sb3"
```

(met level, level 2 van pico)

```
npm run itch -- -e pico -l 2 "C:\Users\strij\Downloads\pico.sb3"
```

## Updaten met nieuwe code en/of testplannen

1. Ga naar de map waarin de judge staat.
2. Open een opdrachtprompt in die map.
3. Voer uit: `git pull`
4. Voer uit: `npm run build`
5. Je bent opnieuw klaar om testplannen te runnen.

## Vragen

- Updaten lukt niet.

  Dit is vaak doordat je dingen gewijzigd hebt in die map. Om de map te resetten, typ `git reset --hard` in een opdrachtprompt in die map.
