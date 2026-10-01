# Trinette den Hamer — website beheren

De website gebruikt Pages CMS. Je hoeft voor normale inhoud dus niet in `index.html` of CSS te werken.

## Inloggen

1. Ga naar https://app.pagescms.org/
2. Log in met GitHub.
3. Open repository `NoSyncMusic/trinette-website`.
4. Kies **Website beheren**.

Pages CMS leest automatisch `.pages.yml` uit deze repository.

## Wat kun je aanpassen?

Via **Website beheren** kun je onder andere aanpassen:

- naam, browsertitel en Google-omschrijving;
- contactmail en Instagram;
- alle hoofdkleuren;
- menu-teksten;
- hero-titel, intro en grote afbeelding;
- tekst van Het atelier;
- soorten werk;
- volledige portfolio;
- quote;
- Over Trinette;
- werkwijze;
- contactblok;
- footer.

## Nieuw werk toevoegen

Ga naar **Website beheren → Portfolio → Werken**.

1. Kies **Add item**.
2. Vul de naam van het werk in.
3. Vul de techniek in, bijvoorbeeld Pastel of Olieverf.
4. Upload de afbeelding bij **Afbeelding**.
5. Kies het formaat:
   - `tall` = hoog;
   - `square` = vierkant;
   - `wide` = breed.
6. Zet **Zichtbaar** aan.
7. Sla op.

Je kunt portfolio-items ook verslepen om de volgorde te wijzigen.

## Foto vervangen

Bij velden met **Afbeelding** kun je een bestaand bestand selecteren of een nieuwe foto uploaden.

Nieuwe afbeeldingen worden opgeslagen in:

`assets/artwork/`

## Kleuren aanpassen

Gebruik bij voorkeur HEX-codes, bijvoorbeeld:

`#5B5650`

Na opslaan commit Pages CMS de wijziging rechtstreeks naar GitHub. GitHub Pages publiceert de website vervolgens automatisch opnieuw.

## Wat liever niet via het CMS aanpassen?

De layout, animaties, mobiele weergave en technische werking staan in de code. Die kunnen beter via een codewijziging worden aangepast zodat de site niet per ongeluk stukgaat.
