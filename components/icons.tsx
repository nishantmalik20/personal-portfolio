import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function base(props: IconProps): IconProps {
  return {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2.2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
    ...props,
  };
}

export function IconCode(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="m8 7-5 5 5 5" />
      <path d="m16 7 5 5-5 5" />
      <path d="m13.5 5-3 14" />
    </svg>
  );
}

export function IconPalette(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 3a9 9 0 1 0 0 18h1.5a2.5 2.5 0 0 0 0-5H12a2 2 0 0 1-2-2c0-1.1.9-2 2-2h7a2 2 0 0 0 2-2 7 7 0 0 0-9-7Z" />
      <circle cx="7.5" cy="10.5" r="0.6" fill="currentColor" stroke="none" />
      <circle cx="10" cy="7" r="0.6" fill="currentColor" stroke="none" />
      <circle cx="14.5" cy="6.5" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconGradCap(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M2 9.5 12 4l10 5.5L12 15 2 9.5Z" />
      <path d="M6.5 12v4.2c0 1.5 2.5 2.8 5.5 2.8s5.5-1.3 5.5-2.8V12" />
      <path d="M22 9.5V15" />
    </svg>
  );
}

export function IconHeart(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M19.5 5.2a5 5 0 0 0-7 0L12 5.7l-.5-.5a5 5 0 0 0-7 7l.5.5 7 7 7-7 .5-.5a5 5 0 0 0 0-7Z" />
    </svg>
  );
}

export function IconMaple(props: IconProps) {
  return (
    <svg
      width={20}
      height={20}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      {...props}
    >
      <polygon points="12,1.6 13,6.6 15.5,4.9 14.6,8.4 18.4,7.3 16.4,10.4 21,10.8 17.2,13.3 20.2,15.6 15.6,15.5 16.6,19.4 12.9,17.2 12.7,21.6 11.3,21.6 11.1,17.2 7.4,19.4 8.4,15.5 3.8,15.6 6.8,13.3 3,10.8 7.6,10.4 5.6,7.3 9.4,8.4 8.5,4.9 11,6.6" />
    </svg>
  );
}

export function IconArrowDown(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 4v16" />
      <path d="m6 14 6 6 6-6" />
    </svg>
  );
}

export function IconSend(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M22 2 11 13" />
      <path d="m22 2-7 20-4-9-9-4 20-7Z" />
    </svg>
  );
}

export function IconCheck(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="10" />
      <path d="m8 12.5 2.7 2.7L16.5 9" />
    </svg>
  );
}

export function IconSpinner(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M21 12a9 9 0 1 1-6.2-8.56" />
    </svg>
  );
}

export function IconMail(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="2.5" y="5" width="19" height="14" rx="3" />
      <path d="m3.5 7 8.5 6 8.5-6" />
    </svg>
  );
}

export function IconPin(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11Z" />
      <circle cx="12" cy="10" r="2.6" />
    </svg>
  );
}

export function IconGithub(props: IconProps) {
  return (
    <svg
      width={20}
      height={20}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      {...props}
    >
      <path d="M12 .8a11.3 11.3 0 0 0-3.57 22c.56.1.77-.25.77-.54v-2.1c-3.14.68-3.8-1.34-3.8-1.34-.51-1.3-1.25-1.65-1.25-1.65-1.03-.7.08-.69.08-.69 1.13.08 1.73 1.17 1.73 1.17 1 1.74 2.65 1.24 3.3.95.1-.74.4-1.24.71-1.53-2.5-.28-5.14-1.25-5.14-5.58 0-1.23.44-2.24 1.16-3.03-.12-.28-.5-1.43.1-2.98 0 0 .95-.3 3.1 1.16a10.8 10.8 0 0 1 5.66 0c2.14-1.46 3.09-1.16 3.09-1.16.61 1.55.23 2.7.11 2.98.72.79 1.16 1.8 1.16 3.03 0 4.34-2.65 5.3-5.17 5.57.41.35.77 1.04.77 2.1v3.12c0 .3.2.65.78.54A11.3 11.3 0 0 0 12 .8Z" />
    </svg>
  );
}

export function IconLinkedin(props: IconProps) {
  return (
    <svg
      width={20}
      height={20}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      {...props}
    >
      <path d="M20.4 20.4h-3.55v-5.56c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.66H9.31V9h3.41v1.56h.05a3.74 3.74 0 0 1 3.36-1.85c3.6 0 4.27 2.37 4.27 5.46v6.23ZM5.3 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.09 20.4H3.52V9h3.57v11.4Z" />
    </svg>
  );
}

export function IconInstagram(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconX(props: IconProps) {
  return (
    <svg
      width={20}
      height={20}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      {...props}
    >
      <path d="M18.9 2.1h3.2l-7.1 8.1 8.3 11.7h-6.5l-5.1-6.7-5.9 6.7H2.6l7.5-8.6L2.1 2.1h6.7l4.6 6.1 5.5-6.1Zm-1.1 17.9h1.8L7.8 3.9H5.9L17.8 20Z" />
    </svg>
  );
}

