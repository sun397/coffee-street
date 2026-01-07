import { USERS } from "./_constants/mockData";

export default function DaisyUIPage() {
  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold">daisyUI Comparison</h1>

      {/* カード形式のリスト */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {USERS.map((user) => (
          <div
            key={user.id}
            className="card w-full bg-base-100 shadow-xl border border-base-300"
          >
            <div className="card-body">
              <h2 className="card-title">{user.name}</h2>
              <p className="text-sm text-gray-500">{user.email}</p>
              <div className="badge badge-primary">{user.role}</div>
              <div className="card-actions justify-end mt-4">
                <button className="btn btn-sm btn-outline">詳細を見る</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* テーブル */}
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {USERS.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
