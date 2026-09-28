import postgres from "postgres";

type SqlClient = ReturnType<typeof postgres>;

const globalForDb = globalThis as typeof globalThis & {
  __fellacooSqlClient?: SqlClient;
};

export function getDb() {
  const url = process.env.DATABASE_URL;

  if (!url) {
    throw new Error("DATABASE_URL is not configured.");
  }

  if (!globalForDb.__fellacooSqlClient) {
    globalForDb.__fellacooSqlClient = postgres(url, {
      max: 1,
      prepare: false,
      ssl: "require",
      connect_timeout: 10,
      idle_timeout: 20,
    });
  }

  return globalForDb.__fellacooSqlClient;
}
