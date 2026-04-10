import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash("admin123", 10);
  await prisma.admin.upsert({
    where: { username: "admin" },
    update: {},
    create: { username: "admin", password: hashedPassword },
  });

  // Create default settings
  await prisma.settings.upsert({
    where: { id: "main" },
    update: {},
    create: {
      id: "main",
      whatsappNum: "77059652303",
      companyName: "Vostok Travel",
      contactInfo: "Казахстан",
    },
  });

  // Create sample tours
  const tours = [
    {
      title: "Тур по Алтаю",
      titleKz: "Алтай туры",
      description: "Незабываемое путешествие по горным хребтам Казахстанского Алтая. Кристальные озёра, водопады и нетронутая природа.",
      descriptionKz: "Қазақстанның Алтай тауларымен ұмытылмас саяхат. Мөлдір көлдер, сарқырамалар және таза табиғат.",
      route: "Алматы → Усть-Каменогорск → Катон-Карагай → Рахман ключи",
      price: 85000,
      childPrice: 50000,
      duration: 7,
      category: "mountains",
      isPublished: true,
    },
    {
      title: "Озеро Балхаш",
      titleKz: "Балқаш көлі",
      description: "Уникальное озеро с двумя абсолютно разными берегами — пресноводным и солёным. Рыбалка, отдых на берегу.",
      descriptionKz: "Тұщы су мен тұзды жағалауы бар бірегей көл. Балық аулау, жағалауда демалу.",
      route: "Алматы → Балхаш → рыбацкие лагеря",
      price: 45000,
      childPrice: 25000,
      duration: 3,
      category: "lakes",
      isPublished: true,
    },
    {
      title: "Степи Казахстана",
      titleKz: "Қазақстан даласы",
      description: "Погружение в бескрайнюю степь Казахстана. Ночёвки в юртах, традиционная кухня, скачки на лошадях.",
      descriptionKz: "Қазақстанның шексіз даласына сүңгіп кіру. Кигіз үйде түнеу, дәстүрлі тағам, ат жарысы.",
      route: "Нур-Султан → Кургальджино → Степные лагеря",
      price: 35000,
      childPrice: 20000,
      duration: 4,
      category: "steppe",
      isPublished: true,
    },
  ];

  for (const tour of tours) {
    await prisma.tour.create({ data: tour });
  }

  console.log("✅ Database seeded successfully!");
  console.log("Admin login: admin / admin123");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
