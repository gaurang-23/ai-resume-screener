const LogoMark = ({ className = "h-6 w-6" }) => (
  <svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="1" y="1" width="26" height="26" rx="6" stroke="currentColor" strokeWidth="1.5" />
    <path d="M8 10h12M8 14h12M8 18h7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export default LogoMark;
