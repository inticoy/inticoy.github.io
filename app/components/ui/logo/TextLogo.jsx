import { Orbitron } from "next/font/google";

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export default function TextLogo() {
  return (
    <p
      className={`${orbitron.className} ml-4 text-xl font-bold whitespace-nowrap text-slate-800 hover:text-slate-500 dark:text-slate-200 dark:hover:text-amber-400`}
    >
      I N T I C O Y
    </p>
  );
}
