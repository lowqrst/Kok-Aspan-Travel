-- CreateTable
CREATE TABLE "Tour" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "titleKz" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL,
    "descriptionKz" TEXT NOT NULL DEFAULT '',
    "route" TEXT,
    "routeKz" TEXT,
    "price" REAL NOT NULL,
    "childPrice" REAL,
    "duration" INTEGER NOT NULL,
    "category" TEXT NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Image" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "url" TEXT NOT NULL,
    "tourId" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "Image_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES "Tour" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Settings" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'main',
    "whatsappNum" TEXT NOT NULL DEFAULT '77059652303',
    "companyName" TEXT NOT NULL DEFAULT 'Altosh Travel',
    "contactInfo" TEXT
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_username_key" ON "Admin"("username");
