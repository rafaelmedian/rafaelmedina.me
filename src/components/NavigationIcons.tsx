import type { SVGProps } from "react"

type IconProps = Omit<SVGProps<SVGSVGElement>, "children"> & { size?: number | string }

function NavigationIcon({ size = 24, children, ...props }: SVGProps<SVGSVGElement> & { size?: number | string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true" {...props}>
      {children}
    </svg>
  )
}

export function X(props: IconProps) {
  return <NavigationIcon {...props}><path d="m6 6 12 12M18 6 6 18" /></NavigationIcon>
}

export function ChevronLeft(props: IconProps) {
  return <NavigationIcon {...props}><path d="m15 5-7 7 7 7" /></NavigationIcon>
}

export function ChevronRight(props: IconProps) {
  return <NavigationIcon {...props}><path d="m9 5 7 7-7 7" /></NavigationIcon>
}

export function ChevronUp(props: IconProps) {
  return <NavigationIcon {...props}><path d="m5 15 7-7 7 7" /></NavigationIcon>
}

export function ArrowUpRight(props: IconProps) {
  return <NavigationIcon {...props}><path d="M6 18 18 6M6 6h12v12" /></NavigationIcon>
}

export function ArrowUp(props: IconProps) {
  return <NavigationIcon {...props}><path d="M12 20V4m-7 7 7-7 7 7" /></NavigationIcon>
}

export function ExternalLink(props: IconProps) {
  return <NavigationIcon {...props}><path d="M14 4h6v6m-9 3 9-9M10 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4" /></NavigationIcon>
}
