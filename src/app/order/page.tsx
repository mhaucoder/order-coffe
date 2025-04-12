import { Drink } from '@/types/drink';
import { Customer } from '@/types/customer';
import OrderApp from '@/components/OrderApp';

export default async function Page() {
  const res1 = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/drink`, { cache: 'no-store' });
  const drinks: Drink[] = await res1.json();

  const res2 = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/customer`, { cache: 'no-store' });
  const customers: Customer[] = await res2.json();

  return (
    <main>
      <OrderApp initialDrinks={drinks} initialCustomers={customers} />
    </main>
  );
}
