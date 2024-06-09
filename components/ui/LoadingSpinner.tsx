const LoadingSpinner = () => (
    <div className="flex items-center justify-center space-x-2 animate-spin">
        <div className="w-3 h-3 rounded-full bg-indigo-600"></div>
        <div className="w-3 h-3 rounded-full bg-purple-600"></div>
        {/* <div className="w-2 h-2 rounded-full bg-blue-600"></div> */}
        
    </div>
);

export default LoadingSpinner;
