-- DropForeignKey
ALTER TABLE "Adventure" DROP CONSTRAINT "Adventure_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Tag" DROP CONSTRAINT "Tag_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "TagInAdventure" DROP CONSTRAINT "TagInAdventure_adventureId_fkey";

-- DropForeignKey
ALTER TABLE "TagInAdventure" DROP CONSTRAINT "TagInAdventure_tagId_fkey";

-- AddForeignKey
ALTER TABLE "Adventure" ADD CONSTRAINT "Adventure_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tag" ADD CONSTRAINT "Tag_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagInAdventure" ADD CONSTRAINT "TagInAdventure_adventureId_fkey" FOREIGN KEY ("adventureId") REFERENCES "Adventure"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagInAdventure" ADD CONSTRAINT "TagInAdventure_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
