export function buildWhatsAppUrl(params: {
  whatsappNum: string;
  tourTitle: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  comment?: string;
}): string {
  const { whatsappNum, tourTitle, checkIn, checkOut, adults, children, comment } = params;

  const lines = [
    `Здравствуйте! Хочу забронировать тур 🌄`,
    ``,
    `📍 *Тур:* ${tourTitle}`,
    `📅 *Дата заезда:* ${checkIn}`,
    `📅 *Дата выезда:* ${checkOut}`,
    `👨‍👩‍👧 *Взрослых:* ${adults}`,
    `👶 *Детей:* ${children}`,
  ];

  if (comment) {
    lines.push(`💬 *Комментарий:* ${comment}`);
  }

  lines.push(``, `Прошу связаться со мной!`);

  const message = lines.join("\n");
  return `https://wa.me/${whatsappNum}?text=${encodeURIComponent(message)}`;
}
