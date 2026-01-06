import { JSX, splitProps } from "solid-js";

interface TextareaProps extends JSX.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export function Textarea(props: TextareaProps) {
  const [local, others] = splitProps(props, ["label", "class"]);

  return (
    <div class="flex flex-col gap-1.5 w-full">
      {local.label && (
        <label class="text-sm font-semibold text-slate-700 ml-1">{local.label}</label>
      )}
      <textarea
        {...others}
        class={`
          flex min-h-[80px] w-full rounded-lg border border-slate-200 bg-white px-3 py-2 
          text-sm placeholder:text-slate-500 focus-visible:outline-none 
          focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
          disabled:cursor-not-allowed disabled:opacity-50
          ${local.class}
        `}
      />
    </div>
  );
}