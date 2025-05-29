import ProductDetail from "@/app/components/products/ProductDetail";
import ProductSection from "@/app/components/products/ProductSection";
async function getProduct(id: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const res = await fetch(`${baseUrl}/api/productos/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Error al obtener el producto");
  const data = await res.json();
  return data;
}

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const data = await getProduct(params.id);
  const product = Array.isArray(data) ? data[0] : data;

  return (
    <>
      <ProductDetail {...product} />
      <ProductSection
        title="Otros productos en la misma categoria"
        filterType="bestSellers"
        limit={2}
        asCarousel={true}
      />
    </>
  );
}
