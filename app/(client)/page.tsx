import CarruselGaleria from "../components/ui/CarruselGaleria";
import CarruselPromociones from "../components/ui/CarruselPromociones";
import ProductSection from "../components/products/ProductSection";

export default function Home() {
  return (
    <main>
      <CarruselPromociones />
      <ProductSection
        title="¡Conoce nuestros productos con promociones!"
        filterType="all"
        limit={5}
        asCarousel={true}
      />
      
    </main>
  );
}
