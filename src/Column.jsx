import { Task } from "./Task";

export function Column({ status, tasks }) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-bold">{status}</h2>
      <div className="border rounded-lg grow p-4">
        <ul className="flex flex-col gap-4">
          {tasks.map((task) => {
            return <Task key={task.id} task={task} />;
          })}
        </ul>
      </div>
    </div>
  );
}
