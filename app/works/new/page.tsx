import WorkForm from "@/components/WorkForm";

export default function NewWorkPage() {
  return (
    <div>
      <h1 className="text-3xl text-teal-900 mb-4">Post a New Work</h1>
      <WorkForm mode="create" />
    </div>
  );
}
