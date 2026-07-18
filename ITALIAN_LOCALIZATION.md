# Localizzazione italiana

La localizzazione italiana non usa più sostituzioni parola-per-parola nel DOM.
Quel metodo produceva frasi ibride e termini ambigui (per esempio *build*,
*deployment*, *registry*, *target* e *schedule*) senza conoscere la funzione
dell’elemento.

## Nuovo sistema

- **Catalogo di frasi complete:** una traduzione viene applicata solo quando è
  definita per l’intera etichetta o frase.
- **Contesto UI:** la stessa voce può cambiare tra navigazione, pulsanti, moduli,
  tabelle, stati, finestre di dialogo e notifiche.
- **Modelli grammaticali controllati:** i messaggi ricorrenti (creazione,
  eliminazione, aggiornamento, errori e risultati vuoti) gestiscono genere e
  numero senza tradurre singole parole alla cieca.
- **Aggiornamenti efficienti:** le modifiche al DOM vengono raggruppate in un
  singolo `requestAnimationFrame`; `WeakMap` evita di rielaborare testo e
  attributi già tradotti.
- **Aree tecniche protette:** codice, terminali, log, editor e contenuti
  modificabili non vengono alterati.
- **Locale impostazioni completo:** il file italiano contiene tutte le chiavi
  presenti nel file inglese.

## File principali

- `apps/dokploy/components/localization/italian-translation-engine.ts`
- `apps/dokploy/components/localization/italian-localization-provider.tsx`
- `apps/dokploy/public/locales/it/settings.json`

Per aggiungere una nuova traduzione, inserire la frase completa nel catalogo.
Se il significato cambia in base alla posizione, inserirla nella sezione
`contextual` invece di aggiungere una sostituzione lessicale globale.
