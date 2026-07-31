import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

// Driver HTTP serverless de Neon : une requête = un appel HTTP, sans pool de
// connexions TCP à gérer. Idéal pour les routes API Next.js (App Router),
// qui s'exécutent dans des fonctions serverless/edge éphémères.
//
// L'initialisation est volontairement paresseuse (au premier appel, pas à
// l'import du module) : Next.js importe chaque route pour inspecter ses
// exports (ex. `dynamic`) pendant l'étape "Collecting page data" du build,
// y compris quand DATABASE_URL n'est pas encore défini (CI, build local
// sans .env). Lever une erreur dès l'import ferait donc échouer le build
// lui-même, alors que seul le runtime a réellement besoin de la variable.
let _sql: NeonQueryFunction<false, false> | undefined;

function getClient(): NeonQueryFunction<false, false> {
  if (!_sql) {
    const url = process.env.DATABASE_URL;
    if (!url) {
      throw new Error(
        "DATABASE_URL est manquant. Copiez .env.example vers .env.local et renseignez " +
          "la chaîne de connexion Neon (voir README.md, section Configuration Neon)."
      );
    }
    _sql = neon(url);
  }
  return _sql;
}

// Proxy qui délègue à l'instance réelle, créée au premier usage effectif
// (appel en tagged-template `sql\`...\`` ou `sql.query(...)`).
export const sql = new Proxy(function () {} as unknown as NeonQueryFunction<false, false>, {
  apply(_target, _thisArg, args) {
    const client = getClient();
    return (client as unknown as (...a: unknown[]) => unknown)(...args);
  },
  get(_target, prop, receiver) {
    const client = getClient();
    return Reflect.get(client as object, prop, receiver);
  },
});
