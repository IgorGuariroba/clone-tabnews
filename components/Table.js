export function Table({ data }) {
  return (
    <div className="w-2/4">
      {Object.entries(data).map(([key, value], index) => (
        <div
          key={index}
          className="relative overflow-x-auto shadow-md sm:rounded-lg sm:rounded-b-lg border border-gray-700 mb-6 w-full"
        >
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3 text-left">
                  {key}
                </th>
                <th scope="col" className="text-right px-6 py-3">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {typeof value === "object"
                ? Object.entries(value).map(([key, value], index) => (
                    <tr
                      key={index}
                      className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
                    >
                      <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {key}
                      </th>
                      <td className="px-6 py-4 text-right">{value}</td>
                    </tr>
                  ))
                : ""}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
