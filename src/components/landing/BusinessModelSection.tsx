
import { Trophy, Users } from "lucide-react";

export function BusinessModelSection() {
  return (
    <section className="py-24 px-4 bg-muted/30 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-50"></div>
      
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-16 animate-[fade-in_0.6s_ease-out]">
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">Our approach</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2">Free to Use, Fair for All</h2>
          <div className="w-24 h-1 bg-primary mx-auto mt-6 mb-8"></div>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Pickle Ninja is completely free for individual players. We only charge a small commission on paid events and tournaments.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto">
          <div className="bg-card border-0 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow animate-[fade-in_0.5s_ease-out]" style={{ animationDelay: '100ms' }}>
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 transform transition-all hover:scale-110">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-2xl font-semibold mb-5">For Players</h3>
            <ul className="space-y-5">
              <li className="flex items-start gap-3">
                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 mt-0.5">✓</span>
                <span className="text-lg">Create your player profile for free</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 mt-0.5">✓</span>
                <span className="text-lg">Join groups and chat with other players</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 mt-0.5">✓</span>
                <span className="text-lg">Track your matches and progress</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 mt-0.5">✓</span>
                <span className="text-lg">Join free events and games</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-card border-0 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow animate-[fade-in_0.5s_ease-out]" style={{ animationDelay: '300ms' }}>
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 transform transition-all hover:scale-110">
              <Trophy className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-2xl font-semibold mb-5">For Organizers</h3>
            <ul className="space-y-5">
              <li className="flex items-start gap-3">
                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 mt-0.5">✓</span>
                <span className="text-lg">Organize free events at no cost</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 mt-0.5">✓</span>
                <span className="text-lg">Create paid tournaments with easy payment processing</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="inline-block px-2.5 py-0.5 bg-primary text-primary-foreground rounded text-sm font-medium">FAIR</span>
                <span className="text-lg">Only 10-20% commission on paid events</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 mt-0.5">✓</span>
                <span className="text-lg">Powerful tools for managing registrations</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
