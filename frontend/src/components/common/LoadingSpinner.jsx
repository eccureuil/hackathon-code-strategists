// frontend/src/components/common/LoadingSpinner.jsx
export const LoadingSpinner = ({ size = "md", fullScreen = false }) => {
  const sizes = {
    sm: "w-5 h-5",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  const spinner = (
    <div className={`${sizes[size]} border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin`} />
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-xl flex flex-col items-center gap-3">
          {spinner}
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return spinner;
};