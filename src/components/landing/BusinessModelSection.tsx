
import { Trophy, Users } from "lucide-react";

export function BusinessModelSection() {
  return (
    <section className="py-24 px-4 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <span className="text-sm uppercase tracking-wider text-primary font-semibold">Our approach</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2">Free to Use, Fair for All</h2>
          <div className="w-24 h-1 bg-primary mx-auto mt-6 mb-8"></div>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Pickle Ninja is completely free for individual players. We only charge a small commission on paid events and tournaments.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto">
          <div className="bg-card border-0 rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-2xl font-semibold mb-5">For Players</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="text-green-500 font-bold text-xl">✓</span>
                <span>Create your player profile for free</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-500 font-bold text-xl">✓</span>
                <span>Join groups and chat with other players</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-500 font-bold text-xl">✓</span>
                <span>Track your matches and progress</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-500 font-bold text-xl">✓</span>
                <span>Join free events and games</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-card border-0 rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <Trophy className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-2xl font-semibold mb-5">For Organizers</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="text-green-500 font-bold text-xl">✓</span>
                <span>Organize free events at no cost</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-500 font-bold text-xl">✓</span>
                <span>Create paid tournaments with easy payment processing</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-primary text-primary-foreground px-2 py-0.5 text-xs rounded font-medium">FAIR</span>
                <span>Only 10-20% commission on paid events</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-500 font-bold text-xl">✓</span>
                <span>Powerful tools for managing registrations</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
