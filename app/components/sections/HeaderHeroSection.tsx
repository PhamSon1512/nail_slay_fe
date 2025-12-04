import { Button } from "@heroui/react";
import { LazyImage } from "~/components/LazyImage";

const ratings = [
  {
    image: "/8753abd574b62fc1693969956fe559ea01edcc9a.png",
  },
  {
    image: "/a2aebb42996f7a4b239fa874a4c7315f9803040b.png",
  },
  {
    image: "/86a21da1959273da49f5fe383ad218f71d7713f8.png",
  },
  {
    image: "/b3e5044ac3c4ed913b23f633e8ae90f16f54fe8a.png",
  },
];

export function HeaderHeroSection() {
  return (
    <section className="container py-16">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-4">
            <div className="flex -space-x-4">
              {ratings.map((rating, index) => (
                <LazyImage
                  key={index}
                  src={rating.image}
                  alt="Rating"
                  className="w-10 h-10 rounded-full object-cover border-2 border-white"
                />
              ))}
              <div className="w-10 h-10 rounded-full bg-brand flex items-center justify-center text-white font-bold text-xs">
                +20K
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <p className="text-sm text-text-subtle">Based on 20K+ Reviews</p>
            </div>
          </div>
          <h1 className="text-5xl font-bold text-text-main tracking-tighter">
            Search any doctors & plan your next visit
          </h1>
          <p className="text-text-subtle">
            Experience leading healthcare services with expert treatments
            tailored to your work needs
          </p>
          <div className="flex items-center gap-4">
            <Button className="bg-brand hover:bg-brand/90 text-white">
              Contact us
            </Button>
            <Button variant="link" className="text-text-main">
              What we do
            </Button>
          </div>
        </div>
        <div className="hidden md:block">
          <LazyImage
            src="/6e0717e5e980719c255ec2ce97b533b989ab3f26.png"
            alt="Hero Image"
            className="rounded-lg"
          />
        </div>
      </div>
    </section>
  );
}