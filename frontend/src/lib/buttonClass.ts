type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

const press =
  'shadow-[3px_3px_0_0_#141414] hover:-translate-y-0.5 hover:shadow-[4px_5px_0_0_#141414] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none';

const buttonVariants: Record<ButtonVariant, string> = {
  primary: `border-2 border-border bg-primary text-white hover:bg-primary-hover disabled:bg-primary/50 ${press}`,
  secondary: `border-2 border-border bg-surface text-text hover:bg-accent ${press}`,
  ghost: 'text-text-muted hover:bg-surface-muted hover:text-text',
  danger: `border-2 border-border bg-danger text-white hover:bg-danger/90 disabled:bg-danger/50 ${press}`,
};

export function buttonClass(
  variant: ButtonVariant = 'primary',
  className = '',
): string {
  return `inline-flex h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-extrabold transition duration-150 disabled:cursor-not-allowed disabled:opacity-60 ${buttonVariants[variant]} ${className}`;
}