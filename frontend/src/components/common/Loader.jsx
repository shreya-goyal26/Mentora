export default function Loader({ text = "Loading...", size = "md" }) {
  return (
    <div className={`loader-container loader-${size}`}>
      <div className="loader-spinner" />
      {text && <p className="loader-text">{text}</p>}
    </div>
  );
}
