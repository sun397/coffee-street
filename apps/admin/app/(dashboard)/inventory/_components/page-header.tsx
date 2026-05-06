interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <div className="flex items-end justify-between">
      <div className="grid gap-1">
        <h1 className="font-serif text-3xl font-bold tracking-tight text-stone-900">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-stone-500">
            {description}
          </p>
        )}
      </div>
      <div className="flex items-center gap-2">
        {children}
      </div>
    </div>
  );
}