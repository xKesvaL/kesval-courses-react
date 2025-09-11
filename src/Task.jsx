export function Task({ task }) {
  return <li key={task.id} className="border rounded-lg p-4">
    <h3 className="font-bold">{task.title}</h3>
    <p>{task.description}</p>
  </li>
}