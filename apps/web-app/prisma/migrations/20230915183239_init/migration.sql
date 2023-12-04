-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "UserVstAssociation" (
    "id" SERIAL NOT NULL,
    "wantsAt" TIMESTAMP(3),
    "ownsAt" TIMESTAMP(3),
    "likesAt" TIMESTAMP(3),
    "userId" TEXT NOT NULL,
    "vstId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "likedCommentIds" INTEGER[],

    CONSTRAINT "UserVstAssociation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserCollectionAssociation" (
    "id" SERIAL NOT NULL,
    "likesAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "collectionId" INTEGER NOT NULL,

    CONSTRAINT "UserCollectionAssociation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VstCreator" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "website" TEXT,
    "photoUrl" TEXT,
    "verifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "VstCreator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Collection" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT,
    "description" TEXT,
    "hasOrder" BOOLEAN NOT NULL,
    "private" BOOLEAN NOT NULL,
    "iconUrl" TEXT,
    "countLikes" INTEGER NOT NULL DEFAULT 0,
    "countComments" INTEGER NOT NULL DEFAULT 0,
    "publishedAt" TIMESTAMP(3),
    "popularDate" TIMESTAMP(3),
    "featuredAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "userId" TEXT NOT NULL,

    CONSTRAINT "Collection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CollectionVst" (
    "id" SERIAL NOT NULL,
    "note" TEXT,
    "order" INTEGER NOT NULL,
    "vstName" TEXT,
    "iconUrl" TEXT,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "collectionId" INTEGER NOT NULL,
    "vstId" INTEGER NOT NULL,
    "properties" JSONB,

    CONSTRAINT "CollectionVst_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vst" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "version" TEXT,
    "overview" TEXT,
    "iconUrl" TEXT,
    "releasedDate" TIMESTAMP(3),
    "officialUrl" TEXT,
    "popularDate" TIMESTAMP(3),
    "featuredAt" TIMESTAMP(3),
    "systemRequirements" JSONB,
    "priceType" INTEGER NOT NULL DEFAULT 0,
    "bundleName" TEXT,
    "isInstrument" BOOLEAN NOT NULL DEFAULT false,
    "audioPreviewWithUrl" TEXT,
    "audioPreviewWithoutUrl" TEXT,
    "complexityRating" INTEGER,
    "images" JSONB,
    "countLikes" INTEGER NOT NULL DEFAULT 0,
    "countOwns" INTEGER NOT NULL DEFAULT 0,
    "countWants" INTEGER NOT NULL DEFAULT 0,
    "countComments" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "creatorId" INTEGER,
    "creatorName" TEXT,
    "tags" TEXT[],

    CONSTRAINT "Vst_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VstProperty" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" INTEGER NOT NULL,
    "defaultValue" TEXT NOT NULL,
    "vstId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "VstProperty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WhereToFind" (
    "id" SERIAL NOT NULL,
    "currency" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "vendorName" TEXT NOT NULL,
    "vendorId" INTEGER,
    "vstId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "WhereToFind_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vendor" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Vendor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VstComment" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "dislikes" INTEGER NOT NULL DEFAULT 0,
    "repliesToCommentId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "userId" TEXT NOT NULL,
    "vstId" INTEGER NOT NULL,

    CONSTRAINT "VstComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CollectionComment" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "dislikes" INTEGER NOT NULL DEFAULT 0,
    "repliesToCommentId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "userId" TEXT NOT NULL,
    "collectionId" INTEGER NOT NULL,

    CONSTRAINT "CollectionComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Achievement" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "badgeUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Achievement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAchievement" (
    "id" SERIAL NOT NULL,
    "level" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "userId" TEXT NOT NULL,
    "achievementId" INTEGER NOT NULL,

    CONSTRAINT "UserAchievement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE INDEX "UserVstAssociation_userId_vstId_idx" ON "UserVstAssociation"("userId", "vstId");

-- CreateIndex
CREATE UNIQUE INDEX "UserVstAssociation_userId_vstId_key" ON "UserVstAssociation"("userId", "vstId");

-- CreateIndex
CREATE INDEX "UserCollectionAssociation_userId_idx" ON "UserCollectionAssociation" USING HASH ("userId");

-- CreateIndex
CREATE INDEX "UserCollectionAssociation_collectionId_idx" ON "UserCollectionAssociation" USING HASH ("collectionId");

-- CreateIndex
CREATE UNIQUE INDEX "UserCollectionAssociation_userId_collectionId_key" ON "UserCollectionAssociation"("userId", "collectionId");

-- CreateIndex
CREATE UNIQUE INDEX "VstCreator_slug_key" ON "VstCreator"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Collection_slug_key" ON "Collection"("slug");

-- CreateIndex
CREATE INDEX "popularDate" ON "Collection"("popularDate");

-- CreateIndex
CREATE INDEX "name" ON "Collection"("name");

-- CreateIndex
CREATE INDEX "slug" ON "Collection" USING HASH ("slug");

-- CreateIndex
CREATE INDEX "Collection_userId_idx" ON "Collection" USING HASH ("userId");

-- CreateIndex
CREATE INDEX "CollectionVst_collectionId_idx" ON "CollectionVst" USING HASH ("collectionId");

-- CreateIndex
CREATE UNIQUE INDEX "Vst_slug_key" ON "Vst"("slug");

-- CreateIndex
CREATE INDEX "idx_tags" ON "Vst" USING GIN ("tags");

-- CreateIndex
CREATE INDEX "idx_isInstrument" ON "Vst" USING HASH ("isInstrument");

-- CreateIndex
CREATE INDEX "Vst_deletedAt_idx" ON "Vst" USING HASH ("deletedAt");

-- CreateIndex
CREATE INDEX "idx_createdAt" ON "Vst"("createdAt");

-- CreateIndex
CREATE INDEX "idx_countLikes" ON "Vst"("countLikes");

-- CreateIndex
CREATE INDEX "idx_name" ON "Vst"("name");

-- CreateIndex
CREATE INDEX "WhereToFind_vstId_idx" ON "WhereToFind" USING HASH ("vstId");

-- CreateIndex
CREATE INDEX "vstId" ON "VstComment" USING HASH ("vstId");

-- CreateIndex
CREATE INDEX "collectionId" ON "CollectionComment" USING HASH ("collectionId");

-- CreateIndex
CREATE INDEX "userId" ON "UserAchievement" USING HASH ("userId");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserVstAssociation" ADD CONSTRAINT "UserVstAssociation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserVstAssociation" ADD CONSTRAINT "UserVstAssociation_vstId_fkey" FOREIGN KEY ("vstId") REFERENCES "Vst"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCollectionAssociation" ADD CONSTRAINT "UserCollectionAssociation_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCollectionAssociation" ADD CONSTRAINT "UserCollectionAssociation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Collection" ADD CONSTRAINT "Collection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectionVst" ADD CONSTRAINT "CollectionVst_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectionVst" ADD CONSTRAINT "CollectionVst_vstId_fkey" FOREIGN KEY ("vstId") REFERENCES "Vst"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vst" ADD CONSTRAINT "Vst_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "VstCreator"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VstProperty" ADD CONSTRAINT "VstProperty_vstId_fkey" FOREIGN KEY ("vstId") REFERENCES "Vst"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WhereToFind" ADD CONSTRAINT "WhereToFind_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WhereToFind" ADD CONSTRAINT "WhereToFind_vstId_fkey" FOREIGN KEY ("vstId") REFERENCES "Vst"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VstComment" ADD CONSTRAINT "VstComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VstComment" ADD CONSTRAINT "VstComment_vstId_fkey" FOREIGN KEY ("vstId") REFERENCES "Vst"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectionComment" ADD CONSTRAINT "CollectionComment_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectionComment" ADD CONSTRAINT "CollectionComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAchievement" ADD CONSTRAINT "UserAchievement_achievementId_fkey" FOREIGN KEY ("achievementId") REFERENCES "Achievement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAchievement" ADD CONSTRAINT "UserAchievement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
