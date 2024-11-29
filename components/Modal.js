export function Modal({ data }) {
  return (
    <div className="w-full">
      <div
        id="select-modal"
        tabindex="-1"
        aria-hidden="true"
        className="overflow-y-auto overflow-x-hidden z-50 max-h-full w-full flex justify-center items-center"
      >
        <div className="p-4 w-full max-w-md max-h-full">
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <div className="flex items-center justify-between   rounded-t dark:border-gray-600"></div>
            <div className="p-4 md:p-5">
              <p className="text-gray-500 dark:text-gray-400 mb-4">Serviços:</p>
              <ul className="space-y-4 mb-4">
                {Object.entries(data).map(([key, value]) => (
                  <li key={key}>
                    <input
                      type="radio"
                      id={`job-${key}`}
                      name="job"
                      value={`job-${key}`}
                      className="hidden peer"
                      required
                    />
                    <label
                      htmlFor={`job-${key}`}
                      className="inline-flex items-center justify-between w-full p-5 text-gray-900 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-500 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-900 hover:bg-gray-100 dark:text-white dark:bg-gray-600 dark:hover:bg-gray-500"
                    >
                      <div className="block">
                        <div className="w-full text-lg font-semibold">{key}</div>
                        <div className="w-full text-gray-500 dark:text-gray-400">
                          {typeof value === "object"
                            ? Object.entries(value).map(([key, value], index) => (
                                <p key={index} className="mb-2 text-gray-500 dark:text-gray-400">
                                  <span className="font-bold capitalize">{key}:</span> {value}
                                </p>
                              ))
                            : ""}
                        </div>
                      </div>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
