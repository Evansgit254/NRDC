-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Translation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "namespace" TEXT NOT NULL DEFAULT 'common',
    "key" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Translation" ("createdAt", "id", "key", "locale", "updatedAt", "value") SELECT "createdAt", "id", "key", "locale", "updatedAt", "value" FROM "Translation";
DROP TABLE "Translation";
ALTER TABLE "new_Translation" RENAME TO "Translation";
CREATE INDEX "Translation_locale_idx" ON "Translation"("locale");
CREATE UNIQUE INDEX "Translation_key_locale_namespace_key" ON "Translation"("key", "locale", "namespace");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
