import HistoryPage from "@/components/HistoryPage";
import { OrderHistory } from "@/types/order";

export default async function Page() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/history`, {cache: "no-store",});
  const history: OrderHistory[] = await res.json();
  return (
    <main>
      <HistoryPage initialOrderHistory={history} />
    </main>
  );
}
