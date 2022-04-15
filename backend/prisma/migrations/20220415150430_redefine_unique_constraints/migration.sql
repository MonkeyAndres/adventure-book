/*
  Warnings:

  - A unique constraint covering the columns `[id,authorId]` on the table `Adventure` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[label,creatorId]` on the table `Tag` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[tagId,adventureId]` on the table `TagInAdventure` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Tag_label_key";

-- CreateIndex
CREATE UNIQUE INDEX "Adventure_id_authorId_key" ON "Adventure"("id", "authorId");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_label_creatorId_key" ON "Tag"("label", "creatorId");

-- CreateIndex
CREATE UNIQUE INDEX "TagInAdventure_tagId_adventureId_key" ON "TagInAdventure"("tagId", "adventureId");
