import { Navbar } from '@/widgets/navbar';
import { Footer } from '@/widgets/footer';
import { CVDashboard } from '@/widgets/cv-dashboard';

export default function IndexPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex flex-col">
      <Navbar />
      <CVDashboard />
      <Footer />
    </div>
  );
}
