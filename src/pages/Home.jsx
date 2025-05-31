import Clients from "../sections/Clients";
import About from "../sections/About";
import Contact from "../sections/Contact";
import Hero from "../sections/Hero";
import PopularAreas from "../sections/PopularAreas";
import Properties from "../sections/Properties";
import Services from "../sections/services";

const Home = () => {
  return (
    <div
      className=""
    >
      <Hero />
      <About />
      <PopularAreas />
      <Properties />
      <Services />
      <Clients />
      <Contact />
    </div>
  );
};
export default Home;
