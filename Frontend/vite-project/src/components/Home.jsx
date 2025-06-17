import { Hero } from "../components/Hero";
import { Models } from "../components/Models";
import { Products } from "../components/Products";

export default function Home() {
  return (
    <main>
      <Hero />
      <section id="models">
        <Models />
      </section>
      <section id="products">
        <Products />
      </section>
    </main>
  );
}
