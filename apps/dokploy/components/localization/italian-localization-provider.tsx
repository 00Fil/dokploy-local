import { useEffect } from "react";

const exact: Record<string, string> = {
  Home: "Home",
  Projects: "Progetti",
  Deployments: "Distribuzioni",
  Monitoring: "Monitoraggio",
  Schedules: "Pianificazioni",
  Requests: "Richieste",
  Settings: "Impostazioni",
  Profile: "Profilo",
  Users: "Utenti",
  "Remote Servers": "Server remoti",
  Notifications: "Notifiche",
  Billing: "Fatturazione",
  Certificates: "Certificati",
  Registry: "Registro",
  Tags: "Etichette",
  Cluster: "Cluster",
  "SSH Keys": "Chiavi SSH",
  "Web Server": "Server web",
  Documentation: "Documentazione",
  Support: "Assistenza",
  Account: "Account",
  Actions: "Azioni",
  Action: "Azione",
  Status: "Stato",
  Name: "Nome",
  Description: "Descrizione",
  Type: "Tipo",
  Created: "Creato",
  Updated: "Aggiornato",
  Active: "Attivo",
  Inactive: "Inattivo",
  Enabled: "Abilitato",
  Disabled: "Disabilitato",
  Running: "In esecuzione",
  Stopped: "Arrestato",
  Failed: "Non riuscito",
  Pending: "In attesa",
  Success: "Completato",
  Error: "Errore",
  Warning: "Avviso",
  All: "Tutti",
  None: "Nessuno",
  Default: "Predefinito",
  Custom: "Personalizzato",
  Advanced: "Avanzate",
  General: "Generali",
  Security: "Sicurezza",
  Domains: "Domini",
  Environment: "Ambiente",
  Environments: "Ambienti",
  Services: "Servizi",
  Service: "Servizio",
  Applications: "Applicazioni",
  Application: "Applicazione",
  Databases: "Database",
  Database: "Database",
  Logs: "Log",
  Terminal: "Terminale",
  Backups: "Backup",
  Variables: "Variabili",
  Ports: "Porte",
  Volumes: "Volumi",
  Network: "Rete",
  Networks: "Reti",
  Server: "Server",
  Organization: "Organizzazione",
  Organizations: "Organizzazioni",
  Members: "Membri",
  Member: "Membro",
  Admin: "Amministratore",
  Owner: "Proprietario",
  Role: "Ruolo",
  Permissions: "Permessi",
  Search: "Cerca",
  Filter: "Filtra",
  Refresh: "Aggiorna",
  Save: "Salva",
  Cancel: "Annulla",
  Close: "Chiudi",
  Delete: "Elimina",
  Remove: "Rimuovi",
  Edit: "Modifica",
  Update: "Aggiorna",
  Create: "Crea",
  Add: "Aggiungi",
  Connect: "Connetti",
  Disconnect: "Disconnetti",
  Enable: "Abilita",
  Disable: "Disabilita",
  Start: "Avvia",
  Stop: "Arresta",
  Restart: "Riavvia",
  Deploy: "Distribuisci",
  Redeploy: "Distribuisci nuovamente",
  Continue: "Continua",
  Back: "Indietro",
  Next: "Avanti",
  Previous: "Precedente",
  Confirm: "Conferma",
  Copy: "Copia",
  Download: "Scarica",
  Upload: "Carica",
  Select: "Seleziona",
  Login: "Accedi",
  Logout: "Esci",
  Password: "Password",
  Email: "Email",
  "Sign in": "Accedi",
  "Sign out": "Esci",
  "Forgot password?": "Password dimenticata?",
  "Reset password": "Reimposta password",
  "Create account": "Crea account",
  "No results found.": "Nessun risultato trovato.",
  "No data available": "Nessun dato disponibile",
  "Loading...": "Caricamento...",
  "Please wait": "Attendi",
  "Copied to clipboard": "Copiato negli appunti",
  "Are you sure?": "Sei sicuro?",
  "This action cannot be undone.": "Questa azione non può essere annullata.",
  "Save changes": "Salva modifiche",
  "Unsaved changes": "Modifiche non salvate",
  "Test Connection": "Verifica connessione",
  "Add Server": "Aggiungi server",
  "Add Service": "Aggiungi servizio",
  "Add Domain": "Aggiungi dominio",
  "Add Variable": "Aggiungi variabile",
  "Add Port": "Aggiungi porta",
  "Add Volume": "Aggiungi volume",
  "Add User": "Aggiungi utente",
  "Add organization": "Aggiungi organizzazione",
  "Select Organization": "Seleziona organizzazione",
  "Pending Invitations": "Inviti in attesa",
  "Accept Invitation": "Accetta invito",
  "Delete Organization": "Elimina organizzazione",
  "Default organization": "Organizzazione predefinita",
  "Set as default": "Imposta come predefinita",
  "AI Assistant": "Assistente IA",
  "AI Settings": "Impostazioni IA",
  "API Key": "Chiave API",
  "Access Token": "Token di accesso",
  "New Project": "Nuovo progetto",
  "New Service": "Nuovo servizio",
  "View logs": "Visualizza log",
  "View details": "Visualizza dettagli",
  "Last updated": "Ultimo aggiornamento",
  "Created at": "Creato il",
  "Updated at": "Aggiornato il",
};

const words: Record<string, string> = {
  add: "aggiungi",
  create: "crea",
  update: "aggiorna",
  delete: "elimina",
  remove: "rimuovi",
  save: "salva",
  cancel: "annulla",
  close: "chiudi",
  select: "seleziona",
  search: "cerca",
  loading: "caricamento",
  enabled: "abilitato",
  disabled: "disabilitato",
  active: "attivo",
  inactive: "inattivo",
  running: "in esecuzione",
  stopped: "arrestato",
  failed: "non riuscito",
  pending: "in attesa",
  settings: "impostazioni",
  server: "server",
  servers: "server",
  project: "progetto",
  projects: "progetti",
  service: "servizio",
  services: "servizi",
  application: "applicazione",
  applications: "applicazioni",
  user: "utente",
  users: "utenti",
  member: "membro",
  members: "membri",
  organization: "organizzazione",
  organizations: "organizzazioni",
  domain: "dominio",
  domains: "domini",
  notification: "notifica",
  notifications: "notifiche",
  deployment: "distribuzione",
  deployments: "distribuzioni",
  environment: "ambiente",
  environments: "ambienti",
  password: "password",
  name: "nome",
  description: "descrizione",
  status: "stato",
  type: "tipo",
  role: "ruolo",
  permission: "permesso",
  permissions: "permessi",
  connection: "connessione",
  configuration: "configurazione",
  required: "obbligatorio",
  optional: "facoltativo",
  advanced: "avanzate",
  general: "generali",
  new: "nuovo",
  previous: "precedente",
  next: "avanti",
  back: "indietro",
  all: "tutti",
  none: "nessuno",
};

const excluded =
  "code, pre, textarea, [contenteditable='true'], [data-no-translate]";
function translate(value: string) {
  const leading = value.match(/^\s*/)?.[0] ?? "";
  const trailing = value.match(/\s*$/)?.[0] ?? "";
  const core = value.trim();
  if (!core) return value;
  if (exact[core]) return leading + exact[core] + trailing;
  if (core.length > 240 || /[{}<>`]|https?:\/\//.test(core)) return value;
  let out = core;
  for (const [from, to] of Object.entries(words)) {
    out = out.replace(new RegExp(`\\b${from}\\b`, "gi"), (match) =>
      match[0] === match[0]?.toUpperCase()
        ? to.charAt(0).toUpperCase() + to.slice(1)
        : to,
    );
  }
  return leading + out + trailing;
}
function process(root: ParentNode) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];
  while (walker.nextNode()) nodes.push(walker.currentNode as Text);
  for (const node of nodes) {
    const parent = node.parentElement;
    if (!parent || parent.closest(excluded)) continue;
    const next = translate(node.data);
    if (next !== node.data) node.data = next;
  }
  const elements =
    root instanceof Element
      ? [root, ...root.querySelectorAll("*")]
      : [...root.querySelectorAll("*")];
  for (const element of elements) {
    if (element.closest(excluded)) continue;
    for (const attr of ["placeholder", "title", "aria-label"]) {
      const value = element.getAttribute(attr);
      if (value) element.setAttribute(attr, translate(value));
    }
  }
}
export function ItalianLocalizationProvider() {
  useEffect(() => {
    process(document.body);
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "characterData" && mutation.target.parentNode)
          process(mutation.target.parentNode);
        for (const node of mutation.addedNodes)
          if (node instanceof Element) process(node);
      }
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });
    return () => observer.disconnect();
  }, []);
  return null;
}
