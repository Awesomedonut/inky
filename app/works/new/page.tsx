import WorkForm from "@/components/WorkForm";

export default function NewWorkPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Post a New Work</h1>
      <WorkForm mode="create" />
    </div>
  );
}
