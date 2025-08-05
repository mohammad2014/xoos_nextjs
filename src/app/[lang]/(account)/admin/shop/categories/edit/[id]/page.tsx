import CreateEditShopCategoryForm from "@/components/account/form/CreateEditShopCategoryForm";
import ProtectWithPermissionWrapper from "@/components/account/ProtectWithPermissionWrapper";
import {
  getShopCategoriesList,
  getShopCategoryById,
} from "@/lib/api/shop-categories";

interface Props {
  params: Promise<{ id: number }>;
}

export default async function page({ params }: Props) {
  const { id } = await params;
  const shopCategory = await getShopCategoryById(id);
  const shopCategoriesList = await getShopCategoriesList();
  console.log(shopCategory);

  return (
    <ProtectWithPermissionWrapper requiredPermissions={["UpdateShopCategory"]}>
      <CreateEditShopCategoryForm
        defaultValue={shopCategory}
        shopCategoriesList={shopCategoriesList}
      />
    </ProtectWithPermissionWrapper>
  );
}
