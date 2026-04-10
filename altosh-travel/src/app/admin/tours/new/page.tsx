import TourForm from "@/components/admin/TourForm";

export default function NewTourPage() {
  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: "white", marginBottom: 4 }}>
          Новый тур
        </h1>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>
          Заполните данные нового тура
        </p>
      </div>
      <TourForm />
    </div>
  );
}
