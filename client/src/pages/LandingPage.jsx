import { Link } from 'react-router-dom';
import { HomeIcon, CheckBadgeIcon, SparklesIcon } from '@heroicons/react/24/solid';

const services = [
  'AC Repair & Maintenance',
  'Electrician',
  'Plumbing',
  'Carpenter',
  'Appliance Repair',
  'Cleaning',
  'Painting',
  'CCTV Installation',
  'Water Tank Cleaning'
];

const features = [
  { title: 'Verified professionals', description: 'Every provider is verified by FixNear before they can accept jobs.' },
  { title: 'Transparent pricing', description: 'Compare service providers with clear pricing, ratings, and reviews.' },
  { title: 'Local support', description: 'Focused on Islamabad and Rawalpindi with fast on-site service options.' }
];

function LandingPage() {
  return (
    <main>
      <section className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-accent">Trusted Home Services</p>
              <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
                Trusted Home Services, Near You.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
                Book verified professionals for repairs, maintenance and home services across Islamabad and Rawalpindi.
              </p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Link to="/register" className="inline-flex items-center justify-center rounded-full bg-brand-accent px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-600">
                  Book a Service
                </Link>
                <Link to="/register" className="inline-flex items-center justify-center rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                  Become a Professional
                </Link>
              </div>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              {services.slice(0, 6).map((service) => (
                <div key={service} className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
                  <h3 className="text-base font-semibold text-slate-900">{service}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="rounded-3xl bg-white p-8 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-accent/10 text-brand-accent">
                  <SparklesIcon className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-slate-900">{feature.title}</h3>
                <p className="mt-4 text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col gap-12 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-accent">Why FixNear</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">Home service bookings with confidence.</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:w-[40rem]">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                <p className="text-sm font-semibold text-slate-900">Verified & trusted</p>
                <p className="mt-3 text-slate-600">Providers are verified, reviewed and rated after every completed appointment.</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                <p className="text-sm font-semibold text-slate-900">Local coverage</p>
                <p className="mt-3 text-slate-600">Specialized in Islamabad and Rawalpindi with fast response and transparent service area matching.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-accent">Popular services</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">Service categories we serve.</h2>
              <p className="mt-6 max-w-xl text-slate-600">Find trusted professionals for every major home service need, from electrical repairs to full appliance servicing.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {services.map((service) => (
                <div key={service} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="text-base font-semibold text-slate-900">{service}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-accent">Cities served</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">Islamabad and Rawalpindi, focused locally.</h2>
              <p className="mt-6 text-slate-600">Build a trusted home-services experience for residents in Islamabad and Rawalpindi with curated provider selection.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                <p className="text-lg font-semibold text-slate-900">Islamabad</p>
                <p className="mt-3 text-slate-600">Blue Area, F-6, F-7, G-6, Bahria Town, and nearby sectors.</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                <p className="text-lg font-semibold text-slate-900">Rawalpindi</p>
                <p className="mt-3 text-slate-600">Saddar, Gulzar-e-Quaid, Bahria Town, Chaklala, and surrounding neighborhoods.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-brand text-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xl font-semibold">FixNear</p>
              <p className="mt-2 max-w-lg text-sm text-slate-200">Trusted home services, near you.</p>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-slate-200">
              <Link to="/" className="hover:text-white">Home</Link>
              <Link to="/login" className="hover:text-white">Login</Link>
              <Link to="/register" className="hover:text-white">Register</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

export default LandingPage;
