import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

export function Accordion({ data }) {
  const [openItem, setOpenItem] = useState(null);

  const toggleItem = (item) => {
    setOpenItem(openItem === item ? null : item);
  };

  const entries = Object.entries(data);
  return (
    <div id="accordion-collapse" data-accordion="collapse" className="w-2/4">
      {Object.entries(data).map(([key, value], index) => (
        <div key={index}>
          <h2 id={`accordion-collapse-heading-${index}`}>
            {typeof value === "object" ? (
              <button
                type="button"
                className={
                  index === 0
                    ? "flex items-center justify-between w-full p-5 font-medium rtl:text-right text-gray-500 border border-b-0 border-gray-200 rounded-t-xl focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 gap-3"
                    : index === entries.length - 1
                      ? "flex items-center justify-between w-full p-5 font-medium rtl:text-right text-gray-500 border border-gray-200 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 gap-3"
                      : "flex items-center justify-between w-full p-5 font-medium rtl:text-right text-gray-500 border border-b-0 border-gray-200 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 gap-3"
                }
                data-accordion-target={`#accordion-collapse-body-${index}`}
                aria-expanded={openItem === index}
                aria-controls={`accordion-collapse-body-${index}`}
                onClick={() => toggleItem(index)}
              >
                <span className="capitalize">{key}</span>
                {openItem === index ? (
                  <FaChevronUp className="w-3 h-3 shrink-0" />
                ) : (
                  <FaChevronDown className="w-3 h-3 shrink-0" />
                )}
              </button>
            ) : (
              ""
            )}
          </h2>
          <div
            id={`accordion-collapse-body-${index}`}
            className={`${openItem === index ? "" : "hidden"}`}
            aria-labelledby={`accordion-collapse-heading-${index}`}
          >
            <div className="p-5 border border-b-0 border-gray-200 dark:border-gray-700 dark:bg-gray-900">
              {typeof value === "object"
                ? Object.entries(value).map(([key, value], index) => (
                    <p key={index} className="mb-2 text-gray-500 dark:text-gray-400">
                      <span className="font-bold capitalize">{key}:</span> {value}
                    </p>
                  ))
                : ""}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
