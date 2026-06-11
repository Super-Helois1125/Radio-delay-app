/** Full-viewport animated gradient mesh behind all pages. */
export function AnimatedBackground() {
  return (
    <div className="animated-bg" aria-hidden="true">
      <div className="animated-bg__gradient" />
      <div className="animated-bg__orb animated-bg__orb--1" />
      <div className="animated-bg__orb animated-bg__orb--2" />
      <div className="animated-bg__orb animated-bg__orb--3" />
      <div className="animated-bg__sweep" />
      <div className="animated-bg__grid" />
      <div className="animated-bg__vignette" />
      <div className="animated-bg__noise" />
    </div>
  );
}
