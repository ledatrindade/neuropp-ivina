type ImagePlaceholderProps = { title: string; description?: string };
export function ImagePlaceholder({ title, description }: ImagePlaceholderProps) {
  return (
    <div className="flex aspect-[4/5] w-full items-center justify-center rounded-[1.75rem] bg-[#3E8E91]/10 p-8 text-center">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#3E8E91]">Imagem</p>
        <h3 className="mt-4 text-2xl font-bold text-[#333333]">{title}</h3>
        {description && <p className="mt-3 text-sm leading-6 text-[#333333]/70">{description}</p>}
      </div>
    </div>
  );
}
