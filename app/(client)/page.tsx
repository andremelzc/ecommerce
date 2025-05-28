import CarruselGaleria from '../components/ui/CarruselGaleria';
import CarruselPromociones from '../components/ui/CarruselPromociones';
import ProductSection from '../components/products/ProductSection';

export default function Home() {
  return (
    <main>
      <CarruselPromociones />
      <ProductSection
        title="¡Conoce nuestros productos más vendidos!"
        filterType="bestSellers"
        limit={2}
        asCarousel={true}
      />
    </main>
  );
}
