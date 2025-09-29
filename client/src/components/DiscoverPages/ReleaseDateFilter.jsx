import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function ReleaseDates({ filters, setFilters }) {
  // Convert string/null to Date object for DatePicker
  const fromDate = filters.dateFrom ? new Date(filters.dateFrom) : null;
  const toDate = filters.dateTo ? new Date(filters.dateTo) : null;

  return (
    <div className="border-t border-gray-800">
      <label className="block font-medium text-primary-2 mb-2">Release Dates</label>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="text-xs text-primary-2 text-left w-16">From</span>
          <DatePicker
            selected={fromDate}
            onChange={(date) =>
              setFilters((f) => ({
                ...f,
                dateFrom: date ? date.toISOString().slice(0, 10) : null,
              }))
            }
            dateFormat="dd-MM-yyyy"
            className="w-40 px-3 py-2 text-sm rounded-lg cursor-pointer text-gray-300 bg-gray-800 border border-gray-600 focus:outline-none"
            placeholderText="Select date"
            maxDate={toDate}
            isClearable
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-primary-2 text-left w-16">To</span>
          <DatePicker
            selected={toDate}
            onChange={(date) =>
              setFilters((f) => ({
                ...f,
                dateTo: date ? date.toISOString().slice(0, 10) : null,
              }))
            }
            dateFormat="dd-MM-yyyy"
            className="w-40 px-3 py-2 text-base rounded-lg cursor-pointer text-gray-300 bg-gray-800 border border-gray-600 focus:outline-none"
            placeholderText="Select date"
            minDate={fromDate}
            isClearable
          />
        </div>
      </div>
    </div>
  );
}
