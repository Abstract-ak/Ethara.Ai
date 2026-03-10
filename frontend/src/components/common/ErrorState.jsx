import { HiOutlineExclamationCircle } from "react-icons/hi";

export default function ErrorState({
  message = "Something went wrong",
  onRetry,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <HiOutlineExclamationCircle className="w-12 h-12 text-red-400 mb-4" />
      <h3 className="text-lg font-semibold text-gray-700">Error</h3>
      <p className="text-sm text-red-500 mt-1">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
