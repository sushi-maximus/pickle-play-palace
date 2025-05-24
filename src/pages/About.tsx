
import { AppLayout } from "@/components/layout/AppLayout";

const About = () => {
  return (
    <AppLayout title="About">
      <div className="py-4">
        <h1 className="text-4xl font-bold mb-6">About Pickle Ninja</h1>
        <div className="prose prose-lg max-w-none">
          <p>
            Pickle Ninja is the ultimate platform for pickleball enthusiasts to connect, organize games, and track their progress. Our mission is to grow the sport of pickleball by making it easier for players of all skill levels to find games, improve their skills, and join a vibrant community.
          </p>
          <p>
            Founded by a team of passionate pickleball players, Pickle Ninja aims to solve common challenges faced by players and event organizers:
          </p>
          <ul>
            <li>Finding players at your skill level</li>
            <li>Organizing games and tracking results</li>
            <li>Managing tournaments and leagues efficiently</li>
            <li>Building a supportive community around the sport</li>
          </ul>
          <p>
            Our platform is free to use for individual players, with a small commission only charged on paid events and tournaments. This allows us to maintain and improve the platform while keeping it accessible to everyone.
          </p>
          <p>
            Join Pickle Ninja today and become part of the fastest-growing pickleball community!
          </p>
        </div>
      </div>
    </AppLayout>
  );
};

export default About;
