type RequiredLabelProps = {
  children: React.ReactNode;
  required?: boolean;
};

export function RequiredLabel({ children, required = false }: RequiredLabelProps) {
  return (
    <span>
      {children}
      {required ? <span className="text-red-500 ml-0.5">*</span> : null}
    </span>
  );
}
