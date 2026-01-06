import { JSX, splitProps } from "solid-js";

interface InputProps extends JSX.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input(props: InputProps) {
  // splitProps separates our custom props from standard HTML input props
  const [local, others] = splitProps(props, ["label", "error", "class"]);

  return (
    <div class="flex flex-col gap-1.5 w-full">
      {local.label && (
        <label class="text-sm font-semibold text-slate-700 ml-1">
          {local.label}
        </label>
      )}
      <input
        {...others}
        class={`
          flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 
          text-sm ring-offset-white file:border-0 file:bg-transparent 
          file:text-sm file:font-medium placeholder:text-slate-500 
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary 
          focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50
          transition-all duration-200
          ${local.error ? "border-red-500 focus-visible:ring-red-500" : "hover:border-slate-300"}
          ${local.class}
        `}
      />
      {local.error && (
        <span class="text-xs text-red-500 mt-1 ml-1">{local.error}</span>
      )}
    </div>
  );
}