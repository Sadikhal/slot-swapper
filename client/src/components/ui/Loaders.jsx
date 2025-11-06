
export const Loader = () => (
  <div className="flex justify-center items-center min-h-[70vh]">
    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#0E6472]"></div>
  </div>
);

export const ErrorFallback = ({ message }) => (
  <div className="text-center flex items-center justify-center flex-col w-full p-6 font-poppins">
    <h2 className="text-2xl font-semibold text-red-700 mb-4">Error</h2>
    <p className="text-red-900 mb-4">{message || 'some thing went wrong, please try again'}</p>
  </div>
);
