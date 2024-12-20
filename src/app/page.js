import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Jingle & Wish – Spread Joy This Holiday Season</title>
        <meta
          name="description"
          content="Connect, share, and celebrate the spirit of giving with Jingle & Wish!"
        />
      </Head>

      <nav className=" bg-transparent absolute text-white p-4 flex items-center justify-between w-full px-12">
        {/* Logo */}
        <Link href="/">
          <Image
            src="/logo.png" // Replace with your image path
            alt="Jingle & Wish Logo"
            width={60}
            height={60}
            className="cursor-pointer"
          />
        </Link>

        {/* Navigation Links */}
        <ul className="flex space-x-6">
          <li>
            <Link
              href="/gifts"
              className="bg-yellow-400 text-red-800 px-4 py-2 rounded-full font-semibold hover:bg-yellow-300"
            >
              Get Started
            </Link>
          </li>
        </ul>
      </nav>

      {/* Hero Section */}
      <section className="bg-beige text-white min-h-screen flex items-center">
      <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between px-6 py-12">
        
        {/* Text Content */}
        <div className="text-center lg:text-left lg:w-1/2 mb-10 lg:mb-0">
          <h1 className="text-5xl font-bold mb-6 text-black">
            🎄 Spread Joy This Holiday Season with{" "}
            <span className="text-yellow-500">Jingle & Wish</span> 🎁
          </h1>
          <p className="text-lg mb-8 text-gray-700">
            Connect, share, and celebrate the spirit of giving. Make wishes come
            true, donate extra items, and join festive events!
          </p>
          <Link
            href="/gifts"
            className="bg-yellow-400 text-red-800 px-6 py-3 rounded-full font-semibold hover:bg-yellow-300 transition duration-300"
          >
            Get Started
          </Link>
        </div>

        {/* Image */}
        <div className="flex items-center justify-center lg:justify-end lg:w-1/2">
          <Image
            src="/home-hero.png" // Replace with your image path
            alt="Santa Claus"
            width={350}
            height={350}
            className="cursor-pointer"
          />
        </div>

      </div>
    </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-100 landing-bg-2">
        <h2 className="text-3xl font-bold text-center mb-8">What You Can Do</h2>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-white shadow rounded-lg text-center">
            <h3 className="text-2xl font-bold mb-2">🎁 Post Your Wishes</h3>
            <p>
              Share your Christmas wishes and let others help make them a
              reality.
            </p>
          </div>
          <div className="p-6 bg-white shadow rounded-lg text-center">
            <h3 className="text-2xl font-bold mb-2">❤️ Give to Others</h3>
            <p>
              Donate extra gifts or items to those in need and spread the
              holiday cheer.
            </p>
          </div>
          <div className="p-6 bg-white shadow rounded-lg text-center">
            <h3 className="text-2xl font-bold mb-2">🎉 Discover Events</h3>
            <p>
              Join or host festive events and celebrate the season with your
              community.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white landing-bg-2">
        <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>
        <ol className="max-w-4xl mx-auto list-decimal list-inside space-y-4 text-lg">
          <li>
            <strong>Sign Up</strong> – Create your profile and join the
            community.
          </li>
          <li>
            <strong>Post or Browse</strong> – Share wishes, donate items, or
            explore events.
          </li>
          <li>
            <strong>Connect & Celebrate</strong> – Make connections and spread
            joy this season!
          </li>
        </ol>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-100 landing-bg-3">
        <h2 className="text-3xl font-bold text-center mb-8">
          What Our Users Say
        </h2>
        <div className="max-w-4xl mx-auto space-y-8">
          <blockquote className="p-6 bg-white shadow rounded-lg">
            <p className="italic mb-2">
              "Jingle & Wish made my Christmas truly magical! I received a gift
              I wished for and gave away items I no longer needed. The community
              spirit is amazing!"
            </p>
            <footer className="text-right font-bold">– Emily, 21</footer>
          </blockquote>
          <blockquote className="p-6 bg-white shadow rounded-lg">
            <p className="italic mb-2">
              "Hosting a Christmas event and seeing everyone come together was
              heartwarming. This platform makes giving and connecting so easy!"
            </p>
            <footer className="text-right font-bold">– Mark, 25</footer>
          </blockquote>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-red-500 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Spread Joy?</h2>
        <p className="text-lg mb-8">
          Join Jingle & Wish and make this holiday season brighter for everyone!
        </p>
        <Link
          href="/gifts"
          className="bg-yellow-400 text-red-800 px-6 py-3 rounded-full font-semibold hover:bg-yellow-300"
        >
          Join Now
        </Link>
      </section>

      {/* Footer Section */}
      <footer className="py-6 bg-gray-800 text-gray-300 text-center">
        <p>&copy; 2024 Jingle & Wish. All rights reserved.</p>
        <p>
          <a href="#privacy-policy" className="hover:text-white">
            Privacy Policy
          </a>{" "}
          |
          <a href="#terms-of-service" className="hover:text-white">
            Terms of Service
          </a>
        </p>
      </footer>
    </div>
  );
}
