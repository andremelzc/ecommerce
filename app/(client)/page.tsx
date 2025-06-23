import CarruselPromociones from "../components/ui/CarruselPromociones";
import ProductSection from "../components/products/ProductSection";
import CarruselMarcas from "../components/ui/CarruselMarcas";
export default function Home() {
  return (
    <main className="bg-ebony-50">
      <CarruselPromociones />
      <ProductSection
        title="¡Conoce nuestros productos con promociones!"
        filterType="all"
        limit={10}
        asCarousel={true}
      />
      <CarruselMarcas />
    </main>
  );
}
