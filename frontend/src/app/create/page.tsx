import { redirect } from 'next/navigation';

export default function CreateLeadRedirectPage() {
  redirect('/leads/create');
}
