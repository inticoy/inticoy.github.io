import { BentoGrid } from "@/components/home/bento-grid";
import { ProfileCard, ProjectsCard, WritingCard, ThemeCard, SnapshootCard, TechStackCard, MapCard, SpotifyCard } from "@/components/home/cards";

export default function Home() {
  return (
    <main className="mt-24 md:mt-12 p-8 md:p-24 bg-background flex flex-col items-center">
      <BentoGrid className="w-full max-w-5xl">
        <ProfileCard key="profile" />
        <ThemeCard key="theme" />
        <SnapshootCard key="snapshoot" />
        <TechStackCard key="tech" />
        <MapCard key="map" />
        <SpotifyCard key="spotify" />
        <ProjectsCard key="projects" />
        <WritingCard key="writing" />
      </BentoGrid>
    </main>
  );
}
