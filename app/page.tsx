import { BentoGrid } from "@/components/home/bento-grid";
import { ProfileCard, ProjectsCard, WritingsCard, ThemeCard, SnapshootCard, TechStackCard, MapCard, SpotifyCard } from "@/components/home/cards";
import { getAllPosts } from "@/lib/notion";

export default async function Home() {
  const posts = await getAllPosts();
  
  const projectPosts = posts.filter(p => p.category === 'project');
  const writingPosts = posts.filter(p => p.category === 'writing');

  return (
    <main className="mt-30 px-8 md:px-24 bg-background flex flex-col items-center">
      <BentoGrid className="w-full max-w-5xl">
        <ProfileCard key="profile" />
        <ThemeCard key="theme" />
        <SnapshootCard key="snapshoot" />
        <TechStackCard key="tech" />
        <MapCard key="map" />
        <SpotifyCard key="spotify" />
        <ProjectsCard key="projects" posts={projectPosts} />
        <WritingsCard key="writing" posts={writingPosts} />
      </BentoGrid>
    </main>
  );
}
