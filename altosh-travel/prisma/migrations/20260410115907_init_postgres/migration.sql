-- CreateTable
CREATE TABLE "Tour" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "titleKz" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL,
    "descriptionKz" TEXT NOT NULL DEFAULT '',
    "route" TEXT,
    "routeKz" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "childPrice" DOUBLE PRECISION,
    "duration" INTEGER NOT NULL,
    "category" TEXT NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tour_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Image" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "tourId" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Settings" (
    "id" TEXT NOT NULL DEFAULT 'main',
    "whatsappNum" TEXT NOT NULL DEFAULT '77059652303',
    "companyName" TEXT NOT NULL DEFAULT 'Altosh Travel',
    "contactInfo" TEXT,

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_username_key" ON "Admin"("username");

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES "Tour"("id") ON DELETE CASCADE ON UPDATE CASCADE;
