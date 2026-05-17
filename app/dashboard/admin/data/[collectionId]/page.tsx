import { redirect } from "next/navigation";

type Props = {
  params: Promise<{ collectionId: string }>;
};

export default async function LegacyAdminCollectionPage({ params }: Props) {
  const { collectionId } = await params;
  redirect(`/admin/data/${collectionId}`);
}
