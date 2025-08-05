"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

export default function Dashboard() {
  const { lang } = useParams();

  return (
    <div>
      <Link href={`/${lang}/admin`}>go to admin</Link>
    </div>
  );
}
