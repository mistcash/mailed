import JWTInputGenerator from "@/components/JWTInputGenerator";

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8">
      <JWTInputGenerator />
    </div>
  );
}
