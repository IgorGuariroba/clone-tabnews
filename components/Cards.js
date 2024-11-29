export function Cards({ data }) {
  return (
    <div>
      <div className="grid mb-8 border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 md:mb-12 md:grid-cols-2 bg-white dark:bg-gray-800">
        {Object.entries(data).map(([key, value], index) => (
          <figure
            key={index}
            className="flex flex-col items-center justify-center p-8 text-center bg-white border-b border-gray-200 rounded-t-lg md:rounded-t-none md:rounded-ss-lg md:border-e dark:bg-gray-800 dark:border-gray-700"
          >
            <blockquote className="max-w-2xl mx-auto mb-4 text-gray-500 lg:mb-8 dark:text-gray-400">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{key}</h3>
            </blockquote>

            {typeof value === "object"
              ? Object.entries(value).map(([key, value], index) => (
                  <figcaption key={index} className=" w-full text-left">
                    <div className="space-y-0.5 font-medium dark:text-white ms-3">
                      <span>{key}: </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400 ">{value}</span>
                    </div>
                  </figcaption>
                ))
              : ""}
          </figure>
        ))}
      </div>
    </div>
  );
}
