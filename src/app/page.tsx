// app/page.tsx
import { Drink } from '@/types/drink';
import OrderApp from '../components/OrderApp';
import { Member } from '@/types/member';

export default async function Page() {
  const res1 = await fetch('/api/drink', { cache: 'no-store' });
  const drinks: Drink[] = await res1.json();

  const res2 = await fetch('/api/member', { cache: 'no-store' });
  const members: Member[] = await res2.json();

  return (
    <main>
      <OrderApp initialDrinks={drinks} initialMembers={members} />
    </main>
  );
}
