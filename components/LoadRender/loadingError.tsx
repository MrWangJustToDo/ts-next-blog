import { LoadingErrorType } from "types/components";

const LoadingError: LoadingErrorType = (error) => (
  <div className="text-truncate text-danger p-2" title={error}>
    loading failed: {error}
  </div>
);

export default LoadingError;
