import { motion } from "framer-motion";
import image1 from "../assets/images/iphone15.jpg";
import image2 from "../assets/images/iphone16.jpg";
import image3 from "../assets/images/iphone16-pro.jpg";

const models = [
  {
    id: 1,
    name: "iPhone 15 Pro",
    description:
      "The iPhone 15 Pro features a titanium frame, A17 Pro chip, and a new Action button.",
    image: image1,
  },
  {
    id: 2,
    name: "iPhone 16",
    description:
      "The base model of the latest generation with enhanced battery life.",
    image: image2,
  },
  {
    id: 3,
    name: "iPhone 16 Pro",
    description:
      "A professional-tier device featuring advanced camera capabilities.",
    image: image3,
  },
];

export function Models() {
  return (
    <section className="py-20 bg-gray-50 ">
      <div className="max-w-7xl mx-auto px-10">
        <h2 className="text-3xl font-bold text-gray-900  mb-8">
          Explore iPhone 15 & 16 Models
        </h2>
        <div className="grid gap-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {models.map((model) => (
            <motion.div
              key={model.id}
              whileHover={{ scale: 1.03 }}
              className=" rounded-3xl transition relative h-[480px] cursor-pointer w-[360px] shadow-black shadow-sm backdrop-blur-xl bg-white "
            >
              <img
                src={model.image}
                alt={model.name}
                className="object-cover rounded-2xl pt-15"
              />
              <div className="absolute top-1 px-5 py-2">
                <h3 className="mt-1 text-xl font-bold text-black">
                  {model.name}
                </h3>
                <p className="text-black mt-2 text-sm font-semibold ">{model.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
