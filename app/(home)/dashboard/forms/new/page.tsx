import FormWizard from "./wizard";

export default function NewFormPage() {
  return (
    <div className="p-8 text-white w-full max-w-4xl border border-zinc-800 bg-zinc-900/60 backdrop-blur-lg shadow-md rounded-lg mt-8">
      <h1 className="mb-6 text-2xl font-bold">إنشاء نموذج جديد</h1>
      <FormWizard />
    </div>
  );
}
