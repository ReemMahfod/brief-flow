import Panel from './Panel';

export default function FilterBar({ children }) {
  return (
    <Panel padding={false} className="p-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {children}
      </div>
    </Panel>
  );
}
