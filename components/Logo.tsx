import Image from "next/image";

/** Logo officiel Swiftflow (fichier source : 416x134px, fond transparent). */
export default function Logo({ className = "h-7" }: { className?: string }) {
  return (
    <Image
      src="/swiftflow-logo.png"
      alt="Swiftflow"
      width={416}
      height={134}
      priority
      className={`w-auto ${className}`}
    />
  );
}
