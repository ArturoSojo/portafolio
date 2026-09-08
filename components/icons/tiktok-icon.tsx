/**
 * Logo de TikTok. No existe en lucide-react (es una marca, no un icono genérico),
 * así que se dibuja a mano. Acepta las mismas props que los iconos de lucide
 * que lo rodean en `socialNetworks` para que encaje en la misma fila.
 */
interface TikTokIconProps {
    size?: number;
    strokeWidth?: number;
    className?: string;
}

export const TikTokIcon = ({ size = 24, className }: TikTokIconProps) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
        aria-hidden="true"
    >
        <path d="M16.6 5.82c-.9-.98-1.4-2.25-1.4-3.57h-3.05v13.6c0 1.62-1.32 2.94-2.94 2.94a2.94 2.94 0 0 1 0-5.88c.28 0 .55.04.8.11V9.9a6.1 6.1 0 0 0-.8-.05A6.09 6.09 0 0 0 3.12 16a6.09 6.09 0 0 0 10.99 3.65 6.06 6.06 0 0 0 1.2-3.65V9.02a8.9 8.9 0 0 0 5.03 1.54V7.5a5.5 5.5 0 0 1-3.74-1.68z" />
    </svg>
);
