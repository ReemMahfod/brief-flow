export default function Panel({ children, className = '', padding = true }) {
  return (
    <section className={`panel overflow-hidden ${padding ? 'p-5' : ''} ${className}`}>
      {children}
    </section>
  );
}
