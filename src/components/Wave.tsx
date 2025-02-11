
const Wave = () => {
  return (
    <div className="waves-container fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <svg
        className="waves h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        viewBox="0 24 150 28"
        preserveAspectRatio="none"
      >
        <defs>
          <path
            id="wave"
            d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
          />
        </defs>
        <g className="wave-parallax">
          <use
            xlinkHref="#wave"
            x="48"
            y="0"
            fill="rgba(26, 31, 44, 0.4)"
            className="animate-wave1"
          />
          <use
            xlinkHref="#wave"
            x="48"
            y="3"
            fill="rgba(26, 31, 44, 0.3)"
            className="animate-wave2"
          />
          <use
            xlinkHref="#wave"
            x="48"
            y="5"
            fill="rgba(26, 31, 44, 0.2)"
            className="animate-wave3"
          />
          <use
            xlinkHref="#wave"
            x="48"
            y="7"
            fill="rgba(26, 31, 44, 0.1)"
            className="animate-wave4"
          />
        </g>
      </svg>
    </div>
  );
};

export default Wave;
